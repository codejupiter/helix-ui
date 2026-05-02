import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role'> {
  /**
   * Visible label rendered next to the switch. If omitted, you must provide
   * an `aria-label` or external label via `aria-labelledby`.
   */
  children?: ReactNode;
}

/**
 * Switch — accessible toggle control.
 *
 * Built on a native `<input type="checkbox">` with `role="switch"`, which
 * is the most reliable a11y pattern: it works for keyboard, form submission,
 * and screen readers without requiring custom event handling.
 *
 * Visually distinct from Checkbox: switches imply *immediate* state change
 * (settings, preferences), checkboxes imply *deferred* state (form fields
 * submitted on save).
 *
 * @example
 *   <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)}>
 *     Email notifications
 *   </Switch>
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { children, id, className, ...rest },
  ref
) {
  const generatedId = useHelixId('switch');
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={cx('helix-switch-root', className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className="helix-switch"
        {...rest}
      />
      <span className="helix-switch-track" aria-hidden="true">
        <span className="helix-switch-thumb" />
      </span>
      {children ? <span>{children}</span> : null}
    </label>
  );
});
