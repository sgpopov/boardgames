---
name: boardgames-review
description: Run a focused code review for this repository without making review rules always-on in normal chat.
argument-hint: Optional scope, diff, or review focus
agent: agent
---

Perform a code review for this repository.

Scope:
- Use the active file, current selection, attached diff, or the user-provided scope.
- If the scope is ambiguous, ask one short clarifying question before reviewing.

Review rules:
- Follow [docs/clean-architecture.md](../../docs/clean-architecture.md) for architecture and layering checks.
- Follow [docs/accessibility.md](../../docs/accessibility.md) for UI accessibility checks.
- Follow [docs/seo.md](../../docs/seo.md) for page and metadata checks when routing or page content is affected.
- Apply the review-only instruction files in [architecture-review.instructions.md](../instructions/review/architecture-review.instructions.md), [accessibility-review.instructions.md](../instructions/review/accessibility-review.instructions.md), and [seo-review.instructions.md](../instructions/review/seo-review.instructions.md).

Output format:
- Findings first, ordered by severity.
- Include concrete file references and explain the risk or regression.
- Call out missing tests when they matter.
- If no findings are present, state that explicitly and mention residual risks or gaps.

Do not switch into implementation mode unless the user explicitly asks for fixes.
