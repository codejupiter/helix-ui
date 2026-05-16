# Helix UI API

Helix UI exports accessible React primitives from a single package entrypoint and ships one stylesheet. The package is intentionally small: React and React DOM are peer dependencies, there are no runtime dependencies, and component behavior is owned inside the library instead of delegated to a headless framework.

## Install

The package is release-ready but not published to npm yet. Until publishing is complete, validate the local package artifact from this directory:

```bash
npm install
npm run build
npm run pack:check
```

After npm publication, the consumer install command will be:

```bash
npm install @codejupiter/helix-ui
```

Import the stylesheet once near the root of your app:

```tsx
import '@codejupiter/helix-ui/styles.css';
```

Use named component exports from the package root:

```tsx
import { Button, Dialog, ToastProvider } from '@codejupiter/helix-ui';
```

## Exports

| Export | Type | Purpose |
| --- | --- | --- |
| `Button` | Component | Variants, sizes, loading state, icon slots |
| `Input` | Component | Text input with invalid state |
| `Checkbox` | Component | Native checkbox with styled overlay |
| `Switch` | Component | Toggle with `role="switch"` |
| `RadioGroup`, `Radio` | Components | Grouped radio selection |
| `Slider` | Component | Pointer and keyboard slider |
| `Select` | Component | Custom combobox/listbox |
| `Avatar` | Component | Image with initials fallback |
| `Progress` | Component | Determinate and indeterminate progress |
| `Tooltip` | Component | Hover/focus contextual label |
| `Popover` | Component | Dismissible floating content |
| `Dialog` | Compound component | Modal with focus trap and return focus |
| `ToastProvider`, `useToast` | Provider and hook | Toast stack and imperative notification API |
| `Tabs` | Compound component | ARIA tabs with roving tabindex |
| `Accordion` | Compound component | Single or multiple disclosure groups |
| `DropdownMenu` | Compound component | Keyboard-navigable menu |
| `colors`, `semanticTokens`, `spacing`, `typography`, `radii`, `shadows`, `motion`, `zIndex` | Token objects | JS access to the design token scale |
| `cx` | Utility | Class name composition |
| `useHelixId`, `useOutsideClick`, `useFocusTrap` | Hooks | Shared primitive behavior |

## Compound Components

Complex primitives expose nested parts on one cohesive object:

```tsx
import { Dialog, Button } from '@codejupiter/helix-ui';

export function ConfirmDelete() {
  return (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="danger">Delete</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete record?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Close>
          <Button variant="ghost">Cancel</Button>
        </Dialog.Close>
        <Button variant="danger">Delete</Button>
      </Dialog.Content>
    </Dialog>
  );
}
```

The same pattern is used by `Tabs`, `Accordion`, `Select`, and `DropdownMenu`.

## Theming

Helix UI uses CSS custom properties under the `--helix-*` namespace. Dark mode is the default theme.

```tsx
<div data-helix-theme="dark">
  <Button>Dark</Button>
</div>

<div data-helix-theme="light">
  <Button>Light</Button>
</div>
```

Override tokens at any scope:

```css
:root {
  --helix-accent: #f97316;
  --helix-radius-md: 0.25rem;
}
```

## Package Shape

The package publishes:

- `dist/index.js` for ESM.
- `dist/index.cjs` for CommonJS.
- `dist/index.d.ts` and `dist/index.d.cts` for TypeScript.
- `dist/styles.css` for component styles and tokens.
- `docs/` for API and accessibility documentation.
- `LICENSE` and `README.md`.

CI runs `npm pack --dry-run` so the published surface is visible on every push.

## Bundle Budgets

The release budget is enforced by `npm run size` after `npm run build`.

| Artifact | Raw budget | Gzip budget |
| --- | ---: | ---: |
| ESM bundle | 45 kB | 10 kB |
| CJS bundle | 48 kB | 11 kB |
| CSS | 32 kB | 5 kB |

Budgets are intentionally tight enough to catch accidental dependency creep while leaving room for small accessibility fixes.
