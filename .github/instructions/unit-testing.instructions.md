---
applyTo: "src/**/*.test.ts"
description: "Vitest unit testing standards"
---

Before writing/updating unit tests, consult:
- `docs/unit-testing.md`
- `docs/clean-architecture.md`

Requirements:
- Test business behavior at domain/application layers with framework-free tests.
- Mock infrastructure boundaries (storage, clock, id generators) for determinism.
- Use clear arrange/act/assert structure and descriptive test names.
- Cover success paths, validation failures, and edge cases.