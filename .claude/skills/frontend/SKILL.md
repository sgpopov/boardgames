---
name: frontend
description: Core React patterns, hooks, state management, and best practices.
---

## When to Use

- Creating or refactoring React components
- Implementing custom hooks
- Managing state (local, context, or global)
- Optimizing component performance
- Handling side effects

## Frontend Skills (React/Next)

Use as a strict checklist for client-only App Router pages and components.

### Layering & Composition
- All components are client components; avoid SSR/server APIs entirely. Add `'use client'` when hooks/state are used.
- UI depends on application/domain only; never import infrastructure or `localStorage` directly. No barrels (`index.ts`).
- Use shadcn + Radix primitives for interactive elements; keep styling in Tailwind utility classes.
- Keep modules scoped: shared abstractions in `src/core/`; game-specific UI in `src/games/<game>/ui`.
- Add shadcn components through the registry/CLI flow (https://ui.shadcn.com/docs/mcp) using the project registries in [components.json](../../../components.json); avoid copying snippets by hand and keep Radix structure intact.

### State, Forms, and Data Flow
- Drive mutations through application use cases/hooks that inject repositories and utilities (UUID/time/storage) for testability.
- Forms must use @tanstack/react-form with Zod validators from the domain. Surface errors via `aria-describedby` and visible text.
- Derive display state from use-case outputs; avoid duplicating domain logic in components. Memoize only expensive derived values.

### Accessibility (must pass)
- Follow [.github/instructions/accessibility.instructions.md](../../../.github/instructions/accessibility.instructions.md): single `<main>`, skip link, correct heading order, visible focus, native elements for interactivity.
- Dialogs/menus: use Radix, ensure focus trapping/return works and Escape closes. Icon-only controls need `aria-label`.
- Forms: explicit labels, required indicators in text, error text linked and announced. Respect `prefers-reduced-motion` for animations.

### SEO & Content
- Apply metadata via Next Metadata API on pages; include title/description, OG/Twitter, canonical. See [.github/instructions/seo.instructions.md](../../../.github/instructions/seo.instructions.md).
- Each page needs one H1, intro paragraph, and internal links to related pages. Keep critical copy in static JSX (not hidden behind effects).
- Use `next/image` (or width/height on `<img>`) with descriptive alt text; provide JSON-LD on game overview pages when applicable.

### UI Patterns & Performance
- Use stable keys (entity IDs) for lists; avoid index keys when items reorder. Keep effects minimal; prefer derived rendering over imperative DOM work.
- Lazy-load heavy/rare components with dynamic import; avoid blocking renders with sync storage reads if data is non-critical to first paint.
- Provide responsive layouts down to 320px; no horizontal scroll for main content. Keep focus outlines visible and distinct from hover.

### Anti-Patterns (reject)
- Direct `localStorage` or infra imports in UI; embedding business rules/validation in components instead of domain/application.
- Custom div/span buttons, removed outlines, placeholder-only labels, or color-only status.
- Multiple H1s, skipped heading levels, or metadata missing on new pages. JSON-LD or critical copy rendered only after client effects.

### Quick Checks Before PR
- Page renders without errors with JS disabled (static content still visible); focus order logical; contrast meets AA.
- Metadata present and correct; internal links work; images sized to avoid CLS.
- New interactive flows covered by at least a smoke Playwright path or a11y axe scan snippet if high-touch UI was added.
