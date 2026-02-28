## Board Game Companion — AI Guide

### Overview
- Client-only Next.js app that tracks multiple board games (e.g. Phase 10, Everdell, Flip 7). Each game is a self-contained module wired through the registry in [src/games/registry.ts](src/games/registry.ts) and routes in [src/app/routes.ts](src/app/routes.ts).
- Architecture follows Clean Architecture with four layers per game (domain, application, infrastructure, UI) plus shared core abstractions.
- Persistence is local-only via repositories over `localStorage`; no server APIs or SSR/Server Components.

### Tech Stack (must stay aligned)
- Next.js App Router (client components only), React 19, Tailwind 4, shadcn + Radix primitives.
- Forms: @tanstack/react-form + Zod validation.
- Testing: Vitest (unit/integration), Playwright (e2e).

### Core Conventions (strict checklist)
- Respect layer boundaries: UI → application → domain; infrastructure depends inward. Domain/application remain framework-free. See [.github/instructions/clean-architecture.instructions.md](.github/instructions/clean-architecture.instructions.md).
- No barrels (`index.ts`) re-exports; import concrete files.
- UI never touches `localStorage`; only repositories/adapters in infrastructure do. Inject dependencies for IDs/time/storage to keep tests deterministic.
- Pages/components are client components; avoid SSR features (`cookies()`, `headers()`, route handlers, server fetch). Add `'use client'` when needed.
- Accessibility: semantic landmarks, focus management, labels/errors, contrast, live regions for game state. Follow [.github/instructions/accessibility.instructions.md](.github/instructions/accessibility.instructions.md).
- SEO: metadata per page, single H1, structured copy, JSON-LD for game pages, internal links, stable canonical. Follow [.github/instructions/seo.instructions.md](.github/instructions/seo.instructions.md).
- shadcn UI: add components via the registry/CLI flow (see https://ui.shadcn.com/docs/mcp) using the configured entries in [components.json](components.json); prefer composition over heavy customization and keep Radix primitives intact.

### How to Validate Changes (run locally)
- Install deps: `npm install`
- Lint: `npm run lint`
- Unit/integration: `npm run test:unit`
- E2E (headless): `npm run test:e2e`
- E2E UI runner: `npm run test:e2e:ui`
- Build sanity: `npm run build`

### Security & Data Hygiene
- No PII collection; all data stays in-browser. Namespaced storage keys per game; prefer DTO mappers to keep schema stable.
- Avoid third-party network calls; if added, gate behind interfaces and document clearly.
- Keep dependencies minimal; update vulnerable packages promptly; never commit secrets.

### PR Expectations
- New features: include tests at relevant layers, wire metadata/a11y for new pages, and update registry/routes if adding a game.
- Reject/redo if any checklist item above is violated.
