import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Visual style of the button.
   * @default 'solid'
   */
  variant?: ButtonVariant;

  /**
   * Size of the button.
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Optional leading icon, rendered before children.
   */
  leadingIcon?: ReactNode;

  /**
   * Optional trailing icon, rendered after children.
   */
  trailingIcon?: ReactNode;

  /**
   * Loading state — disables the button and announces busy to assistive tech.
   * @default false
   */
  loading?: boolean;

  /**
   * Button content.
   */
  children?: ReactNode;
}

/**
 * Button — the canonical interactive primitive.
 *
 * Accessibility:
 * - Native `<button>` element, full keyboard support out of the box
 * - Loading state communicates `aria-busy` to assistive technology
 * - Disabled state prevents interaction at the DOM level
 *
 * @example
 *   <Button variant="solid" size="md">Save</Button>
 *   <Button variant="ghost" leadingIcon={<Icon />}>Cancel</Button>
 *   <Button loading>Submitting…</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'solid',
      size = 'md',
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cx(
          'helix-button',
          `helix-button--${variant}`,
          `helix-button--${size}`,
          className
        )}
        {...rest}
      >
        {leadingIcon ? (
          <span className="helix-button__leading" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        {children}
        {trailingIcon ? (
          <span className="helix-button__trailing" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </button>
    );
  }
);
