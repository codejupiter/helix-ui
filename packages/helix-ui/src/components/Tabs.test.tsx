import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

function Setup() {
  return (
    <Tabs defaultValue="a">
      <Tabs.List aria-label="Sections">
        <Tabs.Trigger value="a">A</Tabs.Trigger>
        <Tabs.Trigger value="b">B</Tabs.Trigger>
        <Tabs.Trigger value="c">C</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">Panel A</Tabs.Content>
      <Tabs.Content value="b">Panel B</Tabs.Content>
      <Tabs.Content value="c">Panel C</Tabs.Content>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders tablist + tabs + active panel', () => {
    render(<Setup />);
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });

  it('switches panels on tab click', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('marks the active tab with aria-selected', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await user.click(screen.getByRole('tab', { name: 'C' }));
    expect(screen.getByRole('tab', { name: 'C' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('uses roving tabindex (only active tab is tabbable)', () => {
    render(<Setup />);
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute(
      'tabindex',
      '0'
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute(
      'tabindex',
      '-1'
    );
  });

  it('arrow right moves to next tab', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    const a = screen.getByRole('tab', { name: 'A' });
    a.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('arrow left wraps from first to last', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    screen.getByRole('tab', { name: 'A' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus();
  });

  it('aria-controls links tab to panel', () => {
    render(<Setup />);
    const tab = screen.getByRole('tab', { name: 'A' });
    const panel = screen.getByRole('tabpanel');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
  });
});
