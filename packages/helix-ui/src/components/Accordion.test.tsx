import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

function Setup({
  type,
  defaultValue,
}: {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}) {
  return (
    <Accordion type={type} defaultValue={defaultValue}>
      <Accordion.Item value="a">
        <Accordion.Trigger>A header</Accordion.Trigger>
        <Accordion.Content>A body</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>B header</Accordion.Trigger>
        <Accordion.Content>B body</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('all collapsed by default', () => {
    render(<Setup />);
    expect(screen.queryByText('A body')).not.toBeInTheDocument();
    expect(screen.queryByText('B body')).not.toBeInTheDocument();
  });

  it('opens an item on trigger click', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'A header' }));
    expect(screen.getByText('A body')).toBeInTheDocument();
  });

  it('toggles closed on second click', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    const trigger = screen.getByRole('button', { name: 'A header' });
    await user.click(trigger);
    expect(screen.getByText('A body')).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByText('A body')).not.toBeInTheDocument();
  });

  it('single mode: opening one closes the other', async () => {
    const user = userEvent.setup();
    render(<Setup type="single" defaultValue="a" />);
    expect(screen.getByText('A body')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'B header' }));
    expect(screen.getByText('B body')).toBeInTheDocument();
    expect(screen.queryByText('A body')).not.toBeInTheDocument();
  });

  it('multiple mode: both can be open', async () => {
    const user = userEvent.setup();
    render(<Setup type="multiple" />);
    await user.click(screen.getByRole('button', { name: 'A header' }));
    await user.click(screen.getByRole('button', { name: 'B header' }));
    expect(screen.getByText('A body')).toBeInTheDocument();
    expect(screen.getByText('B body')).toBeInTheDocument();
  });

  it('aria-expanded reflects state', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    const trigger = screen.getByRole('button', { name: 'A header' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('content has region role and is labeled by the trigger', async () => {
    const user = userEvent.setup();
    render(<Setup />);
    await user.click(screen.getByRole('button', { name: 'A header' }));
    const region = screen.getByRole('region', { name: 'A header' });
    expect(region).toHaveTextContent('A body');
  });
});
