/**
 * Compose CSS class names from a list of strings, conditionals, and undefined values.
 * Filters falsy values and joins with spaces.
 *
 * @example
 *   cx('helix-button', 'helix-button--md', isPrimary && 'helix-button--solid')
 */
export function cx(
  ...classes: Array<string | undefined | null | false | 0>
): string {
  return classes.filter(Boolean).join(' ');
}
