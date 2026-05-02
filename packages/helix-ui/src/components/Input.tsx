import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Marks the input as having a validation error.
   * Sets `aria-invalid="true"` and applies the error visual state.
   * @default false
   */
  invalid?: boolean;
}

/**
 * Input — base text input primitive.
 *
 * Accepts all native `<input>` props. Use `invalid` to indicate a validation
 * error; this both styles the input and signals to assistive tech via
 * `aria-invalid`.
 *
 * For label association, wrap in a `<label>` or use `htmlFor` + `id`.
 *
 * @example
 *   <label>
 *     Email
 *     <Input type="email" name="email" />
 *   </label>
 *
 *   <Input invalid aria-describedby="email-error" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, type = 'text', ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cx('helix-input', className)}
      {...rest}
    />
  );
});
