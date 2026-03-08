---
applyTo: "src/games/**"
description: "Clean architecture rules for game modules"
---

Before refactors or new features, use `docs/clean-architecture.md`.

Enforce:
- UI -> application -> domain dependency direction.
- Infrastructure depends inward only.
- No direct framework leakage into domain/application.