---
name: SEO Review
description: Review-only SEO checklist for page metadata, content structure, canonical tags, and structured data.
applyTo: src/app/**/*.{ts,tsx}
excludeAgent: "coding-agent"
---

# SEO review instructions

Only apply this file when the task is explicitly a code review, PR review, or review-focused audit.
Ignore it for implementation, planning, brainstorming, and general chat.

- Follow the checklist in [docs/seo.md](../../../docs/seo.md).
- Focus on findings in metadata, heading structure, internal linking, structured data, rendering, and content quality.
- Verify title, description, canonical, Open Graph, and Twitter metadata where page-level changes are involved.
- Check for a single H1, descriptive internal links, sufficient unique copy, and stable layout for primary content.
- Flag structured data or SEO-critical metadata that is generated only after hydration.
- Flag canonical conflicts, robots issues, missing alt text, and thin or duplicated page copy.
