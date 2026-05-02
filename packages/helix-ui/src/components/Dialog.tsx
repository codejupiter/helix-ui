import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';
import { useFocusTrap } from '../hooks/useFocusTrap';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog subcomponents must be used inside <Dialog>.');
  return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface DialogProps {
  /**
   * Controlled open state. Omit for uncontrolled.
   */
  open?: boolean;

  /**
   * Default open state in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Called when the dialog requests to close (Escape, backdrop click, X button).
   */
  onOpenChange?: (open: boolean) => void;

  children: ReactNode;
}

function DialogRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolled;

  const titleId = useHelixId('dialog-title');
  const descriptionId = useHelixId('dialog-description');

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolled(next);
    onOpenChange?.(next);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function DialogTrigger({ children }: { children: ReactElement }) {
  const ctx = useDialogContext();
  return cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      ctx.setOpen(true);
    },
  } as Partial<typeof children.props>);
}

// ---------------------------------------------------------------------------
// Content (the modal itself + backdrop)
// ---------------------------------------------------------------------------

interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function DialogContent({ className, children, ...rest }: DialogContentProps) {
  const ctx = useDialogContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus trap (active when open)
  useFocusTrap(contentRef, ctx.open);

  // Escape key
  useEffect(() => {
    if (!ctx.open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') ctx.setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ctx.open, ctx]);

  // Scroll lock
  useEffect(() => {
    if (!ctx.open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [ctx.open]);

  if (!ctx.open) return null;

  return (
    <div
      className="helix-dialog-overlay"
      onClick={() => ctx.setOpen(false)}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        aria-describedby={ctx.descriptionId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cx('helix-dialog', className)}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Title (accessible label for the dialog)
// ---------------------------------------------------------------------------

function DialogTitle({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  const ctx = useDialogContext();
  return (
    <h2 id={ctx.titleId} className={cx('helix-dialog__title', className)} {...rest}>
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Description (accessible description for the dialog)
// ---------------------------------------------------------------------------

function DialogDescription({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  const ctx = useDialogContext();
  return (
    <p
      id={ctx.descriptionId}
      className={cx('helix-dialog__description', className)}
      {...rest}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Close (button that closes the dialog)
// ---------------------------------------------------------------------------

function DialogClose({ children }: { children: ReactElement }) {
  const ctx = useDialogContext();
  return cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      ctx.setOpen(false);
    },
  } as Partial<typeof children.props>);
}

/**
 * Dialog — accessible modal.
 *
 * Implements the full ARIA dialog pattern:
 *   - `role="dialog"` + `aria-modal="true"`
 *   - `aria-labelledby` and `aria-describedby` linking to Title/Description
 *   - Focus trap: Tab and Shift+Tab cycle within the dialog
 *   - First focusable element auto-focuses on open
 *   - Focus restored to trigger on close
 *   - Escape key closes
 *   - Backdrop click closes
 *   - Body scroll locked while open
 *
 * @example
 *   <Dialog>
 *     <Dialog.Trigger><Button>Open</Button></Dialog.Trigger>
 *     <Dialog.Content>
 *       <Dialog.Title>Confirm action</Dialog.Title>
 *       <Dialog.Description>This cannot be undone.</Dialog.Description>
 *       <Dialog.Close><Button>Cancel</Button></Dialog.Close>
 *       <Button variant="danger">Delete</Button>
 *     </Dialog.Content>
 *   </Dialog>
 */
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
