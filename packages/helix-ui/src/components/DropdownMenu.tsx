import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '../utils/cx';
import { useHelixId } from '../hooks/useHelixId';
import { useOutsideClick } from '../hooks/useOutsideClick';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx)
    throw new Error('Dropdown subcomponents must be used inside <DropdownMenu>.');
  return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface DropdownMenuProps {
  children: ReactNode;
}

function DropdownRoot({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useHelixId('dropdown');

  return (
    <DropdownContext.Provider value={{ open, setOpen, menuId }}>
      <DropdownContainer>{children}</DropdownContainer>
    </DropdownContext.Provider>
  );
}

function DropdownContainer({ children }: { children: ReactNode }) {
  const ctx = useDropdownContext();
  const containerRef = useRef<HTMLSpanElement>(null);

  useOutsideClick(containerRef, () => ctx.setOpen(false), ctx.open);

  useEffect(() => {
    if (!ctx.open) return;
    function onKey(e: KeyboardEvent | globalThis.KeyboardEvent) {
      if (e.key === 'Escape') ctx.setOpen(false);
    }
    document.addEventListener('keydown', onKey as EventListener);
    return () =>
      document.removeEventListener('keydown', onKey as EventListener);
  }, [ctx.open, ctx]);

  return (
    <span ref={containerRef} className="helix-dropdown-wrapper">
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

interface DropdownTriggerProps {
  children: ReactElement;
}

function DropdownTrigger({ children }: DropdownTriggerProps) {
  const ctx = useDropdownContext();
  return cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      ctx.setOpen(!ctx.open);
    },
    'aria-expanded': ctx.open,
    'aria-controls': ctx.menuId,
    'aria-haspopup': 'menu',
  } as Partial<typeof children.props>);
}

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

interface DropdownMenuListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function DropdownMenuList({ className, children, ...rest }: DropdownMenuListProps) {
  const ctx = useDropdownContext();
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus first item when menu opens
  useEffect(() => {
    if (ctx.open) {
      const first = menuRef.current?.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      );
      first?.focus();
    }
  }, [ctx.open]);

  if (!ctx.open) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      ) ?? []
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const nextIndex =
      e.key === 'ArrowDown'
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  return (
    <div
      ref={menuRef}
      id={ctx.menuId}
      role="menu"
      onKeyDown={handleKeyDown}
      className={cx('helix-dropdown-menu', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

function DropdownItem({
  children,
  disabled,
  onSelect,
  onClick,
  className,
  ...rest
}: DropdownItemProps) {
  const ctx = useDropdownContext();

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    onSelect?.();
    ctx.setOpen(false);
  };

  return (
    <div
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      className={cx(
        'helix-dropdown-item',
        disabled && 'helix-dropdown-item--disabled',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * DropdownMenu — accessible dropdown menu with keyboard navigation.
 *
 * Compound API: DropdownMenu, .Trigger, .Menu, .Item
 *
 * Keyboard:
 *   - Trigger toggles open/closed
 *   - First item auto-focuses on open
 *   - Arrow Up/Down cycles items
 *   - Enter/Space selects an item
 *   - Escape closes the menu
 *   - Click outside closes
 *
 * @example
 *   <DropdownMenu>
 *     <DropdownMenu.Trigger><Button>Options</Button></DropdownMenu.Trigger>
 *     <DropdownMenu.Menu>
 *       <DropdownMenu.Item onSelect={onSave}>Save</DropdownMenu.Item>
 *       <DropdownMenu.Item onSelect={onDelete}>Delete</DropdownMenu.Item>
 *     </DropdownMenu.Menu>
 *   </DropdownMenu>
 */
export const DropdownMenu = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenuList,
  Item: DropdownItem,
});
