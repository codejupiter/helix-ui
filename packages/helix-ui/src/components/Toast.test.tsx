import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

function Trigger({
  options,
}: {
  options: Parameters<ReturnType<typeof useToast>['toast']>[0];
}) {
  const { toast } = useToast();
  return <button onClick={() => toast(options)}>Show</button>;
}

describe('Toast', () => {
  it('renders viewport even before any toast is shown', () => {
    render(
      <ToastProvider>
        <div>app</div>
      </ToastProvider>
    );
    expect(
      screen.getByRole('region', { name: 'Notifications' })
    ).toBeInTheDocument();
  });

  it('shows a toast when triggered', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger options={{ title: 'Saved' }} />
      </ToastProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('renders title + description', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger
          options={{ title: 'File saved', description: 'Successfully' }}
        />
      </ToastProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('File saved')).toBeInTheDocument();
    expect(screen.getByText('Successfully')).toBeInTheDocument();
  });

  it('dismisses on close button click', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger options={{ title: 'Hi', duration: 0 }} />
      </ToastProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('auto-dismisses after duration', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <Trigger options={{ title: 'Auto', duration: 100 }} />
      </ToastProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 200));
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('stacks multiple toasts', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger options={{ title: 'A', duration: 0 }} />
      </ToastProvider>
    );
    const btn = screen.getByRole('button', { name: 'Show' });
    await user.click(btn);
    await user.click(btn);
    await user.click(btn);
    expect(screen.getAllByRole('status')).toHaveLength(3);
  });
});
