import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders an accessible checkbox role', () => {
    render(<Checkbox>Agree</Checkbox>);
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeInTheDocument();
  });

  it('toggles when clicked (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<Checkbox>Subscribe</Checkbox>);
    const cb = screen.getByRole('checkbox', { name: 'Subscribe' });
    expect(cb).not.toBeChecked();
    await user.click(cb);
    expect(cb).toBeChecked();
    await user.click(cb);
    expect(cb).not.toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(<Checkbox defaultChecked>On</Checkbox>);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Controlled() {
      const [v, setV] = useState(false);
      return (
        <Checkbox
          checked={v}
          onChange={(e) => {
            setV(e.target.checked);
            onChange(e.target.checked);
          }}
        >
          Controlled
        </Checkbox>
      );
    }

    render(<Controlled />);
    const cb = screen.getByRole('checkbox');
    await user.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(cb).toBeChecked();
  });

  it('label click toggles the checkbox', async () => {
    const user = userEvent.setup();
    render(<Checkbox>Click my label</Checkbox>);
    const cb = screen.getByRole('checkbox');
    await user.click(screen.getByText('Click my label'));
    expect(cb).toBeChecked();
  });

  it('supports disabled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox disabled onChange={onChange}>
        Disabled
      </Checkbox>
    );
    const cb = screen.getByRole('checkbox');
    expect(cb).toBeDisabled();
    await user.click(cb);
    expect(onChange).not.toHaveBeenCalled();
  });
});
