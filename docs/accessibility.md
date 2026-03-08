# Accessibility Guidelines (Client-Only Next.js App)

These project rules align with: Next.js Accessibility Architecture Guide, WCAG 2.2 (AA), WebAIM WCAG Checklist, and the A11Y Project best practices.

---
## 1. Core Principles
1. Perceivable: All essential information exposed via text or programmatically determinable semantics (no sensory-only cues).
2. Operable: Full keyboard access; logical tab order; no keyboard traps.
3. Understandable: Clear labels, predictable navigation, consistent interaction patterns across games.
4. Robust: Valid semantic HTML; ARIA only when native semantics are insufficient.

Target level: WCAG 2.2 AA. Avoid introducing AAA-only requirements unless trivial.

---
## 2. Semantic Structure
- Use proper landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`. Only one `<main>` per page.
- Heading hierarchy strictly descending without skipping levels for styling. Use Tailwind classes to style instead of incorrect heading level.
- Lists (`<ul>`, `<ol>`) and tables (`<table>`) only when data is semantically list or tabular.
- Avoid `div` / `span` for interactive elements; use `<button>`, `<a>`, `<input>`, etc.

---
## 3. Keyboard & Focus Management
- Every interactive component reachable via Tab (default) and Escape closes dialogs/popovers.
- Use Radix primitives (they include many built-in a11y behaviors) but verify focus is returned to the triggering element.
- Do NOT remove native outlines; style them with Tailwind (`focus:outline-none focus-visible:ring-2 focus-visible:ring-primary` etc.).
- No custom key handlers that interfere with standard navigation unless required (e.g. arrow key movement in grids). If implemented, also preserve Tab/Shift+Tab.
- When opening dialogs, first focus a meaningful element (e.g., title or first input). When closing, restore focus to trigger.
- Manage roving focus for composite widgets (menus, toolbars) using appropriate Radix patterns instead of reinventing.

---
## 4. Color & Contrast
- Minimum contrast ratio: Text 4.5:1 (normal), 3:1 (large ≥ 24px or 19px bold). UI components (icons, borders) aimed at 3:1.
- Never convey state solely by color; add icon, text, or pattern.
- Tailwind palette tokens must be checked; if custom colors added ensure contrast with both light and dark backgrounds.
- Provide focus indicators distinct from hover styles.

---
## 5. Forms & Validation
- Each input has a visible label (`<label for>` or ARIA association). Avoid placeholder-only labeling.
- Required fields indicated with textual cue (e.g., `Required`) not just an asterisk.
- Error messages: programmatically associated via `aria-describedby` referencing an element with error text.
- Use semantic input types: `email`, `number`, `date` where applicable.
- Group related fields with `<fieldset>` + `<legend>` if they form a logical set.
- Validation feedback appears on focus-out or submit; never rely solely on color; include icon/text.

### React Form Integration
- `@tanstack/react-form` validators should return structured errors; map them to accessible error regions.
- Announce dynamic errors via `role="alert"` or `aria-live="polite"` region.

---
## 6. ARIA Usage
- Prefer native HTML semantics; add ARIA only to fill semantic gaps.
- Never override native semantics (e.g., `role="button"` on `<a>` without `href` should instead be a `<button>` if an action).
- Use appropriate roles: `dialog`, `menu`, `listbox`, `tabpanel` only when widget pattern fully implemented (focus, keyboard, labeling).
- `aria-label` for purely icon buttons (e.g., close dialog). Avoid ambiguous labels.
- Provide state via ARIA attributes (`aria-expanded`, `aria-pressed`) for toggleable controls.
- Use `aria-live` regions for async status updates (saving, loading) and keep them concise.

---
## 7. Motion, Animation & Preferences
- Respect `prefers-reduced-motion`: wrap non-essential animations in media queries.
```css
@media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
```
- Avoid sudden flashes or rapid transitions; keep animation durations ≥ 100ms and ≤ 400ms for most UI.
- No auto-playing audio/video; require explicit user action.

---
## 8. Game-Specific Interactions
- Any board or dynamic game region must have a text description (e.g., visually hidden `<p>` describing current turn/state) associated with the container via `aria-describedby`.
- Provide deterministic keyboard navigation for token/grids: arrow keys move focus; Home/End to edges; PageUp/PageDown for larger jumps if logical.
- Announce turn changes or critical game events in an `aria-live="polite"` region (avoid assertive unless urgent).

---
## 9. Images & Media
- Meaningful images: descriptive `alt` text describing function/purpose (not “image of…”). Decorative images: empty `alt=""`.
- SVG icons: include `aria-hidden="true"` if decorative. Provide `<title>` inside SVG for meaningful icons if they need labeling.
- Avoid text baked into images; if unavoidable, replicate in alt text.

---
## 10. Responsive & Reflow
- Layouts must remain functional at 320px width; no horizontal scrolling for primary content.
- Content should not lose information when line-height increases to 1.5 or user zooms up to 200%.
- Avoid absolute positioning that breaks reflow on large text.

---
## 11. Performance & Accessibility
- Reduce DOM depth for complex game boards; heavy arrays mapped with keys for stable focus (avoid remount causing focus loss).
- Avoid debounced interactions for keyboard events unless necessary; ensure low input latency for assistive tech compatibility.

---
## 12. Tooling & Automation
- Enable ESLint a11y rules (`eslint-plugin-jsx-a11y`) for lint-time feedback.
- Consider adding an automated Playwright accessibility scan using Axe-core per critical page.
- Unit tests: ensure focus management logic returns focus to trigger after closing overlays.
- Integration tests: simulate keyboard navigation across core interactive components.

Example Playwright snippet:
```ts
import AxeBuilder from '@axe-core/playwright';
test('home page a11y', async ({ page }) => {
	await page.goto('/');
	const results = await new AxeBuilder({ page }).analyze();
	expect(results.violations).toEqual([]);
});
```

---
## 13. Accessibility Review Checklist (PR)
Verify that:
1. Semantic landmarks present (`<main>` single, skip link included if page-level change).
2. All interactive elements use native elements or Radix primitives (no `div` buttons).
3. Focus order logical; newly added dialogs restore focus on close.
4. Visible focus styles present and distinct from hover.
5. Color/contrast meets AA for text & interactive components.
6. No placeholder-only labels; form errors associated and announced.
7. ARIA only where necessary; no redundant or incorrect roles.
8. Icon-only buttons have `aria-label`.
9. Keyboard navigation for custom widgets implemented & documented.
10. Game state changes announced via live region if non-obvious.
11. Animations respect `prefers-reduced-motion`.
12. Axe (or similar) automated scan has zero critical violations.
13. No reliance solely on color to convey status.
14. Alt text appropriate; decorative images hidden.
15. Zoom/reflow does not break layout (manual spot check recommended).

Reject or request changes if any of 1–8 fail, or if repeated issues appear.

---
## 14. Anti-Patterns (Reject)
- `onClick` on `<div>` or `<span>` used as a button without role/keyboard support.
- Removing outline with no replacement (`outline-none` alone).
- Using `aria-live="assertive"` for non-urgent updates (turn changes, routine saves).
- Placeholder used as sole label; missing `<label>`.
- Excessive ARIA (`role="list"` on `<ul>`, `role="button"` on `<button>`).
- Focus trapped (cannot escape modal with ESC or Tab progression leaves viewport).
- Using color-only badge to indicate status (e.g., red circle for error) lacking text.

---
## 15. Documentation & Maintenance
- Each new complex interactive widget (e.g., board navigation) must include a short comment or README snippet explaining keyboard interactions.
- Re-run accessibility checks before releases (add a release script target).

Release script idea:
```bash
npx playwright test --grep @a11y
```
