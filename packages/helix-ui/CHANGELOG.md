# Changelog

All notable changes to Helix UI are documented here.

## 0.1.0 - 2026-05-15

### Added

- Released the first package-ready Helix UI component library surface.
- Shipped all 16 planned accessible React primitives: Button, Input, Checkbox, Switch, RadioGroup, Slider, Select, Avatar, Progress, Tooltip, Popover, Dialog, Toast, Tabs, Accordion, and DropdownMenu.
- Implemented every primitive from scratch without Radix, Headless UI, or other headless runtime dependencies.
- Added package output for ESM, CommonJS, TypeScript declarations, and `styles.css`.
- Added API documentation for install, exports, compound components, theming, package shape, and bundle budgets.
- Added accessibility documentation for primitive behavior, consumer responsibilities, testing strategy, and release checks.
- Added release notes, release checklist, security policy, issue forms, PR template, and Dependabot configuration.
- Added CI gates for production audit, lint, typecheck, the 112-test component suite, package build, bundle-size checks, and package dry run.

### Verified

- 112 unit and interaction tests pass across 16 primitives.
- Bundle budgets pass for ESM, CJS, and CSS output.
- `npm pack --dry-run` verifies the publishable package contents before release.

### Known Limitations

- The package is release-ready but not yet published to npm.
- A public docs/demo site is not yet deployed.
- Browser-level visual regression is not automated yet.
