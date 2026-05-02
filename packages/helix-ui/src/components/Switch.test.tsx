import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('exposes role="switch" for assistive technology', () => {
    render(<Switch>Notifications</Switch>);
    expect(
      screen.getByRole('switch', { name: 'Notifications' })
    ).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(<Switch>Toggle me</Switch>);
    const sw = screen.getByRole('switch');
    expect(sw).not.toBeChecked();
    await user.click(sw);
    expect(sw).toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(<Switch defaultChecked>On</Switch>);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('fires onChange with the new checked value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>x</Switch>);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledOnce();
    const event = onChange.mock.calls[0]![0];
    expect(event.target.checked).toBe(true);
  });

  it('disabled state prevents interaction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Switch disabled onChange={onChange}>
        Off
      </Switch>
    );
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
