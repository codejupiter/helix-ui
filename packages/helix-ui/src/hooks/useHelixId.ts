import { useId as useReactId } from 'react';

/**
 * Stable, SSR-safe unique ID with optional prefix.
 *
 * Wraps React's built-in useId so consumers can pass a semantic prefix
 * (e.g. `useHelixId('checkbox')` → `helix-checkbox-:r0:`).
 */
export function useHelixId(prefix?: string): string {
  const id = useReactId();
  return prefix ? `helix-${prefix}-${id}` : `helix-${id}`;
}
