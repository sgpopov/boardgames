# Copilot review customization

This repository keeps [.github/copilot-instructions.md](../.github/copilot-instructions.md) empty so normal chat, planning, and implementation prompts do not inherit review-only policy as always-on instructions.

Review behavior is split into two parts:

- GitHub Copilot review instructions live in [.github/instructions/review/architecture-review.instructions.md](../.github/instructions/review/architecture-review.instructions.md), [.github/instructions/review/accessibility-review.instructions.md](../.github/instructions/review/accessibility-review.instructions.md), and [.github/instructions/review/seo-review.instructions.md](../.github/instructions/review/seo-review.instructions.md).
- IDE review in VS Code should use the prompt file [.github/prompts/boardgames-review.prompt.md](../.github/prompts/boardgames-review.prompt.md).

All review instruction files start with explicit scoping text:

- Apply only during code review, PR review, or review-focused audit tasks.
- Ignore for implementation, planning, brainstorming, and general chat.

Source of truth for review criteria:

- [docs/clean-architecture.md](./clean-architecture.md)
- [docs/accessibility.md](./accessibility.md)
- [docs/seo.md](./seo.md)

Validation steps:

1. In VS Code, run Chat Diagnostics and confirm normal planning prompts do not load the review prompt automatically.
2. Run `/boardgames-review` in chat and confirm the review prompt is available and the output uses findings-first review style.
3. Request a GitHub Copilot PR review and confirm comments reflect the architecture, accessibility, and SEO checklists.