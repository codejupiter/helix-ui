import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders initials from a multi-word name when no src is provided', () => {
    render(<Avatar name="Zoriah Cocio" />);
    expect(screen.getByText('ZC')).toBeInTheDocument();
  });

  it('renders single-letter initial for a one-word name', () => {
    render(<Avatar name="Anthropic" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('uses first and last initials for 3+ word names', () => {
    render(<Avatar name="Mary Jane Watson" />);
    expect(screen.getByText('MW')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar src="/profile.jpg" name="User Name" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/profile.jpg');
    expect(img).toHaveAttribute('alt', 'User Name');
  });

  it('falls back to initials when image fails to load', () => {
    render(<Avatar src="/broken.jpg" name="Fallback User" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('FU')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<Avatar name="X" size="lg" />);
    expect(container.firstChild).toHaveClass('helix-avatar--lg');
  });

  it('initials fallback has accessible label', () => {
    render(<Avatar name="Accessible Name" />);
    expect(screen.getByLabelText('Accessible Name')).toBeInTheDocument();
  });
});
