import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('does not render content by default', () => {
    render(
      <Tooltip content="Save your work">
        <button>Save</button>
      </Tooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on hover after delay', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Tooltip content="Save your work" delay={100}>
        <button>Save</button>
      </Tooltip>
    );
    await user.hover(screen.getByRole('button'));
    // wait for the configured delay
    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Save your work');
  });

  it('hides tooltip on unhover', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Tooltip content="Hi" delay={50}>
        <button>X</button>
      </Tooltip>
    );
    const btn = screen.getByRole('button');
    await user.hover(btn);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.unhover(btn);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on focus and hides on blur', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Tooltip content="Focused" delay={0}>
        <button>X</button>
      </Tooltip>
    );
    await user.tab(); // focus the button
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.tab(); // move focus away
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('links trigger to tooltip via aria-describedby', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Tooltip content="Hi" delay={0}>
        <button>X</button>
      </Tooltip>
    );
    await user.hover(screen.getByRole('button'));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    const tooltip = screen.getByRole('tooltip');
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('applies side class', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Tooltip content="Hi" side="bottom" delay={0}>
        <button>X</button>
      </Tooltip>
    );
    await user.hover(screen.getByRole('button'));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(screen.getByRole('tooltip')).toHaveClass('helix-tooltip--bottom');
  });
});
