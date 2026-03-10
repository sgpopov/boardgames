---
name: Architecture Review
description: Review-only checklist for clean architecture, boundaries, testing, and client-only rules.
applyTo: src/**/*.{ts,tsx}
excludeAgent: "coding-agent"
---

# Architecture review instructions

Only apply this file when the task is explicitly a code review, PR review, or review-focused audit.
Ignore it for implementation, planning, brainstorming, and general chat.

- Use the following documents as a start - [docs/clean-architecture.md](../../../docs//clean-architecture.md), [docs/frontend.md](../../../docs//frontend.md), [docs/unit-testing.md](../../../docs/unit-testing.md) and [docs/e2e-testing.md](../../../docs/e2e-testing.md)
- Follow the review checklist in [docs/clean-architecture.md](../../../docs/clean-architecture.md).
- Focus on findings, regressions, architectural violations, and missing tests.
- Verify layer boundaries: UI must not import infrastructure, application must not import UI, and domain must stay framework-free.
- Verify hidden side effects are abstracted behind dependencies for time, storage, randomness, and IDs.
- Reject direct `localStorage` access outside infrastructure and reject barrel files.
- Check that validation, typed domain errors, and dependency injection are preserved.
- Check that new logic has relevant unit and integration coverage, including negative paths.
- Check for client-only compliance and reject server-only APIs in app code.
