# GitHub Copilot Clean Architecture & Review Guidelines

This repository adapts Uncle Bob's Clean Architecture principles to a modular, multi–game setting with local storage as the data source and the following stack:

- Next.js (App Router, client-side only: NO SSR / NO Server Components)
- React (19)
- shadcn UI
- Tailwind 4
- @tanstack/react-form with Zod
- @radix-ui primitives
- Vitest
- Playwright

No external network APIs are used; persistence is via `localStorage` only (wrapped behind repository interfaces). Each game is an independent module. All rendering occurs on the client; domain & application stay environment-agnostic and never reference browser globals directly.

---
## 1. Core Clean Architecture Principles
1. **Independence of Frameworks:** Domain & application layers never import React, Next.js, browser APIs, Tailwind, shadcn, or Radix directly.
2. **Testability & Determinism:** Domain logic is pure and synchronous unless inherently time-based. Random IDs isolated via injected generators.
3. **Interface Segregation:** Repositories are small, purpose-specific TypeScript interfaces defined in the domain layer (`domain/repositories`).
4. **Dependency Rule:** Source code dependencies point inward: UI → application → domain. Infrastructure adapters implement outward-facing interfaces and depend inward.
5. **Separation of Concerns:** UI deals with presentation & user interaction only; application layer coordinates use cases; domain encapsulates business rules.
6. **Replaceability:** Any infrastructure (e.g. storage) can be swapped without touching domain/application code.

---
## 2. Module & Folder Structure
Global cross-cutting core lives under `src/core/`.
Each game module lives under `src/games/<gameName>/` with recommended sub-folders:

```
src/games/<gameName>/
	domain/
		entities/        # Plain types & entity factories (no classes unless needed)
		repositories/    # Interfaces (ports)
		errors/          # Domain-specific Error types
		validation/      # Zod schemas & pure validation helpers
	application/
		use-cases/       # Pure functions orchestrating repositories + domain rules
		services/        # Optional: cohesive orchestration that groups multiple use cases
	infrastructure/
		storage/         # LocalStorage repository implementations (adapters)
		mappers/         # Translate infra DTOs ↔ domain types
	ui/
		components/      # Presentational components using shadcn/Radix/Tailwind
		hooks/           # React hooks (wrap application layer)
		forms/           # @tanstack/react-form configurations
	tests/
		unit/            # Vitest: domain + application
		integration/     # Infrastructure adapter tests (with mocked localStorage if needed)
		fixtures/        # Reusable test data builders
```

No barrel (`index.ts`) re-exports. Import directly from specific files to avoid hidden coupling.

---
## 3. Layer Rules
### Domain Layer
- Pure TypeScript only; no environment conditionals.
- Exports: entity factories, immutable data transformations, validation schemas.
- All entities are defined as TypeScript `type` or `interface`; prefer simple records over classes. If invariants needed, supply factory with validation.

### Application Layer
- Use cases are small pure(ish) functions receiving repositories + necessary value objects.
- Orchestrates domain validation, persistence calls, entity transformations.
- No UI concerns (no JSX, no styling classes, no React hooks).
- Input/output types exported for use by UI forms.

### Infrastructure Layer
- Implements repository interfaces; accesses `localStorage` via an injected storage object (defaulting to `window.localStorage` in composition) for testability.
- Performs serialization (stringify/parse) & mapping only; never embeds business rules.
- Includes resilience logic (schema versioning, graceful migration) if needed.
- No SSR guards required; infra is only instantiated in client composition code.

### UI Layer (Client Only)
- React components & hooks only (all are Client Components; do NOT use Next.js Server Components).
- No server-side rendering or server data fetching APIs.
- Styling via Tailwind utility classes & shadcn primitives; composition with Radix root components.
- Forms use `@tanstack/react-form`; validation via Zod schemas imported from domain.
- Never call `localStorage` directly; use hooks that internally call application layer which depends on repository implementations provided by composition root.
- Avoid Node.js-only APIs anywhere in UI code.

---
## 4. Types & Naming
- Descriptive names over terse ones: `createPhase10Game`, not `makeGame`.
- Types centralization: shared cross-module types go in `src/core/domain/entities` or `types/` (if global). Game-specific types stay in the module's domain folder.
- Suffix conventions:
	- Repository interfaces: `<Entity>Repository` (e.g. `GameStateRepository`).
	- Use case functions: imperative verb phrase (`startGame`, `addPlayerToGame`).
	- Local storage adapters: `<Entity>LocalStorageRepository`.
- Avoid boolean parameter ambiguity; use object params with named fields.

