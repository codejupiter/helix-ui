import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Visible label rendered next to the indicator. If omitted, you must
   * provide an `aria-label` or external label via `aria-labelledby`.
   */
  children?: ReactNode;
}

/**
 * Checkbox — accessible custom-styled checkbox.
 *
 * Built on a visually-hidden native `<input type="checkbox">` for a11y,
 * with a styled `::after` checkmark pattern on the sibling indicator.
 * Native semantics are preserved so screen readers, keyboard users, and
 * form-submission behavior all work without additional props.
 *
 * Both controlled (`checked` + `onChange`) and uncontrolled (`defaultChecked`)
 * modes are supported.
 *
 * @example
 *   <Checkbox name="agree">I agree to the terms</Checkbox>
 *
 *   <Checkbox
 *     checked={value}
 *     onChange={(e) => setValue(e.target.checked)}
 *   >
 *     Subscribe
 *   </Checkbox>
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ children, id, className, ...rest }, ref) {
    const generatedId = useHelixId('checkbox');
    const inputId = id ?? generatedId;

    return (
      <label htmlFor={inputId} className={cx('helix-checkbox-root', className)}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="helix-checkbox"
          {...rest}
        />
        <span className="helix-checkbox-indicator" aria-hidden="true" />
        {children ? <span>{children}</span> : null}
      </label>
    );
  }
);
