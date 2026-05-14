import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  /**
   * Title shown prominently.
   */
  title: string;

  /**
   * Optional supporting text.
   */
  description?: string;

  /**
   * Visual variant.
   * @default 'info'
   */
  variant?: ToastVariant;

  /**
   * Auto-dismiss after this many ms. Pass 0 for sticky.
   * @default 5000
   */
  duration?: number;
}

interface ToastInstance extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook to call from anywhere in the tree to show a toast.
 *
 * @example
 *   const { toast } = useToast();
 *   toast({ title: 'Saved', variant: 'success' });
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be called inside <ToastProvider>.');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider — wrap your app once
// ---------------------------------------------------------------------------

export interface ToastProviderProps {
  children: ReactNode;
}

let nextId = 0;

/**
 * ToastProvider — wrap your app with this once to enable toasts.
 *
 * Renders a fixed-position viewport at the bottom-right corner that stacks
 * toasts as they're added. Each toast announces via `role="status"` so
 * screen readers pick up the change.
 *
 * @example
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId++;
      const instance: ToastInstance = { id, ...options };
      setToasts((prev) => [...prev, instance]);

      const duration = options.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        className="helix-toast-viewport"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cx(
              'helix-toast',
              `helix-toast--${t.variant ?? 'info'}`
            )}
          >
            <div className="helix-toast__title">{t.title}</div>
            {t.description ? (
              <div className="helix-toast__description">{t.description}</div>
            ) : null}
            <button
              type="button"
              aria-label="Dismiss"
              className="helix-toast__close"
              onClick={() => dismiss(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
