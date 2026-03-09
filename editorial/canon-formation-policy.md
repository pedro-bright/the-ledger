# Canon Formation Policy

*How canonical syntheses are proposed, ratified, updated, and superseded.*

**Version:** 1.0 | **Last updated:** 2026-03-08

---

## Overview

The canonical layer is The Ledger's primary reader-facing product: a legible, citable, periodically reviewed narrative that synthesizes the immutable event record into current best understanding. This policy governs how canonical syntheses are created and maintained.

## Canon Entry Lifecycle

```
proposed → ratified → [active] → superseded
                    ↘ deprecated
                    ↘ forked (competing syntheses)
```

### States

- **Proposed:** A synthesis has been written and submitted for review. Not yet publicly displayed as canonical.
- **Ratified:** Approved by reviewers. Displayed as the canonical view for its scope.
- **Deprecated:** No longer current but not replaced by a successor. May occur when a thread becomes dormant.
- **Superseded:** Replaced by a newer ratified synthesis. The superseded version remains accessible.
- **Forked:** Competing syntheses exist for the same scope. Each fork must declare its scope distinction or the methodological disagreement that prevents unification.

## Ratification Requirements

A canonical synthesis reaches `ratified` status only with:

- **Minimum sign-off:** 2 of 3 reviewers must approve
- **Named author:** Every synthesis must have an identified human author
- **Review date:** A mandatory future date (typically 90 days) for re-evaluation
- **Scope declaration:** What thread, topic, or time period the synthesis covers

## Supersession Rules

A ratified canon can be superseded only when:

1. At least one supporting claim has changed to `retracted`, `superseded`, or `materially_challenged`
2. A new claim with stronger evidence has been accepted within the canon's scope
3. A periodic review determines that the synthesis no longer reflects current understanding

Supersession creates a new canon entry that references its predecessor. The superseded version remains accessible via git history and the auditor view.

## Competing Syntheses (Forks)

When reviewers cannot agree on a single canonical narrative:

- Two or more syntheses may coexist with `status: forked` and a shared `fork_group` ID
- Each fork must declare either a scope distinction or an unresolved methodological disagreement
- Forked canons are displayed side by side in the reader view with clear labeling
- Resolution of a fork requires the same ratification process as a new canon

## Update SLA

Canon must be re-evaluated within **30 days** of a landmark event being added to its scope. For major events, re-evaluation within 60 days. The thread curator is responsible for initiating re-evaluation.

## Escalation

If a challenge to the canon is not resolved within 14 days through normal review:

1. The challenge enters the editorial panel queue
2. The panel has 30 days to issue a decision
3. The decision is recorded as a formal resolution note

## Launch Requirement

Every thread with `major` or higher significance must have a ratified canonical synthesis before the project's public launch.
