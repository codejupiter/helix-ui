import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Select } from './Select';

function Setup({ onChange }: { onChange?: (v: string) => void }) {
  return (
    <Select onChange={onChange} placeholder="Pick" aria-label="City">
      <Select.Listbox>
        <Select.Option value="nyc">New York</Select.Option>
        <Select.Option value="sf">San Francisco</Select.Option>
        <Select.Option value="la">Los Angeles</Select.Option>
      </Select.Listbox>
    </Select>
  );
}

describe('Select', () => {
  it('shows placeholder when no value', () => {
    render(<Setup />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick');
  });

  it('opens listbox on trigger click', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('selecting an option closes listbox and updates value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Setup onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'San Francisco' }));
    expect(onChange).toHaveBeenCalledWith('sf');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('San Francisco');
  });

  it('controlled mode reflects value', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [v, setV] = useState('nyc');
      return (
        <Select value={v} onChange={setV} aria-label="City">
          <Select.Listbox>
            <Select.Option value="nyc">New York</Select.Option>
            <Select.Option value="sf">San Francisco</Select.Option>
          </Select.Listbox>
        </Select>
      );
    }

    render(<Controlled />);
    expect(screen.getByRole('combobox')).toHaveTextContent('New York');
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'San Francisco' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('San Francisco');
  });

  it('Escape closes the listbox', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('arrow keys navigate options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Setup onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    // First option highlighted by default. Arrow down twice → third option.
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('la');
  });

  it('combobox role exposes aria-expanded and aria-controls', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('selected option has aria-selected="true"', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'New York' }));
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'New York' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });
});
