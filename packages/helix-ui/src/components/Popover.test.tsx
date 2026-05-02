import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';

describe('Popover', () => {
  it('hidden by default', () => {
    render(
      <Popover content={<div>Menu</div>}>
        <button>Open</button>
      </Popover>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Menu</div>}>
        <button>Open</button>
      </Popover>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Menu');
  });

  it('toggles closed on second trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Popover content="Hi">
        <button>Open</button>
      </Popover>
    );
    const btn = screen.getByRole('button');
    await user.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(btn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Popover content="Hi">
        <button>Open</button>
      </Popover>
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover content="Inside">
          <button>Open</button>
        </Popover>
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Popover content="Hi" open={true} onOpenChange={onOpenChange}>
        <button>Open</button>
      </Popover>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('sets aria-expanded on the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Popover content="Hi">
        <button>Open</button>
      </Popover>
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
});
