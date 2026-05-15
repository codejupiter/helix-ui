# Helix UI Accessibility

Helix UI treats accessibility as part of the component contract, not as a downstream app concern. Every primitive is implemented with native semantics where possible, keyboard behavior where native semantics are not enough, and tests for the interactions most likely to regress.

## Baseline Contract

- Interactive elements are keyboard reachable.
- Focus indicators are visible and do not rely on color alone.
- Inputs expose labels, invalid state, and disabled state through native attributes.
- Composite controls follow WAI-ARIA Authoring Practices where a native element is not sufficient.
- Dismissible overlays close on Escape and outside interaction where expected.
- Dialog traps focus, locks background scroll, and restores focus to the trigger on close.
- Motion tokens respect `prefers-reduced-motion`.

## Primitive Coverage

| Primitive | Accessibility behavior |
| --- | --- |
| Button | Native button semantics, disabled/loading state, icon slots preserve text labels |
| Input | Native input semantics, `aria-invalid` support |
| Checkbox | Visually hidden native input preserves form and screen reader behavior |
| Switch | `role="switch"` with checked state |
| RadioGroup | Grouped native radio behavior through context |
| Slider | Arrow keys, PageUp/PageDown, Home/End, pointer drag |
| Select | Combobox/listbox pattern with active descendant tracking |
| Tooltip | Hover and focus triggers with delayed display |
| Popover | Escape and outside-click dismissal |
| Dialog | Focus trap, return focus, ARIA title/description wiring, scroll lock |
| Toast | Provider-managed announcements and auto-dismiss behavior |
| Tabs | Roving tabindex and arrow-key navigation |
| Accordion | Button-triggered disclosure with single/multiple modes |
| DropdownMenu | Menuitem roles, arrow-key navigation, Escape dismissal |

## Consumer Responsibilities

Helix UI provides accessible primitives, but consumers still need to supply accessible content:

- Provide visible labels or accessible names for icon-only buttons.
- Use `Dialog.Title` and `Dialog.Description` inside every dialog.
- Keep tooltip content short and non-essential.
- Do not use color as the only signal for destructive or warning states.
- Keep custom token overrides above WCAG AA contrast thresholds.
- Avoid placing focusable controls inside disabled or inert regions.

## Testing Strategy

The current test suite uses Vitest, Testing Library, and user-event to cover:

- Keyboard navigation across composite controls.
- Focus trap behavior and return focus.
- Outside click and Escape dismissal.
- ARIA state changes for selected, checked, expanded, and invalid states.
- Native form behavior for checkbox, radio, input, and switch-like controls.

The next quality layer should add browser-level visual regression around focus rings, overlay stacking, and light/dark theme contrast.

## Release Checklist

Before publishing a release:

- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run test`.
- Run `npm run build`.
- Run `npm run size`.
- Run `npm run pack:check`.
- Review package contents for docs, license, declarations, CSS, and both JS formats.
- Smoke-test the docs/example app that consumes the package from a packed tarball.
