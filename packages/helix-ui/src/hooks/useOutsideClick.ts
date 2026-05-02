import { useEffect, type RefObject } from 'react';

/**
 * Calls `handler` when the user clicks outside the referenced element.
 * Used by Popover, DropdownMenu, etc. to dismiss on outside interaction.
 *
 * Cleanup is automatic on unmount.
 *
 * @example
 *   const ref = useRef<HTMLDivElement>(null);
 *   useOutsideClick(ref, () => setOpen(false));
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    function listener(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
