import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';
import { Button } from './Button';

function Setup({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <Dialog.Trigger>
        <button>Open</button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Confirm</Dialog.Title>
        <Dialog.Description>Are you sure?</Dialog.Description>
        <Dialog.Close>
          <Button>Cancel</Button>
        </Dialog.Close>
        <Button>Confirm</Button>
      </Dialog.Content>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('hidden by default', () => {
    render(<Setup />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('exposes role="dialog" with aria-modal="true"', () => {
    render(<Setup defaultOpen />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('links Title via aria-labelledby and Description via aria-describedby', () => {
    render(<Setup defaultOpen />);
    const dialog = screen.getByRole('dialog');
    const title = screen.getByRole('heading', { name: 'Confirm' });
    const description = screen.getByText('Are you sure?');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Setup defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes via Close subcomponent', async () => {
    const user = userEvent.setup();
    render(<Setup defaultOpen />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focuses first focusable element on open', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    // First focusable inside is the Cancel button
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('returns focus to trigger when closed', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });

  it('Tab cycles within the dialog (focus trap)', async () => {
    const user = userEvent.setup();
    render(<Setup defaultOpen />);
    // Cancel auto-focused. Tab once → Confirm. Tab again → wraps back to Cancel.
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
    await user.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });
});
