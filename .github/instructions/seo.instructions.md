# SEO Guidelines (Client-Only Next.js Board Games)

Reference Sources: Next.js Learn SEO, Google Search Essentials, MDN best practices, general modern web performance + structured data guidelines.

Our app is client-side only (no SSR / no server components). We rely on static build output plus client hydration. SEO must therefore emphasize pre-rendered static HTML where possible and avoid deferring primary content exclusively to client-side JS execution (which could reduce crawl fidelity). Every game module should expose crawlable descriptive content and metadata.

---
## 1. SEO Objectives
1. Discoverability: Each game has an indexable overview page and optionally deep links (rules, setup, strategy tips).
2. Clarity: Metadata accurately describes page purpose to improve CTR.
3. Performance: Fast initial paint & interactive for better Core Web Vitals.
4. Accessibility Synergy: Semantic markup improves parsing & ranking.
5. Maintainability: Consistent patterns for adding new game pages with minimal duplication.

Target metrics (non-binding but aspirational): LCP < 2.5s, FID negligible (client-only), CLS < 0.1.

---
## 2. Routing & URL Strategy
- Human-readable, lowercase, hyphen-separated paths: `/games/phase-10`, `/games/everdell/setup`.
- Avoid query-string for canonical content; reserve for ephemeral filters.
- Provide canonical `<link rel="canonical">` for any page with potential duplicate paths.
- Use stable IDs only if necessary; prefer descriptive slugs.

---
## 3. Metadata (Next.js App Router)
- Use the Next.js Metadata API in page/layout files via exported `metadata` object or `generateMetadata` if dynamic.
- Required fields per game root page:
	- `title`: Game name + primary action (e.g., "Phase 10 – Setup & Play Tracker").
	- `description`: 150–160 chars summarizing functionality & unique value.
	- `openGraph`: type `website`, include `title`, `description`, `url`, `images` (optimized).
	- `twitter`: card `summary_large_image`, mirrored title/description.
	- `alternates`: canonical URL string.
	- `robots`: index, follow (unless intentionally private).
- Provide `viewport` meta in root layout only (avoid duplication).
- Avoid dynamic client-only modifications of critical metadata; ensure static export contains essential tags.

Example skeleton:
```ts
export const metadata = {
	title: 'Phase 10 – Setup & Play Tracker',
	description: 'Track turns, players, and phase progression for Phase 10. Fast local play management with persistent storage.',
	openGraph: {
		title: 'Phase 10 – Setup & Play Tracker',
		description: 'Track turns, players, and phase progression for Phase 10.',
		url: 'https://example.com/games/phase-10',
		images: [{ url: '/og/phase10.png', width: 1200, height: 630, alt: 'Phase 10 game tracking interface' }]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Phase 10 – Setup & Play Tracker',
		description: 'Track turns, players, and phase progression for Phase 10.',
		images: ['/og/phase10.png']
	},
	robots: { index: true, follow: true },
	alternates: { canonical: 'https://example.com/games/phase-10' }
};
```

---
## 4. Content Strategy & On-Page Copy
- Each game page must include:
	- H1: Game name.
	- Intro paragraph: What functionality the tracker provides.
	- Rules summary or link to official rules (no copyright infringement; paraphrase).
	- Features list (ul) describing in-app utilities.
- Provide internal links to related strategy/setup pages (anchor text descriptive, not "click here").
- Avoid thin pages: minimum 200 words of unique descriptive content for main game overview.
- Use structured sub-headings (H2/H3) for scanning.

