import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders with role="progressbar"', () => {
    render(<Progress value={50} aria-label="Loading" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('exposes aria-valuenow for determinate progress', () => {
    render(<Progress value={42} aria-label="Loading" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '42'
    );
  });

  it('omits aria-valuenow for indeterminate state', () => {
    render(<Progress aria-label="Loading" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute(
      'aria-valuenow'
    );
  });

  it('clamps value within [0, max] range', () => {
    const { rerender } = render(<Progress value={150} aria-label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100'
    );
    rerender(<Progress value={-20} aria-label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0'
    );
  });

  it('respects custom max', () => {
    render(<Progress value={3} max={5} aria-label="x" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
  });

  it('applies indeterminate class when no value', () => {
    render(<Progress aria-label="x" />);
    expect(screen.getByRole('progressbar')).toHaveClass(
      'helix-progress--indeterminate'
    );
  });
});
