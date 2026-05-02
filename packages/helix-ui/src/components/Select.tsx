import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';
import { useOutsideClick } from '../hooks/useOutsideClick';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface SelectContextValue {
  value: string | undefined;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  listboxId: string;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  registerOption: (value: string, label: string) => number;
  options: Array<{ value: string; label: string }>;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select subcomponents must be used inside <Select>.');
  return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * Placeholder shown in the trigger when no value is selected.
   */
  placeholder?: string;
  /**
   * Accessible label.
   */
  'aria-label'?: string;
  children: ReactNode;
}

function SelectRoot({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  children,
}: SelectProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>(
    []
  );

  const triggerId = useHelixId('select-trigger');
  const listboxId = useHelixId('select-listbox');
  const containerRef = useRef<HTMLDivElement>(null);

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  // Track options registered by Select.Option children
  const registerOption = (value: string, label: string): number => {
    let index = -1;
    setOptions((prev) => {
      const existing = prev.findIndex((o) => o.value === value);
      if (existing >= 0) {
        index = existing;
        return prev;
      }
      index = prev.length;
      return [...prev, { value, label }];
    });
    return index;
  };

  useOutsideClick(containerRef, () => setOpen(false), open);

  // Highlight current value when opening
  useEffect(() => {
    if (open) {
      const currentIndex = options.findIndex((o) => o.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [open, value, options]);

  const ctxValue: SelectContextValue = {
    value,
    onChange: (v) => {
      setValue(v);
      setOpen(false);
    },
    open,
    setOpen,
    triggerId,
    listboxId,
    highlightedIndex,
    setHighlightedIndex,
    registerOption,
    options,
  };

  return (
    <SelectContext.Provider value={ctxValue}>
      <div ref={containerRef} className="helix-select" aria-label={ariaLabel}>
        <SelectTrigger placeholder={placeholder} />
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Trigger (rendered automatically inside root)
// ---------------------------------------------------------------------------

function SelectTrigger({ placeholder }: { placeholder?: string }) {
  const ctx = useSelectContext();
  const selected = ctx.options.find((o) => o.value === ctx.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      ctx.setOpen(true);
    }
  };

  return (
    <button
      type="button"
      id={ctx.triggerId}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.listboxId : undefined}
      onClick={() => ctx.setOpen(!ctx.open)}
      onKeyDown={handleKeyDown}
      className="helix-select-trigger"
    >
      <span
        className={cx(
          'helix-select-value',
          !selected && 'helix-select-value--placeholder'
        )}
      >
        {selected ? selected.label : placeholder ?? 'Select…'}
      </span>
      <span className="helix-select-arrow" aria-hidden="true">
        ▾
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Listbox (the dropdown panel containing options)
// ---------------------------------------------------------------------------

function SelectListbox({ children }: { children: ReactNode }) {
  const ctx = useSelectContext();
  const listboxRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const total = ctx.options.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        ctx.setHighlightedIndex((ctx.highlightedIndex + 1) % total);
        break;
      case 'ArrowUp':
        e.preventDefault();
        ctx.setHighlightedIndex(
          (ctx.highlightedIndex - 1 + total) % total
        );
        break;
      case 'Home':
        e.preventDefault();
        ctx.setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        ctx.setHighlightedIndex(total - 1);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const opt = ctx.options[ctx.highlightedIndex];
        if (opt) ctx.onChange(opt.value);
        break;
      }
      case 'Escape':
        e.preventDefault();
        ctx.setOpen(false);
        break;
    }
  };

  // Move focus into the listbox when it opens
  useEffect(() => {
    if (ctx.open) listboxRef.current?.focus();
  }, [ctx.open]);

  const activeId =
    ctx.highlightedIndex >= 0
      ? `${ctx.listboxId}-option-${ctx.highlightedIndex}`
      : undefined;

  return (
    <div
      ref={listboxRef}
      id={ctx.listboxId}
      role="listbox"
      tabIndex={-1}
      aria-activedescendant={activeId}
      onKeyDown={handleKeyDown}
      hidden={!ctx.open}
      className="helix-select-listbox"
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Option
// ---------------------------------------------------------------------------

interface SelectOptionProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: string;
  disabled?: boolean;
}

function SelectOption({
  value,
  children,
  disabled,
  className,
  ...rest
}: SelectOptionProps) {
  const ctx = useSelectContext();
  const [index, setIndex] = useState<number>(-1);

  // Register on mount
  useEffect(() => {
    const i = ctx.registerOption(value, children);
    setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, children]);

  const isSelected = ctx.value === value;
  const isHighlighted = ctx.highlightedIndex === index;

  return (
    <div
      id={`${ctx.listboxId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      onMouseEnter={() => !disabled && ctx.setHighlightedIndex(index)}
      onClick={() => !disabled && ctx.onChange(value)}
      className={cx(
        'helix-select-option',
        isSelected && 'helix-select-option--selected',
        isHighlighted && 'helix-select-option--highlighted',
        disabled && 'helix-select-option--disabled',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Select — accessible custom dropdown select.
 *
 * Implements the WAI-ARIA combobox + listbox pattern:
 *   - Trigger has `role="combobox"` with `aria-expanded`, `aria-controls`
 *   - Listbox has `role="listbox"`, options have `role="option"`
 *   - `aria-activedescendant` tracks keyboard highlight without moving DOM focus
 *   - Selected option has `aria-selected="true"`
 *
 * Keyboard:
 *   - Trigger: Enter/Space/ArrowDown opens
 *   - Listbox: ArrowUp/Down navigates, Enter/Space selects, Escape closes,
 *     Home/End jump to first/last
 *
 * @example
 *   <Select value={city} onChange={setCity} placeholder="Pick a city" aria-label="City">
 *     <Select.Listbox>
 *       <Select.Option value="nyc">New York</Select.Option>
 *       <Select.Option value="sf">San Francisco</Select.Option>
 *     </Select.Listbox>
 *   </Select>
 */
export const Select = Object.assign(SelectRoot, {
  Listbox: SelectListbox,
  Option: SelectOption,
});
