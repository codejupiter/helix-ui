import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('exposes role="slider" with aria values', () => {
    render(<Slider value={50} onChange={() => {}} aria-label="Volume" />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('arrow right increments value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} aria-label="x" />);
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(51);
  });

  it('arrow left decrements value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} aria-label="x" />);
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith(49);
  });

  it('Home goes to min, End goes to max', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider value={50} onChange={onChange} min={0} max={100} aria-label="x" />
    );
    screen.getByRole('slider').focus();
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenCalledWith(0);
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('respects step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider value={20} onChange={onChange} step={5} aria-label="x" />
    );
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(25);
  });

  it('clamps at boundaries', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider value={100} onChange={onChange} aria-label="x" />);
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('controlled mode updates as expected', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [v, setV] = useState(0);
      return <Slider value={v} onChange={setV} aria-label="x" />;
    }

    render(<Controlled />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '3');
  });

  it('disabled removes from tab order', () => {
    render(<Slider value={50} onChange={() => {}} disabled aria-label="x" />);
    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '-1');
  });
});