---
## 5. Code Generation Guidelines (Copilot Prompts)
When generating new code Copilot should:
1. Start at the domain: define entities, validation schemas (Zod), and repository interfaces.
2. Create use case(s) in `application/use-cases` that accept repositories & simple value objects.
3. Implement infrastructure adapters referencing repository interfaces; isolate raw persistence (localStorage) in one place.
4. Provide mapping utilities (infra DTO ↔ domain entity) in dedicated mapper files.
5. Generate a React hook in `ui/hooks` wrapping one or more use cases (e.g. `usePhase10Setup`). Hooks handle: state, calling use cases, exposing UI-friendly returned data.
6. Create form models with `@tanstack/react-form` referencing domain validation (Zod schema). Keep transformation logic minimal in the form layer.
7. Render UI components using shadcn primitives + Tailwind classes; avoid embedding business rules (ask application layer instead).
8. Ensure every side-effect (storage, time, random UUID) is injected or encapsulated so it can be mocked in tests.
9. Add unit tests for domain + application logic immediately (Vitest). Provide fixture builders for complex entities.
10. Add Playwright e2e test if feature introduces user-visible flow (create game, add player). Place under `tests/e2e/<gameName>/`.

---
## 6. Testing Guidelines
### Unit (Vitest)
- Domain: invariant enforcement, validation, pure transformations.
- Application: branching, orchestration, persistence interactions (repositories mocked).
- Infrastructure: ensure correct serialization & deserialization, failure handling. Optionally wrap `localStorage` with in-memory stub.

### Integration
- Adapter + use case interaction with real localStorage stub (not pure mocks) verifying data consistency.

### E2E (Playwright)
- User flows: create game, modify state, persistence across reload (if feature warrants).
- Keep selectors semantic (data-testid or role-based). Avoid brittle text selectors.

Coverage expectations: Critical domain invariants & all use cases must have tests before merge.

---
## 7. React / Next.js (Client-Only Mode)
- All components are Client Components; do not use Server Components or SSR features.
- Pages/layouts requiring hooks/state must include `'use client'` at top.
- Use dynamic import for heavy or rarely used components: `const Board = dynamic(() => import('./Board'))`.
- Keys for lists: stable entity IDs; never array index if mutations possible.
- Avoid global state libraries; prefer local hooks and minimal context boundaries.
- Use `next/image` and `next/font` where beneficial; otherwise plain `<img>` is acceptable.
- Do not use server-only helpers (`cookies()`, `headers()`, Route Handlers) or expect server data hydration.

---
## 8. Code Generation Checklist (Copilot)
- Domain entities & Zod schemas defined.
- Repository interface(s) declared.
- Use case(s) implemented with clear input/output types.
- Infrastructure adapter created & mapped.
- React hook wrapping use case(s) added.
- Form configuration using `@tanstack/react-form` referencing Zod schema.
- UI component(s) implemented with shadcn primitives only (no business logic).
- Tests: unit (domain + application) + adapter + e2e if user flow.
- No direct localStorage in UI or application layers.
- No barrel files introduced.

---
## 9. Code Review Checklist
Reviewers (and Copilot) must verify:
1. **Layer Boundaries:** UI does not import infrastructure; application does not import UI; domain imports nothing outward.
2. **Purity:** Domain & application functions have no hidden side effects (time, storage, random) without abstraction.
3. **Validation:** Inputs checked via Zod before creating/modifying entities.
4. **Error Handling:** Domain errors are typed; application translates to user-facing messages only at UI boundary.
5. **Dependency Injection:** Repositories passed in as parameters; no singleton/localStorage global access.
6. **Naming Clarity:** Functions & types clearly express intent; no ambiguous abbreviations.
7. **Tests Present:** New logic covered; negative paths tested (invalid input, missing entity).
8. **No Circular Imports:** Direct file imports only; no barrels.
9. **Separation of UI Styling:** Tailwind classes belong in UI components or style utilities only.
10. **Performance Considerations:** Avoid unnecessary re-renders (memoize expensive derived values inside hooks if needed).
11. **Accessibility:** UI components use semantic HTML; interactive elements have accessible names.
12. **Client-Only Compliance:** No server-only imports/APIs (`fs`, `cookies()`, `headers()`, server fetch patterns).

Reject if any checklist item fails for critical logic.

---
## 10. Anti-Patterns (Reject PR)
- Direct `localStorage` usage inside React components or application/use case files.
- Business logic embedded in UI components (complex conditionals, calculations that belong to domain).
- Repository implementations leaking UI concerns (e.g., returning JSX or DOM nodes).
- Barrel files re-exporting entire module trees.
- Use cases returning React hooks or JSX.
- Silent error swallowing (empty catch blocks).
- Boolean flags piled into function parameters instead of cohesive parameter objects.

