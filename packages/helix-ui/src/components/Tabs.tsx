import {
  createContext,
  useContext,
  useState,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';

// ---------------------------------------------------------------------------
// Context — shared state between Tabs root and children
// ---------------------------------------------------------------------------

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  groupId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(
      'Tabs.List, Tabs.Trigger, and Tabs.Content must be used inside <Tabs>.'
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Tabs (root)
// ---------------------------------------------------------------------------

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Currently active tab value. Pass for controlled mode.
   */
  value?: string;

  /**
   * Default active tab in uncontrolled mode.
   */
  defaultValue?: string;

  /**
   * Called whenever the active tab changes.
   */
  onChange?: (value: string) => void;

  children: ReactNode;
}

function TabsRoot({
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  children,
  ...rest
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const groupId = useHelixId('tabs');

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value, onChange: setValue, groupId }}>
      <div className={cx('helix-tabs', className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Tabs.List — the row of tab triggers
// ---------------------------------------------------------------------------

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Accessible label describing the tab group.
   */
  'aria-label': string;
  children: ReactNode;
}

function TabsList({ className, children, ...rest }: TabsListProps) {
  return (
    <div role="tablist" className={cx('helix-tabs-list', className)} {...rest}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs.Trigger — individual tab button
// ---------------------------------------------------------------------------

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  /** The value this tab represents. */
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

function TabsTrigger({
  value,
  className,
  children,
  disabled,
  ...rest
}: TabsTriggerProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;
  const ref = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const list = ref.current?.parentElement;
    if (!list) return;
    const triggers = Array.from(
      list.querySelectorAll<HTMLButtonElement>(
        'button[role="tab"]:not([disabled])'
      )
    );
    const currentIndex = triggers.indexOf(ref.current!);
    const nextIndex =
      e.key === 'ArrowRight'
        ? (currentIndex + 1) % triggers.length
        : (currentIndex - 1 + triggers.length) % triggers.length;
    triggers[nextIndex]?.focus();
    triggers[nextIndex]?.click();
  };

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      id={`${ctx.groupId}-trigger-${value}`}
      aria-controls={`${ctx.groupId}-content-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.onChange(value)}
      onKeyDown={handleKeyDown}
      className={cx(
        'helix-tabs-trigger',
        isActive && 'helix-tabs-trigger--active',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tabs.Content — panel for a tab
// ---------------------------------------------------------------------------

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

function TabsContent({ value, className, children, ...rest }: TabsContentProps) {
  const ctx = useTabsContext();
  if (ctx.value !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${ctx.groupId}-content-${value}`}
      aria-labelledby={`${ctx.groupId}-trigger-${value}`}
      tabIndex={0}
      className={cx('helix-tabs-content', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

/**
 * Tabs — accessible tabbed interface.
 *
 * Implements the ARIA tabs pattern:
 * - `role="tablist" / "tab" / "tabpanel"`
 * - `aria-selected` on the active tab
 * - `aria-controls` and `aria-labelledby` linking tabs to panels
 * - Roving tabindex (only the active tab is in the tab order)
 * - Arrow Left/Right cycles between tabs with focus + activation
 *
 * @example
 *   <Tabs defaultValue="overview">
 *     <Tabs.List aria-label="Settings">
 *       <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *       <Tabs.Trigger value="security">Security</Tabs.Trigger>
 *     </Tabs.List>
 *     <Tabs.Content value="overview">Overview content</Tabs.Content>
 *     <Tabs.Content value="security">Security content</Tabs.Content>
 *   </Tabs>
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
