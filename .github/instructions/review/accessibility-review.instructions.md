---
name: Accessibility Review
description: Review-only accessibility checklist for interactive UI, forms, focus, and announcements.
applyTo: src/**/*.{tsx,css}
excludeAgent: "coding-agent"
---

# Accessibility review instructions

Only apply this file when the task is explicitly a code review, PR review, or review-focused audit.
Ignore it for implementation, planning, brainstorming, and general chat.

- Follow the PR checklist in [docs/accessibility.md](../../../docs/accessibility.md).
- Focus on semantic HTML, keyboard access, focus management, labels, errors, live regions, and reduced motion.
- Reject `div` or `span` controls used as buttons without complete keyboard support.
- Check icon-only buttons for accessible names and form fields for visible labels and linked errors.
- Check dialogs, menus, and custom widgets for logical focus order and focus restoration.
- Check that status and game-state changes are not conveyed by color alone.
- Call out likely WCAG 2.2 AA regressions and missing accessibility tests.
