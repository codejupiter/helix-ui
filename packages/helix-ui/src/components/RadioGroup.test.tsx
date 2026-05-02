import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { RadioGroup, Radio } from './RadioGroup';

describe('RadioGroup', () => {
  it('renders a radiogroup containing radios', () => {
    render(
      <RadioGroup name="size" value="md" onChange={() => {}} aria-label="Size">
        <Radio value="sm">Small</Radio>
        <Radio value="md">Medium</Radio>
        <Radio value="lg">Large</Radio>
      </RadioGroup>
    );
    expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('marks the matching radio as checked', () => {
    render(
      <RadioGroup name="size" value="md" onChange={() => {}}>
        <Radio value="sm">Small</Radio>
        <Radio value="md">Medium</Radio>
      </RadioGroup>
    );
    expect(screen.getByRole('radio', { name: 'Small' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
  });

  it('calls onChange with the new value when an option is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup name="size" value="md" onChange={onChange}>
        <Radio value="sm">Small</Radio>
        <Radio value="lg">Large</Radio>
      </RadioGroup>
    );
    await user.click(screen.getByRole('radio', { name: 'Small' }));
    expect(onChange).toHaveBeenCalledWith('sm');
  });

  it('enforces mutual exclusivity (controlled)', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [v, setV] = useState('a');
      return (
        <RadioGroup name="g" value={v} onChange={setV}>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
    }

    render(<Controlled />);
    const a = screen.getByRole('radio', { name: 'A' });
    const b = screen.getByRole('radio', { name: 'B' });

    expect(a).toBeChecked();
    await user.click(b);
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });

  it('group-level disabled disables every radio', () => {
    render(
      <RadioGroup name="g" value="a" onChange={() => {}} disabled>
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>
    );
    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('individual radio can be disabled', () => {
    render(
      <RadioGroup name="g" value="a" onChange={() => {}}>
        <Radio value="a">A</Radio>
        <Radio value="b" disabled>
          B
        </Radio>
      </RadioGroup>
    );
    expect(screen.getByRole('radio', { name: 'A' })).not.toBeDisabled();
    expect(screen.getByRole('radio', { name: 'B' })).toBeDisabled();
  });

  it('throws helpful error if Radio is used outside RadioGroup', () => {
    // Suppress React's expected error log for this negative test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Radio value="orphan">Orphan</Radio>)).toThrow(
      /must be used inside a <RadioGroup>/
    );
    spy.mockRestore();
  });
});
