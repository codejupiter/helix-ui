/**
 * Helix UI Design Tokens
 *
 * Single source of truth for the design system. Tokens are exported as
 * TypeScript constants for type-safe usage in code, and the corresponding
 * CSS custom properties live in `styles.css` for runtime theming.
 *
 * The naming follows a semantic + scale pattern:
 *   - Semantic:  bg, fg, accent, muted, border, danger, success
 *   - Scale:     50, 100, 200 ... 900 (for raw color ramps)
 *
 * Components should reference *semantic* tokens, never raw colors directly.
 * This makes theming (light/dark, brand variants) a single-file change.
 */

// ---------------------------------------------------------------------------
// Color ramps — raw values, used to derive semantic tokens
// ---------------------------------------------------------------------------

export const colors = {
  // Sage (brand accent)
  sage: {
    50: '#f0faf3',
    100: '#dbf3e2',
    200: '#bae6c8',
    300: '#8fe3b2', // primary brand color
    400: '#5cc890',
    500: '#3aab73',
    600: '#298a5d',
    700: '#226e4c',
    800: '#1d573e',
    900: '#194834',
  },
  // Neutral (zinc-like, slightly cool)
  neutral: {
    50: '#fafaf9',
    100: '#f4f4f3',
    200: '#e6e6e4',
    300: '#d1d1ce',
    400: '#a3a3a0',
    500: '#737373',
    600: '#525252',
    700: '#3f3f3e',
    800: '#262625',
    900: '#171716',
    950: '#0a0a09',
  },
  // Red (danger)
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    300: '#fca5a5',
    500: '#ef4444',
    700: '#b91c1c',
    900: '#7f1d1d',
  },
  // Amber (warning)
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    300: '#fcd34d',
    500: '#f59e0b',
    700: '#b45309',
    900: '#78350f',
  },
} as const;

// ---------------------------------------------------------------------------
// Semantic tokens — these are what components should reference
// ---------------------------------------------------------------------------

export const semanticTokens = {
  light: {
    bg: colors.neutral[50],
    bgElevated: '#ffffff',
    bgSubtle: colors.neutral[100],
    fg: colors.neutral[900],
    fgMuted: colors.neutral[600],
    fgFaint: colors.neutral[400],
    accent: colors.sage[500],
    accentFg: '#ffffff',
    accentSubtle: colors.sage[100],
    border: colors.neutral[200],
    borderStrong: colors.neutral[300],
    danger: colors.red[500],
    dangerFg: '#ffffff',
    success: colors.sage[600],
    warning: colors.amber[500],
  },
  dark: {
    bg: colors.neutral[950],
    bgElevated: colors.neutral[900],
    bgSubtle: colors.neutral[800],
    fg: colors.neutral[50],
    fgMuted: colors.neutral[400],
    fgFaint: colors.neutral[500],
    accent: colors.sage[300],
    accentFg: colors.neutral[950],
    accentSubtle: 'rgba(143, 227, 178, 0.12)',
    border: colors.neutral[800],
    borderStrong: colors.neutral[700],
    danger: colors.red[500],
    dangerFg: '#ffffff',
    success: colors.sage[300],
    warning: colors.amber[300],
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing scale (rem-based, 4px = 0.25rem)
// ---------------------------------------------------------------------------

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', //   4px
  2: '0.5rem', //    8px
  3: '0.75rem', //   12px
  4: '1rem', //      16px
  5: '1.25rem', //   20px
  6: '1.5rem', //    24px
  8: '2rem', //      32px
  10: '2.5rem', //   40px
  12: '3rem', //     48px
  16: '4rem', //     64px
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem', //    12px
    sm: '0.875rem', //   14px
    base: '1rem', //     16px
    lg: '1.125rem', //   18px
    xl: '1.25rem', //    20px
    '2xl': '1.5rem', //  24px
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.7',
  },
} as const;

// ---------------------------------------------------------------------------
// Borders, radii, shadows
// ---------------------------------------------------------------------------

export const radii = {
  none: '0',
  sm: '0.25rem', //  4px
  md: '0.375rem', // 6px
  lg: '0.5rem', //   8px
  xl: '0.75rem', //  12px
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
  focus: '0 0 0 3px rgba(143, 227, 178, 0.4)',
} as const;

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export const motion = {
  duration: {
    instant: '0ms',
    fast: '120ms',
    base: '180ms',
    slow: '280ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

// ---------------------------------------------------------------------------
// Z-index scale — owned at the system level to prevent layering bugs
// ---------------------------------------------------------------------------

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;

// ---------------------------------------------------------------------------
// Type exports for consumer use
// ---------------------------------------------------------------------------

export type ColorScale = keyof typeof colors;
export type SemanticToken = keyof typeof semanticTokens.light;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
