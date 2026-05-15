# Helix UI v0.1.0 Release Notes

Release date: 2026-05-15  
Status: Release-ready package milestone  
Package: `@codejupiter/helix-ui`

## Summary

Helix UI v0.1.0 packages a custom-built React primitive library focused on accessibility, keyboard behavior, theming, and bundle discipline.

Unlike many component systems, Helix intentionally avoids headless component dependencies. Dialog focus trapping, Tabs roving tabindex, Select active descendant behavior, overlay dismissal, Slider keyboard support, and other primitive behaviors are owned directly inside the library.

## Component Scope

The release includes all 16 planned primitives:

- Button, Input, Checkbox, Switch, RadioGroup, Slider.
- Select, Avatar, Progress, Tooltip, Popover, Dialog.
- Toast, Tabs, Accordion, DropdownMenu.

## Engineering Highlights

- React component package with React and React DOM as peer dependencies.
- Zero runtime dependencies.
- ESM and CommonJS bundles.
- TypeScript declarations for ESM and CJS consumers.
- Shipped CSS variables and `styles.css`.
- Compound-component APIs for Dialog, Tabs, Accordion, Select, and DropdownMenu.
- Custom hooks for focus trap, outside click, and stable IDs.
- Bundle-size budget script for ESM, CJS, and CSS artifacts.
- 112 Vitest and Testing Library tests across 16 primitives.
- CI gates for production audit, lint, typecheck, tests, build, size budgets, and package dry run.

## Release Evidence

- API docs: [docs/API.md](../API.md)
- Accessibility docs: [docs/ACCESSIBILITY.md](../ACCESSIBILITY.md)
- Release checklist: [docs/RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md)
- Changelog: [CHANGELOG.md](../../CHANGELOG.md)
- Security policy: [SECURITY.md](../../../../SECURITY.md)
- CI workflow: [.github/workflows/ci.yml](../../../../.github/workflows/ci.yml)

## Interview Story

This release supports a deep frontend engineering conversation:

- Why owning accessibility behavior directly is valuable and risky.
- How native semantics, ARIA patterns, and custom hooks fit together.
- How compound components keep complex primitive APIs cohesive.
- How bundle budgets catch accidental dependency creep.
- How tests cover keyboard navigation, focus trap, return focus, ARIA state, outside-click dismissal, and form behavior.
- What should come next before public npm adoption: docs/demo deployment, visual regression, packed-package fixture tests, and external consumer feedback.

## Known Limits

- Helix UI is release-ready but not yet published to npm.
- A dedicated public docs/demo site is not yet deployed.
- Visual regression for focus rings, overlay layering, and theme contrast is not automated yet.