---
## 5. Structured Data (JSON-LD)
- Add `application/ld+json` script for game pages representing a SoftwareApplication or Game.
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
	'@context': 'https://schema.org',
	'@type': 'Game',
	name: 'Phase 10 Tracker',
	description: 'Track player progress and phases locally in your browser.',
	genre: 'Card Game',
	operatingSystem: 'Any modern browser',
	applicationCategory: 'GameUtility',
	url: 'https://example.com/games/phase-10'
}) }} />
```
- Keep structured data minimal & accurate; avoid promotional hype.
- Validate via Rich Results Test.

---
## 6. Images & Media
- Use `next/image` for optimization (even client-only build still benefits from Next image pipeline if configured) else ensure width/height attributes to prevent CLS.
- Descriptive alt text; avoid keyword stuffing.
- Provide social preview images (1200x630) under predictable path `public/og/<slug>.png`.
- Use modern formats (WebP/AVIF) with fallback if necessary.

---
## 7. Performance Optimization (Indirect SEO)
- Minimize JavaScript: keep game logic modular; lazy-load heavy visualization components with dynamic import.
- Tree-shake unused Radix/shadcn components; avoid bundling entire icon sets (import icons individually).
- Use Tailwind strategy that purges unused classes (default). Avoid runtime class generation.
- Defer non-critical scripts; avoid blocking synchronous `localStorage` reads during initial render (batch them inside effects if not needed for first paint).
- Preload critical fonts via `next/font` (automatic) to reduce layout shift.
- Avoid layout shifts when dynamic lists appear: reserve space or skeleton placeholders.

---
## 8. Internal Linking & Navigation
- Footer or sidebar lists key games with descriptive anchor text.
- Use breadcrumb pattern for deeper subpages if hierarchy emerges (e.g., `/games/everdell/setup` -> home > everdell > setup).
- Ensure skip link works (a11y synergy) and navigation order is logical.
- Avoid orphan pages: each new page linked from at least one existing page (preferably game index or homepage).

---
## 9. Canonical & Robots
- Only one canonical URL per page; no self-referencing duplicates.
- For non-index pages (draft features) set `robots: { index: false, follow: false }`.
- Avoid meta keywords (obsolete). Do not add unnecessary meta tags (e.g., `http-equiv="X-UA-Compatible"`).

---
## 10. Client-Only Caveats
- Critical textual content must be present in initial HTML build (avoid rendering all meaningful content via client-only conditional after mount). Use static JSX in page files for descriptive sections.
- Avoid infinite spinners or placeholders hiding main content from crawlers.
- Ensure dynamic game state widgets degrade gracefully: crawlers should still see headings, descriptive paragraphs, and static placeholders.

---
## 11. Accessibility & SEO Overlap
- Proper heading hierarchy aids crawler comprehension.
- Alt text, labels, and ARIA naming support snippet quality.
- Avoid duplicate IDs (breaks accessibility and structured data clarity).

---
## 12. Internationalization (Future)
- Plan for i18n by isolating copy in resource files; stable URLs can include locale prefix `/en/`, `/es/` if added later.
- Avoid embedding language-specific content in structured data without specifying `inLanguage` when multi-lingual.

---
## 13. Copilot Code Generation Rules (SEO)
When generating page or component code Copilot should:
1. Add `metadata` export with title & description under 60/160 char limits respectively.
2. Include at least one descriptive H1 and supporting paragraphs in page root.
3. Provide internal links to related game pages using semantic anchor text.
4. Insert JSON-LD structured data script for game overview pages.
5. Use `next/image` with width, height, and alt for primary images.
6. Avoid duplicating canonical or viewport meta tags.
7. Ensure lazy/dynamic imports only for non-critical components.
8. Avoid keyword stuffing; write natural descriptive copy.
9. Suggest social image path if missing.
10. Ensure main content not hidden behind conditional that requires user interaction.

---
## 14. Code Review Checklist (SEO)
Reviewer (and Copilot) must verify:
1. Metadata present (title, description, OG/Twitter, canonical).
2. Title & description lengths appropriate (no truncation risk, no keyword stuffing).
3. Single H1 present; logical heading hierarchy thereafter.
4. JSON-LD valid (passes quick JSON parse; correct schema type).
5. Images have alt text; primary social image exists or ticket created.
6. Internal links use descriptive anchor text (no generic "click here").
7. Page contains sufficient unique descriptive content (not thin or duplicate).
8. No blocking large script preventing first contentful paint.
9. No duplicate canonical tags or conflicting robots directives.
10. Structured data & meta tags not generated client-side only after hydration.
11. No unused meta tags (keywords, generator, etc.).
12. CLS risk mitigated (images w/ dimensions, stable layout containers).

Reject or request changes if any of 1–7 fail for new pages.

---
## 15. Metrics & Monitoring (Optional Enhancements)
- Integrate Lighthouse CI for performance + SEO audits on PR.
- Track Core Web Vitals via web-vitals library and log (optional future).
- Periodically validate sitemap & structured data.

---
## 16. Sitemap & Robots.txt
- Generate static `sitemap.xml` at build listing game pages + subpages.
- Keep `robots.txt` simple: allow all except explicit private paths.
```txt
User-agent: *
Disallow: /draft/
Allow: /
Sitemap: https://example.com/sitemap.xml
```

Implementation hint: Add small script to build game registry into sitemap.

---
## 17. Anti-Patterns (Reject)
- Empty description or keyword-stuffed description.
- All main copy inside client-only effect or hidden until interaction.
- Multiple H1s or skipped heading levels (H1 then H4).
- Using images instead of text for headings.
- Canonical pointing to unrelated domain.
- Huge JSON-LD with irrelevant properties (overfitting for rich results).
- Forcing index on obviously duplicate/test pages.

---
## 18. Example Game Page Skeleton
```tsx
// app/games/phase-10/page.tsx
export const metadata = { /* as above example */ };

export default function Phase10Page() {
	return (
		<main id="main" className="prose max-w-3xl mx-auto px-4 py-8">
			<h1>Phase 10 – Setup & Play Tracker</h1>
			<p>Use this tracker to manage player turns, phases, and progress locally in your browser. Your data stays private and persists automatically.</p>
			<h2>Features</h2>
			<ul>
				<li>Player phase progression with validation</li>
				<li>Turn history and undo support</li>
				<li>Local persistence (no accounts)</li>
			</ul>
			<h2>How It Works</h2>
			<p>Enter players, start a game, and update phases as each player completes them...</p>
			<nav aria-label="Related">
				<ul className="list-disc pl-5">
					<li><a href="/games/phase-10/strategy">Strategy Tips</a></li>
					<li><a href="/games/phase-10/rules">Rules Summary</a></li>
				</ul>
			</nav>
			{/* JSON-LD component */}
		</main>
	);
}
```

---
## 19. Future Considerations
- Add localized metadata once i18n arrives (`generateMetadata` based on locale param).
- Consider `game` category schema enhancements with `aggregateRating` only when user reviews feature exists.
- Potential static export for guaranteed HTML presence.

---
## 20. Summary
These SEO rules ensure each game module is indexable, descriptive, performant, and accessible. Copilot must embed metadata, semantic content, internal links, structured data, and avoid client-only hidden critical information. Review checklist enforces consistency and prevents regressions.

