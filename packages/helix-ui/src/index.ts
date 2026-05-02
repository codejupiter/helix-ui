/**
 * Helix UI — Public API
 *
 * Custom-built, accessible React component primitives.
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Form primitives
// ---------------------------------------------------------------------------
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { RadioGroup, Radio } from './components/RadioGroup';
export type { RadioGroupProps, RadioProps } from './components/RadioGroup';

export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';

export { Select } from './components/Select';
export type { SelectProps } from './components/Select';

// ---------------------------------------------------------------------------
// Display primitives
// ---------------------------------------------------------------------------
export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar';

export { Progress } from './components/Progress';
export type { ProgressProps } from './components/Progress';

// ---------------------------------------------------------------------------
// Overlay primitives
// ---------------------------------------------------------------------------
export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipSide } from './components/Tooltip';

export { Popover } from './components/Popover';
export type { PopoverProps, PopoverSide } from './components/Popover';

export { Dialog } from './components/Dialog';
export type { DialogProps } from './components/Dialog';

export { ToastProvider, useToast } from './components/Toast';
export type { ToastOptions, ToastVariant, ToastProviderProps } from './components/Toast';

// ---------------------------------------------------------------------------
// Composite controls
// ---------------------------------------------------------------------------
export { Tabs } from './components/Tabs';
export type { TabsProps } from './components/Tabs';

export { Accordion } from './components/Accordion';
export type { AccordionProps } from './components/Accordion';

export { DropdownMenu } from './components/DropdownMenu';
export type { DropdownMenuProps } from './components/DropdownMenu';

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------
export {
  colors,
  semanticTokens,
  spacing,
  typography,
  radii,
  shadows,
  motion,
  zIndex,
} from './tokens';

export type {
  ColorScale,
  SemanticToken,
  SpacingToken,
  RadiusToken,
} from './tokens';

// ---------------------------------------------------------------------------
// Utilities & hooks
// ---------------------------------------------------------------------------
export { cx } from './utils/cx';
export { useHelixId } from './hooks/useHelixId';
export { useOutsideClick } from './hooks/useOutsideClick';
export { useFocusTrap } from './hooks/useFocusTrap';
