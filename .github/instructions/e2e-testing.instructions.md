---
applyTo: "tests/**"
description: "Playwright end-to-end testing standards"
---

Before managing e2e tests, consult:
- `docs/e2e-testing.md`
- `docs/accessibility.md`

Requirements:
- Cover user-critical flows and regressions.
- Prefer stable selectors (roles, labels, test ids), avoid brittle CSS selectors.
- Include keyboard/focus/accessibility assertions for core interactions.
- Keep tests deterministic (no arbitrary waits; use Playwright waiting patterns).