# Editorial Constitution

*The Ledger's non-negotiable principles. These govern all editorial decisions.*

**Version:** 1.0 | **Ratified:** 2026-03-08 | **Review date:** 2026-09-08

---

## The Nine Principles

### 1. No Silent Rewrites

Events are immutable once published. Updates happen via retrospectives, not edits. Git history is the audit trail. The ledger layer preserves all assertions, disagreements, and corrections. The canonical layer computes current views from immutable records, but the underlying record is never altered.

**Why:** History that can be silently rewritten is not history — it's propaganda. Accountability requires that mistakes be visible, not erased.

### 2. Contestability by Default

Every substantive claim has a challenge window (90 days post-publication) and a visible contestation status (`uncontested` | `contested` | `superseded` | `unresolved`). Disagreement is always possible, never forced. Anyone can file a formal challenge at any time; after the challenge window, unchallenged claims move to "uncontested" status but can always be reopened.

**Why:** Consensus without the possibility of dissent is not consensus — it's silence. Contestability keeps knowledge honest.

### 3. Claims ≠ Facts

Claims are attributed, dated, and contestable. Factual assertions require sources. Analysis is always labeled as analysis and attributed to an author. The Ledger does not claim to know the truth; it claims to track what has been asserted, by whom, with what evidence, and how that understanding has changed.

**Why:** The distinction between "this happened" and "we believe this happened based on these sources" is the foundation of epistemic rigor.

### 4. Time Awareness

All interpretation is timestamped. Wrongness is a feature, not a bug. We track belief decay — how understanding evolves over time — rather than treating changed interpretations as errors to be hidden. Significance can be upgraded or downgraded, and the history of those changes is preserved.

**Why:** The most interesting thing about history is how our understanding of it changes. A system that only shows current views loses the most valuable signal.

### 5. AI Transparency

AI tools used for research assistance and draft structuring are disclosed globally (at `/methodology/ai-assistance`). All factual claims, confidence assessments, and interpretations are reviewed and approved by a named human editor. AI-drafted events are labeled `draft_assistance: ai-assisted` in their metadata.

**Why:** Using AI tools is not disqualifying — hiding their use is. Transparency about methodology is more honest than pretending AI wasn't involved.

### 6. Source Primacy

Primary sources over commentary. Archived URLs mandatory for primary sources (via Wayback Machine or equivalent). Sources are typed as `primary` | `secondary` | `commentary` | `official` to help readers assess evidentiary weight.

**Why:** Commentary layers interpretation on top of events. Primary sources let readers form their own judgments. Archiving prevents link rot from destroying the evidentiary foundation.

### 7. Pluralism

Minority viewpoints are documented, not deleted. Interpretations sections welcome competing narratives. "No substantial dispute known" is a valid, honest state — but when genuine disagreement exists, all credible positions are represented.

**Why:** The goal is not to determine who is right but to faithfully record what different informed observers believe and why.

### 8. Bias Disclosure

Contributors working at, invested in, or otherwise affiliated with relevant actors must disclose those relationships. This applies to financial interests, employment relationships, and other material connections that could influence interpretation.

**Why:** Bias cannot be eliminated, but it can be made visible. Disclosure allows readers to weight contributions appropriately.

### 9. Canon over Log

The primary reader experience is the canonical synthesis — a legible, citable narrative that represents the current best understanding. Provenance is always accessible but never obstructive. The canonical layer is computed from the immutable ledger; it does not replace the ledger.

**Why:** A system that surfaces rigor at the expense of readability will be admired and ignored. The Ledger must be both rigorous and useful.

---

## Rules

- **72-hour rule:** Events cannot be merged until 72 hours after initial reporting. This prevents hot-take history.
- **Challenge window:** 90 days after publication for formal contestation. After this period, unchallenged claims move to "uncontested" status but can always be reopened.
- **Significance review:** Quarterly review by editorial board of all significance ratings.
- **Synthesis required:** Every active thread must have a signed canonical synthesis, updated when significant events are added.
- **Appeals:** Disputed merges go to the editorial board (3-5 rotating members, 6-month terms).
- **No sponsored interpretations, no native ads, no editorial veto by funders.**

---

## Amendment Process

Changes to this constitution require:

1. A formal RFC (Request for Comments) published for community review
2. A minimum 30-day comment period
3. Approval by a majority of the editorial board
4. A public record of the change, including rationale and dissenting opinions

The constitution is versioned. All previous versions remain accessible in git history.
