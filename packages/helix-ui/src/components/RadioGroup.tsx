import {
  forwardRef,
  createContext,
  useContext,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';

// ---------------------------------------------------------------------------
// Internal context — shares group name + selected value between Group and Items
// ---------------------------------------------------------------------------

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(
      'RadioGroup.Item must be used inside a <RadioGroup>. Wrap your radios in <RadioGroup name="..." value={...} onChange={...}>.'
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// RadioGroup (parent)
// ---------------------------------------------------------------------------

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Form name shared across all radios in the group.
   * Native radio behavior uses this to ensure mutual exclusivity.
   */
  name: string;

  /**
   * Currently selected value. Pass `undefined` for no selection.
   */
  value?: string;

  /**
   * Called when the user selects a different option.
   */
  onChange: (value: string) => void;

  /**
   * Disables every radio in the group.
   * @default false
   */
  disabled?: boolean;

  /**
   * Group label used by assistive technology.
   * Strongly recommended — without it, screen reader users hear
   * a list of unrelated radios with no context.
   */
  'aria-label'?: string;

  children: ReactNode;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    { name, value, onChange, disabled, className, children, ...rest },
    ref
  ) {
    return (
      <RadioGroupContext.Provider
        value={{ name, value, onChange, disabled }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={cx('helix-radio-group', className)}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

// ---------------------------------------------------------------------------
// Radio (child)
// ---------------------------------------------------------------------------

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'name' | 'checked' | 'onChange' | 'disabled' | 'value'
  > {
  /**
   * The value associated with this radio. When the group's value
   * matches this, the radio is selected.
   */
  value: string;

  /**
   * Visible label.
   */
  children?: ReactNode;

  /**
   * Disables this individual radio. The group-level `disabled` prop
   * also applies and takes precedence.
   */
  disabled?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, children, disabled, id, className, ...rest },
  ref
) {
  const ctx = useRadioGroupContext();
  const generatedId = useHelixId('radio');
  const inputId = id ?? generatedId;
  const isChecked = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;

  return (
    <label htmlFor={inputId} className={cx('helix-radio-root', className)}>
      <input
        ref={ref}
        id={inputId}
        type="radio"
        name={ctx.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => ctx.onChange(value)}
        className="helix-radio"
        {...rest}
      />
      <span className="helix-radio-indicator" aria-hidden="true" />
      {children ? <span>{children}</span> : null}
    </label>
  );
});
