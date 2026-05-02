import {
  forwardRef,
  useRef,
  useCallback,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cx } from '../utils/cx';

export interface SliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /**
   * Accessible label.
   */
  'aria-label'?: string;
}

/**
 * Slider — single-value slider control.
 *
 * Implements ARIA `role="slider"` with proper value, min, max attributes.
 *
 * Keyboard support:
 *   - ArrowLeft / ArrowDown: decrease by step
 *   - ArrowRight / ArrowUp: increase by step
 *   - Home: jump to min
 *   - End: jump to max
 *   - PageDown / PageUp: decrease/increase by 10x step
 *
 * Pointer support: click/drag on the track moves the thumb.
 *
 * @example
 *   <Slider value={50} onChange={setValue} min={0} max={100} aria-label="Volume" />
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    className,
    ...rest
  },
  ref
) {
  const trackRef = useRef<HTMLDivElement>(null);

  const clamp = useCallback(
    (n: number) => Math.min(Math.max(n, min), max),
    [min, max]
  );

  const snap = useCallback(
    (n: number) => {
      const snapped = Math.round((n - min) / step) * step + min;
      return clamp(snapped);
    },
    [min, step, clamp]
  );

  const percent = ((value - min) / (max - min)) * 100;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let next = value;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = clamp(value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = clamp(value - step);
        break;
      case 'Home':
        next = min;
        break;
      case 'End':
        next = max;
        break;
      case 'PageUp':
        next = clamp(value + step * 10);
        break;
      case 'PageDown':
        next = clamp(value - step * 10);
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(next);
  };

  // Compute value from a pointer x-position
  const updateFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const raw = min + ratio * (max - min);
    onChange(snap(raw));
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.buttons !== 1) return; // only when primary button is held
    updateFromPointer(e.clientX);
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={cx(
        'helix-slider',
        disabled && 'helix-slider--disabled',
        className
      )}
      {...rest}
    >
      <div
        ref={trackRef}
        className="helix-slider-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <div
          className="helix-slider-fill"
          style={{ width: `${percent}%` }}
        />
        <div
          className="helix-slider-thumb"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
});
