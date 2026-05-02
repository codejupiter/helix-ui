import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value, between 0 and `max`.
   * Omit for indeterminate state (animated stripe).
   */
  value?: number;

  /**
   * Maximum value. Defaults to 100 so `value` reads as a percentage.
   * @default 100
   */
  max?: number;

  /**
   * Accessible label describing what's loading.
   * Required because progress bars without context are confusing for screen readers.
   */
  'aria-label': string;
}

/**
 * Progress — accessible progress indicator.
 *
 * Two modes:
 *   - Determinate: pass `value` (0-max) to show specific progress
 *   - Indeterminate: omit `value` for an animated "working..." stripe
 *
 * Uses `role="progressbar"` with proper ARIA value attributes for screen readers.
 *
 * @example
 *   <Progress value={42} aria-label="Uploading file" />
 *   <Progress aria-label="Loading data" /> // indeterminate
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress({ value, max = 100, className, ...rest }, ref) {
    const isIndeterminate = value === undefined;
    const clampedValue = isIndeterminate
      ? undefined
      : Math.min(Math.max(value, 0), max);
    const percent = clampedValue !== undefined ? (clampedValue / max) * 100 : 0;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        className={cx(
          'helix-progress',
          isIndeterminate && 'helix-progress--indeterminate',
          className
        )}
        {...rest}
      >
        <div
          className="helix-progress__fill"
          style={isIndeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    );
  }
);
