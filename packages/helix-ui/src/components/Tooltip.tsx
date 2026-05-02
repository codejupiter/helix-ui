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

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /**
   * Tooltip text or content.
   */
  content: ReactNode;

  /**
   * Side of the trigger to position the tooltip on.
   * @default 'top'
   */
  side?: TooltipSide;

  /**
   * Delay in ms before showing on hover. Prevents flicker on quick mouseovers.
   * @default 400
   */
  delay?: number;

  /**
   * The element that triggers the tooltip on hover/focus.
   * Must be a single React element (string children won't work — wrap in a span).
   */
  children: ReactElement;
}

/**
 * Tooltip — small overlay shown on hover or keyboard focus.
 *
 * Implementation notes:
 * - Uses pure CSS positioning (no Floating UI) — relies on the trigger's relative
 *   parent. For complex layout situations a more sophisticated positioning
 *   library would be needed; this works for 90% of cases.
 * - Both hover (mouse) and focus (keyboard) trigger the tooltip, ensuring
 *   keyboard users get the same affordance.
 * - `aria-describedby` links the trigger to the tooltip for screen readers.
 *
 * @example
 *   <Tooltip content="Save your work">
 *     <Button>Save</Button>
 *   </Tooltip>
 */
export function Tooltip({
  content,
  side = 'top',
  delay = 400,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useHelixId('tooltip');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  // Clone the trigger to inject ARIA + event handlers without requiring users
  // to wire them up manually.
  const trigger = cloneElement(children, {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    'aria-describedby': visible ? tooltipId : undefined,
  } as Partial<typeof children.props>);

  return (
    <span className="helix-tooltip-wrapper">
      {trigger}
      {visible ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={cx('helix-tooltip', `helix-tooltip--${side}`)}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
