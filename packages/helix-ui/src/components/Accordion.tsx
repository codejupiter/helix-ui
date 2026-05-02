import {
  createContext,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AccordionContextValue {
  expanded: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(
      'Accordion.Item, .Trigger, and .Content must be used inside <Accordion>.'
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Accordion (root)
// ---------------------------------------------------------------------------

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Selection mode:
   *   - 'single': only one item can be open at a time
   *   - 'multiple': any number of items can be open
   * @default 'single'
   */
  type?: 'single' | 'multiple';

  /**
   * Default open value(s) (uncontrolled).
   * String for single, string[] for multiple.
   */
  defaultValue?: string | string[];

  children: ReactNode;
}

function AccordionRoot({
  type = 'single',
  defaultValue,
  className,
  children,
  ...rest
}: AccordionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    if (defaultValue === undefined) return new Set();
    if (Array.isArray(defaultValue)) return new Set(defaultValue);
    return new Set([defaultValue]);
  });

  const toggle = (value: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (type === 'single') next.clear();
        next.add(value);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ expanded, toggle }}>
      <div className={cx('helix-accordion', className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Item — internal context for grouping trigger + content by value
// ---------------------------------------------------------------------------

const AccordionItemContext = createContext<{
  value: string;
  triggerId: string;
  contentId: string;
} | null>(null);

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

function AccordionItem({ value, className, children, ...rest }: AccordionItemProps) {
  const triggerId = useHelixId(`accordion-trigger-${value}`);
  const contentId = useHelixId(`accordion-content-${value}`);

  return (
    <AccordionItemContext.Provider value={{ value, triggerId, contentId }}>
      <div className={cx('helix-accordion-item', className)} {...rest}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Trigger (the clickable header)
// ---------------------------------------------------------------------------

interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function AccordionTrigger({ className, children, ...rest }: AccordionTriggerProps) {
  const groupCtx = useAccordionContext();
  const itemCtx = useContext(AccordionItemContext);
  if (!itemCtx)
    throw new Error('Accordion.Trigger must be inside Accordion.Item');

  const isExpanded = groupCtx.expanded.has(itemCtx.value);

  return (
    <button
      type="button"
      id={itemCtx.triggerId}
      aria-controls={itemCtx.contentId}
      aria-expanded={isExpanded}
      onClick={() => groupCtx.toggle(itemCtx.value)}
      className={cx(
        'helix-accordion-trigger',
        isExpanded && 'helix-accordion-trigger--expanded',
        className
      )}
      {...rest}
    >
      <span className="helix-accordion-trigger__label">{children}</span>
      <span className="helix-accordion-trigger__icon" aria-hidden="true">
        ▾
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function AccordionContent({ className, children, ...rest }: AccordionContentProps) {
  const groupCtx = useAccordionContext();
  const itemCtx = useContext(AccordionItemContext);
  if (!itemCtx)
    throw new Error('Accordion.Content must be inside Accordion.Item');

  const isExpanded = groupCtx.expanded.has(itemCtx.value);
  if (!isExpanded) return null;

  return (
    <div
      id={itemCtx.contentId}
      role="region"
      aria-labelledby={itemCtx.triggerId}
      className={cx('helix-accordion-content', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Accordion — collapsible content panels.
 *
 * Two modes:
 *   - single: one panel open at a time (default)
 *   - multiple: any number of panels can be open
 *
 * Implements proper ARIA: `aria-expanded` on triggers, `aria-controls`
 * linking trigger to panel, `role="region"` on content with
 * `aria-labelledby` back to the trigger.
 *
 * @example
 *   <Accordion defaultValue="faq-1">
 *     <Accordion.Item value="faq-1">
 *       <Accordion.Trigger>What is Helix UI?</Accordion.Trigger>
 *       <Accordion.Content>A custom-built component library.</Accordion.Content>
 *     </Accordion.Item>
 *   </Accordion>
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
