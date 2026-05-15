# Security Policy

Helix UI is a React component primitive library. It does not perform network requests, process credentials, or store user data by itself.

## Supported Versions

| Version | Status |
| --- | --- |
| `0.1.x` | Maintained for portfolio/package readiness |

## Reporting A Vulnerability

Please email security-sensitive reports to info@zoriahcocio.com.

Include:

- A short summary of the issue.
- Affected primitive, hook, package export, or documentation path.
- Reproduction steps.
- Expected impact and any suggested remediation.

Do not include private access tokens, customer data, or unrelated secrets in the report.

## Security Design Notes

- Helix UI has zero runtime dependencies beyond React peer dependencies.
- Components do not make network requests.
- Components do not store secrets.
- Native semantics are used where possible.
- Composite primitives use explicit keyboard and ARIA behavior owned inside the library.
- Consumers are responsible for escaping untrusted content before rendering it inside labels, tables, tooltips, dialogs, menu items, or any child slot.
- Package contents are checked with `npm pack --dry-run` before release.