---
## 11. Example: Local Storage Repository Pattern
```ts
// domain/repositories/GameStateRepository.ts
export interface GameStateRepository {
	save(state: GameState): Promise<void> | void;
	load(id: string): Promise<GameState | undefined> | GameState | undefined;
	list(): Promise<GameStateSummary[]> | GameStateSummary[];
}

// infrastructure/storage/GameStateLocalStorageRepository.ts
import { GameStateRepository } from '../../domain/repositories/GameStateRepository';
import { mapToDto, mapFromDto } from '../mappers/gameStateMapper';

const STORAGE_KEY = 'phase10:games';

export function createGameStateLocalStorageRepository(storage: Storage = window.localStorage): GameStateRepository {
	return {
		save(state) {
			const all = readAll(storage);
			all[state.id] = mapToDto(state);
			storage.setItem(STORAGE_KEY, JSON.stringify(all));
		},
		load(id) {
			const all = readAll(storage);
			const dto = all[id];
			return dto ? mapFromDto(dto) : undefined;
		},
		list() {
			return Object.values(readAll(storage)).map(dto => ({ id: dto.id, players: dto.players.length }));
		}
	};
}

function readAll(storage: Storage): Record<string, GameStateDto> {
	try { return JSON.parse(storage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
```

---
## 12. Example: Use Case + Hook
```ts
// application/use-cases/startGame.ts
export interface StartGameInput { players: string[] }
export interface StartGameOutput { id: string }
export function startGame(repo: GameStateRepository, uuid: () => string, input: StartGameInput): StartGameOutput {
	const id = uuid();
	const state = createGameState({ id, players: input.players });
	repo.save(state);
	return { id };
}

// ui/hooks/useStartGame.ts
import { startGame } from '../../application/use-cases/startGame';
export function useStartGame(repo: GameStateRepository) {
	const uuid = useStableUuidGenerator();
	return React.useCallback((players: string[]) => startGame(repo, uuid, { players }), [repo, uuid]);
}
```

---
## 13. Form Integration Example
```ts
// ui/forms/createGameForm.ts
import { createForm } from '@tanstack/react-form';
import { z } from 'zod';
const schema = z.object({ players: z.array(z.string().min(1)).min(1) });
export function useCreateGameForm(onSubmit: (players: string[]) => void) {
	return createForm({
		defaultValues: { players: [''] },
		onSubmit: ({ value }) => onSubmit(value.players),
		validators: { onChange: ({ value }) => schema.safeParse(value) }
	});
}
```

---
## 14. Accessibility & UI
- Components must use appropriate roles (e.g., `role="dialog"` via Radix primitives).
- Provide `aria-label` or visible labels for interactive elements.
- Color contrast should meet WCAG AA (Tailwind classes selected accordingly).

---
## 15. Performance & Evolution
- Keep use cases small; split when branching grows complex.
- Defer costly derived state to memoized selectors in hooks.
- Prefer incremental migrations (add new schema version keys) instead of in-place destructive changes.

---
## 16. PR Description Template (Suggestion)
```
Summary:
	<Short description>

Game Module(s) Touched:
	<module paths>

New Use Cases:
	- <list>

Tests:
	- Unit: <files>
	- Integration: <files>
	- E2E: <files or N/A>

Checklist:
	[ ] Domain pure
	[ ] No direct localStorage in UI/app
	[ ] Validation via Zod
	[ ] Tests added & passing
	[ ] No barrel files
```

---
## 17. Copilot Code Review Heuristics (Automated Suggestions)
When suggesting improvements in a PR, Copilot should:
- Flag any file where `localStorage` appears outside infrastructure.
- Flag React imports inside `domain/` or `application/`.
- Suggest splitting large (>150 LOC) use case files.
- Recommend adding unit tests for any new repository interface or use case without coverage.
- Suggest replacing boolean flags with parameter objects if >2 booleans.
- Point out missing error type definitions if `throw new Error("...")` is used in domain code.

---
## 18. Evolution Strategy
As new games are added:
- Reuse shared abstractions in `src/core/` (e.g., generic GameState typing) without coupling modules.
- Introduce cross-module services only after 3+ modules need the same orchestration; otherwise keep logic localized.
- Maintain backward compatibility in storage by version tagging.

---
## 19. Summary
This document ensures consistent, clean, testable, and modular code generation & review. Copilot must honor layer boundaries, prioritize purity and explicit types, and enforce the checklist before suggesting merges.

