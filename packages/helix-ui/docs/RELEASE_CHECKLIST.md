# Helix UI Release Checklist

Use this checklist before publishing to npm, creating a GitHub release, or sharing Helix UI as a package-quality portfolio artifact.

## Current Release

- Version: `0.1.0`
- Package name: `@codejupiter/helix-ui`
- Release notes: [Helix UI v0.1.0](releases/helix-ui-v0.1.0.md)
- Status: release-ready package milestone; npm publishing remains manual.

## Required Gates

Run from `packages/helix-ui`:

```bash
npm audit --omit=dev --audit-level=high
npm run lint
npm run typecheck
npm run test
npm run build
npm run size
npm run pack:check
```

Expected result:

- Production audit reports zero high vulnerabilities.
- Lint and typecheck pass.
- 112 component tests pass.
- Package build emits ESM, CJS, declarations, and `styles.css`.
- Bundle-size budgets pass for ESM, CJS, and CSS.
- Package dry run includes `dist`, `docs`, `README.md`, `LICENSE`, and `CHANGELOG.md`.

## Public Sharing Checklist

- Root README and package README link to API, accessibility, release checklist, release notes, and changelog.
- API docs describe exports, compound components, package shape, and bundle budgets.
- Accessibility docs describe primitive behavior and consumer responsibilities.
- Release notes explain known limits honestly.
- Security policy explains how to report issues and clarifies consumer responsibility for untrusted content.
- No private tokens, generated junk, or unrelated project files are included in the package.

## npm Publish Checklist

Only publish after the package account state is confirmed:

```bash
npm login
npm whoami
npm run build
npm run size
npm run pack:check
npm publish --access public
```

After publishing:

- Verify the npm package page.
- Install into a clean Vite or Next.js fixture.
- Import `@codejupiter/helix-ui/styles.css`.
- Test Dialog, Select, Tabs, and Toast in a real browser.
- Create a GitHub release linked to the exact published version.

## Next Release Candidates

- `0.2.0`: public docs/demo site and packed-package fixture tests.
- `0.3.0`: visual regression for focus rings, overlays, and light/dark themes.
- `0.4.0`: additional primitives and design-token documentation.
