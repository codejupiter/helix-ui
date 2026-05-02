import {
  useState,
  useRef,
  useEffect,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';
import { useOutsideClick } from '../hooks/useOutsideClick';

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  /**
   * Content rendered inside the popover when open.
   */
  content: ReactNode;

  /**
   * Side of the trigger to position the popover on.
   * @default 'bottom'
   */
  side?: PopoverSide;

  /**
   * The element that toggles the popover when clicked.
   * Must be a single React element.
   */
  children: ReactElement;

  /**
   * Controlled open state. Omit for uncontrolled behavior.
   */
  open?: boolean;

  /**
   * Called whenever the open state changes (both directions).
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Popover — click-triggered floating panel.
 *
 * Behaviors:
 * - Toggles on trigger click
 * - Closes on outside click
 * - Closes on Escape key
 * - Trigger gets `aria-expanded` and `aria-controls` for screen readers
 *
 * Supports both controlled (pass `open` + `onOpenChange`) and uncontrolled modes.
 *
 * @example
 *   <Popover content={<MenuItems />}>
 *     <Button>Open menu</Button>
 *   </Popover>
 */
export function Popover({
  content,
  side = 'bottom',
  children,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const containerRef = useRef<HTMLSpanElement>(null);
  const popoverId = useHelixId('popover');

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  // Close on outside click
  useOutsideClick(containerRef, () => setOpen(false), open);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const trigger = cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      setOpen(!open);
    },
    'aria-expanded': open,
    'aria-controls': popoverId,
    'aria-haspopup': 'dialog',
  } as Partial<typeof children.props>);

  return (
    <span ref={containerRef} className="helix-popover-wrapper">
      {trigger}
      {open ? (
        <div
          id={popoverId}
          role="dialog"
          className={cx('helix-popover', `helix-popover--${side}`)}
        >
          {content}
        </div>
      ) : null}
    </span>
  );
}
