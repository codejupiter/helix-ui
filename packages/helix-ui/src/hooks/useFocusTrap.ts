import { useEffect, type RefObject } from 'react';

/**
 * Selectors for elements that can receive focus and are not disabled/hidden.
 * Used to find the boundary elements of a focus trap.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((el) => {
    if (el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    return true;
  });
}

/**
 * Traps Tab key focus inside a container.
 *
 * On activation:
 *   1. Saves the currently-focused element (so we can restore later)
 *   2. Focuses the first focusable element inside the container
 *   3. Wraps Tab and Shift+Tab to cycle within the container
 *
 * On deactivation (when `enabled` becomes false or component unmounts):
 *   - Restores focus to the originally-focused element
 *
 * Use for modal dialogs, side panels, and any UI that should hold focus.
 *
 * @example
 *   const ref = useRef<HTMLDivElement>(null);
 *   useFocusTrap(ref, isOpen);
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  enabled: boolean
): void {
  useEffect(() => {
    if (!enabled) return;
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the first focusable element, or the container itself
    const focusable = getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0]!.focus();
    } else {
      container.focus();
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const elements = getFocusableElements(container!);
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }
      const first = elements[0]!;
      const last = elements[elements.length - 1]!;
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container!.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container!.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
    };
  }, [ref, enabled]);
}
