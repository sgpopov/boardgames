---
name: unit-testing
description: Vitest testing patterns. Use when writing tests, debugging test failures, or mocking dependencies. Covers mock factories, fake timers, and promise rejection handling
---

## Testing Skills (Vitest)

Strict checklist for covering new work.

### Tooling & Commands
- Test: `npm run test:unit`
- Lint before tests if touching JSX/TS: `npm run lint`

### Unit & Application Tests (Vitest)
- Domain/application must be pure; mock repositories/time/UUIDs via injected fakes. Keep assertions on outputs and invariants only.
- Infrastructure adapters: use in-memory `localStorage` stubs; verify serialization shape and key names stay namespaced per game.
- Cover invalid inputs and error paths; avoid brittle snapshot testing of objects—assert fields explicitly.
- No React imports in domain/application tests; UI tests belong in component-level specs if needed.

### Integration Tests
- Exercise repository + use case together with a real storage stub to ensure persistence contracts. Reset storage between tests deterministically.
- Map/DTO tests: round-trip domain ↔ infra DTO; guard against schema drift.

### Coverage Expectations
- Every new use case or repository path has unit tests (happy + failure). Complex branching requires table-driven tests.
- New user-visible flow gets at least one Playwright happy path; add regression for any fixed bug.

### Anti-Patterns (reject)
- Tests that call `localStorage` globals directly without injection/reset strategy. Flaky timing with arbitrary `waitForTimeout` instead of waiting on UI state.
