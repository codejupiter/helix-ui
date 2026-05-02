import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu } from './DropdownMenu';

function Setup({ onSave, onDelete }: { onSave?: () => void; onDelete?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <button>Options</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Menu>
        <DropdownMenu.Item onSelect={onSave}>Save</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={onDelete}>Delete</DropdownMenu.Item>
      </DropdownMenu.Menu>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('hidden until trigger is clicked', () => {
    render(<Setup />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('closes menu and calls onSelect when item is clicked', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<Setup onSave={onSave} />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await user.click(screen.getByRole('menuitem', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('focuses first item when menu opens', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
  });

  it('arrow down moves focus to next item', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('Enter selects the focused item', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Setup onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('trigger gets aria-expanded', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    const trigger = screen.getByRole('button', { name: 'Options' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
