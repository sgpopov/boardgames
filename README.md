## Board Game Companion

This application is a modular Next.js project that serves as a companion for multiple board games. Each game lives in an independent module following Clean Architecture principles (Domain, Application, Infrastructure, UI).

The following board games are supported at the moment:

* **Phase 10** (https://boardgamegeek.com/boardgame/1258/phase-10)

### Stack

- [Next.js](https://nextjs.org/) - React framework
- [TanStack Form](https://tanstack.com/form/latest/docs/overview) with [Zod validations](https://zod.dev/)
- [shadcn](https://ui.shadcn.com/) - a set of beautifully designed components
- [Lucide](https://lucide.dev/icons/) - open-source icon library
- [Vitest](https://vitest.dev/) for executing unit tests

### High-Level Architecture

```
src/
	core/                # Shared abstractions (entities, repositories, errors, storage)
	games/
		registry.ts        # List of available game modules
		[game]/
			application/
			infrastructure/
			ui/
	app/                 # Next.js routing layer
		games/             # Per-game entry points (UI layer entry)
```

Layer Responsibilities:

* **Domain**: Pure business rules, entities, value objects (no framework imports).
* **Application**: Use cases orchestrating repositories & domain logic.
* **Infrastructure**: Adapters (e.g., LocalStorage), concrete repositories.
* **UI**: React components/pages calling use cases.

### Adding a New Game Module

1. Create a folder under `src/games/<gameId>` with `domain`, `application`, `infrastructure`, `ui`.
2. Define domain entities extending `BaseGame<PlayerType>` as needed.
3. Implement use cases (e.g. `createGame`, `updateSomething`).
4. Implement a repository class adhering to `GameRepository<TGame>`.
5. Add a page under `src/app/games/<gameId>/page.tsx` that wires UI to use cases.
6. Register the game in `src/games/registry.ts` by adding an entry: `{ id: '<gameId>', name: 'Display Name', route: '/games/<gameId>' }`.
7. (Optional) Add shared /game-level UI components inside `ui/`.

### Local Storage Persistence

Games are persisted client-side using a namespaced LocalStorage wrapper (`LocalStorageWrapper`). Each repository stores an array of games under a distinct key (`everdell:games`, `phase10:games`). This can be swapped for server APIs later by providing new repository implementations.

### Development

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 and select a game. Changes in modules hot reload.
