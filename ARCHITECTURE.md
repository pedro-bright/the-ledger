# The Ledger — Architecture Document (v3)
### *An epistemic ledger of AI history*

> "History is written by the present. We write it as it happens — then watch ourselves be wrong."

**Reviewed:** 4 rounds with GPT-5.2-chat (grade: A) + 6 rounds with GPT-5.4-pro (grade: B- → A- → A). March 8, 2026.

---

## 1. Product Identity

**Name:** The Ledger  
**Tagline:** *How understanding changes over time.*

**Core thesis:** The AI field's history is being lost in ephemeral, scattered sources. The Ledger is not a news aggregator or encyclopedia — it's a **machine for watching collective understanding evolve**. We track events, connect them into narrative threads, preserve contestability, and make "here's what we got wrong" a first-class feature.

**Primary axis:** Time-aware historical reinterpretation — with epistemic rigor as the method and power analysis as the lens.

**Product principle (from GPT-5.4-pro):** *The institution is not the log; it is the editorial process that turns the log into public knowledge.* The Ledger produces canonical, citable, periodically reviewed histories — with transparent provenance underneath.

**What makes this different:**
- Not a news site (archival, not breaking)
- Not Wikipedia (chronological, narrative, opinionated about significance — but with transparent provenance)
- Not a newsletter (structured data, open source, community-maintained)
- Not Twitter (curated, permanent, evolving)

**Target audience:**
- **Primary:** AI practitioners, researchers, and informed observers who want to understand not just what happened, but how our understanding of what happened has changed
- **Secondary:** Policymakers, journalists, students using it as reference

---

## 2. Core Architectural Principles

### Dual-Layer Representation

The Ledger has two layers over the same data:

1. **Ledger Layer** (backend) — Immutable, append-only event history and argument graph. All assertions, disagreements, edits, and retrospectives are preserved. No silent rewriting. This is the audit trail and the epistemic engine.

2. **Canonical Layer** (frontend) — Computed "current best understanding" view of a thread, claim, or topic. This is what readers see first. It synthesizes the ledger into legible, citable narratives.

**Key rule:** Users read the canonical layer first; power users inspect the ledger beneath it. History is one click away, not in your face.

**Why both:** Immutability without canonical views produces "epistemic UX collapse" — readers admire the rigor and then stop using it. Canonical views without immutability produce Wikipedia-style silent overwrites that destroy accountability. Both layers are necessary.

### Progressive Formalization

The data model has **3 core primitives** and **extended types** that build on them:

**Core primitives (required for all contributions):**
1. **Claim** — A sourced assertion about what happened
2. **Response** — A reaction, challenge, or endorsement of a claim
3. **Retrospective** — A reinterpretation of a prior claim in light of new evidence

**Extended types (optional enrichment, added by editors over time):**
- Objection, Endorsement, Synthesis, Reframe, Decision, Supersession
- Full controversy structure (multi-axis positions)
- Thread narratives with interpretations
- Perspective essays

**Contribution tiers:**
- **Tier 0:** Plain submission — source + claim (anyone, via issue form)
- **Tier 1:** Editor normalizes into event with kernel schema
- **Tier 2:** Specialists enrich with extended types, thread connections, controversy structures

This means contributors don't need to master the full ontology on day one. Low barrier entry, rich structure available for those who want it.

### Contestability, Not Compulsory Dissent

Every substantive claim must have:
- A **challenge period** (open objection slot after publication)
- A visible **contestation status**: `uncontested` | `contested` | `superseded` | `unresolved`
- The ability to attach counterclaims at any time

But **no requirement for fabricated disagreement** in threads where no credible dispute exists. "No substantial dispute known" is a valid, honest state.

A thread's contestation status is tracked:
```yaml
contestation:
  status: contested          # uncontested | contested | superseded | unresolved
  challenge_window: open     # open | closed (closed after 90 days if uncontested)
  last_challenged: 2026-03-08
```

**When disagreement objects appear** (any of these triggers):
- A credible conflicting source exists
- Interpretation materially affects downstream understanding
- Confidence is below "high"
- A community member files a formal challenge

This captures the spirit of 5.2's "surface tension" without forcing fake dissent.

---

## 3. Editorial Constitution (Non-Negotiable)

### Principles

1. **No Silent Rewrites** — Events are immutable once published. Updates happen via retrospectives, not edits. Git history is the audit trail. Immutability is enforced at the ledger layer; the canonical layer computes current views from immutable records.

2. **Contestability by Default** — Every substantive claim has a challenge window and a visible contestation status. Disagreement is always possible, never forced.

3. **Claims ≠ Facts** — Claims are attributed, dated, and contestable. Factual assertions require sources. Analysis is always labeled as analysis.

4. **Time Awareness** — All interpretation is timestamped. Wrongness is a feature, not a bug. We track belief decay, not errors.

5. **AI Transparency** — AI tools used for research assistance and draft structuring are disclosed globally (at `/methodology/ai-assistance`). All factual claims, confidence assessments, and interpretations are reviewed and approved by a named human editor.

6. **Source Primacy** — Primary sources over commentary. Archived URLs mandatory for primary sources. Sources typed as primary / secondary / commentary / official.

7. **Pluralism** — Minority viewpoints are documented, not deleted. Interpretations sections welcome competing narratives.

8. **Bias Disclosure** — Contributors working at or invested in relevant actors must disclose.

9. **Canon over Log** — The primary reader experience is the canonical synthesis. Provenance is always accessible but never obstructive.

### Rules

- **72-hour rule:** Events can't be merged until 72 hours after initial reporting (prevents hot-take history)
- **Challenge window:** 90 days after publication for formal contestation (after which status moves to "uncontested" if unchallenged — but can always be reopened)
- **Significance review:** Quarterly review by editorial board
- **Synthesis required:** Every thread must have a signed canonical synthesis (updated when events are added)
- **Appeals:** Disputed merges go to editorial board (3-5 rotating members, 6-month terms)
- **No sponsored interpretations, no native ads, no editorial veto by funders**

---

## 4. Data Model

### Events (Kernel Schema)

Every event is a markdown file with structured YAML frontmatter. The kernel fields are required; extended fields are optional and added during enrichment.

```yaml
---
# === KERNEL (required) ===
id: anthropic-dod-ban-2026
title: "Anthropic Refuses Military Deployment of Claude"
date: 2026-03-01
category: policy                           # policy | models | research | industry | safety | culture | open-source
sources:
  - url: https://...
    title: "Original reporting"
    type: primary                          # primary | secondary | commentary | official

# === ENRICHED (added by editors, Tier 1-2) ===
end_date: 2026-03-05                       # optional, for multi-day events
significance: landmark                     # landmark | major | notable
confidence: high                           # high | medium | low | disputed
contestation:
  status: contested                        # uncontested | contested | superseded | unresolved
  challenge_window: open
  last_challenged: 2026-03-08
actors:
  - id: anthropic                          # references actors/ registry
    role: subject
  - id: us-dod
    role: counterparty
regions: [US]                              # geopolitical scope
tags: [military-ai, ethics, acceptable-use-policy]
threads: [ai-military-ethics, frontier-lab-governance]
related: [openai-pentagon-2024, google-maven-2018]
sources:                                   # enriched sources
  - url: https://...
    archive_url: https://web.archive.org/...   # mandatory for primary
    title: "Original reporting"
    publisher: NYT
    type: primary
    date: 2026-03-01
    accessed: 2026-03-03
significance_history:
  - level: major
    date: 2026-03-01
    reason: "Initial assessment"
  - level: landmark
    date: 2026-06-01
    reason: "Triggered industry-wide policy shift"
state: published                           # draft | published | challenged | superseded
revision:
  created: 2026-03-04
  last_reviewed: 2026-03-08
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

*[Concise canonical summary — the first thing readers see. Updated when retrospectives are issued. Always reflects current best understanding.]*

Anthropic formally declined a DoD request to deploy Claude for military
intelligence analysis, becoming the first frontier lab to refuse a direct
military contract since Google's Project Maven withdrawal in 2018.

## What Happened

On March 1, 2026, Anthropic formally declined a Department of Defense
request to deploy Claude for military intelligence analysis...

## Why It Matters

This marks the first time a frontier AI lab has publicly refused a
direct military contract since Google's Project Maven withdrawal in 2018...

## Timeline

- **Feb 28:** Reports emerge of DoD pressure through Palantir partnership
- **Mar 1:** Anthropic CEO Dario Amodei publishes internal memo
- **Mar 3:** Bipartisan Senate letter criticizes decision

## Analysis

*[Labeled as editorial analysis, signed by author]*

The decision crystallized a fault line that had been forming since...
```

### Significance Framework

- **Landmark** (~2-5/year) — Fundamentally alters AI trajectory. Future textbooks will cover these.
- **Major** (~2-4/month) — Meaningfully shifts the landscape.
- **Notable** (~5-10/week) — Worth documenting for the record.

Significance can be **upgraded** over time. The upgrade is tracked in `significance_history` and surfaced in the UI. This enables historical humility: "We thought this was minor. We were wrong."

### Threads

Connect events into narrative arcs. The killer feature.

```yaml
---
id: ai-military-ethics
title: "AI and the Military-Industrial Complex"
status: active                             # active | dormant (never "resolved")
started: 2017-06-01
core_question: "Can advanced AI systems be ethically developed within military institutions without accelerating harm?"
curator: terry-tang
curator_scope: initial-synthesis
contestation:
  status: contested
  challenge_window: open
last_updated: 2026-03-08
events:
  - google-maven-2017
  - google-maven-employee-revolt-2018
  - openai-military-policy-change-2024
  - anthropic-dod-ban-2026
controversies:
  - militarization-vs-safety
---

## Canonical Synthesis

*[Signed synthesis: current best reading with named unresolved disagreements. This is what most readers see. Updated when events are added.]*

**Author:** terry-tang | **Last updated:** 2026-03-08

The question of military AI collaboration has traced a clear arc from...
The current dominant reading is... However, significant unresolved tension
remains around [institutional capture] and [democratic oversight]...

## The Arc

**2017-2018: The Maven Precedent.** Google's contract with the Pentagon...

**2024: The OpenAI Pivot.** When OpenAI quietly updated its usage policy...

**2026: The Line Drawn.** Anthropic's refusal created the clearest split...

## Interpretations

### Safety-first reading
Working with military institutions allows AI labs to shape norms...

### Power-consolidation reading
Collaboration legitimizes military AI use and erodes ethical red lines...

### National security reading
AI capabilities are too consequential to leave outside democratic institutions...

## Open Questions

- Will investor pressure force Anthropic to reverse course?
- Does this accelerate a sovereign AI capability race?
```

### Controversies

Structured contestation tracking, multi-axis:

```yaml
---
id: militarization-vs-safety
thread: ai-military-ethics
status: active
polarity: multi-axis                       # not binary
last_updated: 2026-03-08
positions:
  - claim: "Safety Through Engagement"
    proponents: [anthropic-leadership, national-security-analysts]
    sources: [...]
    confidence: medium
  - claim: "Normalization of Militarization"
    proponents: [civil-liberties-orgs, ai-researchers-against]
    sources: [...]
    confidence: medium
  - claim: "Institutional Capture Risk"
    proponents: [governance-researchers]
    sources: [...]
    confidence: medium
---
```

### Retrospective Reinterpretations

The "wrongness" feature. NOT errata — tracks **belief decay**.

```yaml
---
id: retro-scaling-laws-2024
type: retrospective-reinterpretation
reinterprets: gpt-4-scaling-debate
date: 2025-04-10
trigger: investigative_reporting           # new_evidence | investigative_reporting | historical_distance | actor_reversal
author: terry-tang
original_claim_summary: "We believed scaling laws were saturating."
what_changed: "Post-2025 compute efficiency gains invalidated the slope assumption."
why_we_were_wrong:
  - Hidden variable ignored
  - Incentive misread
confidence_at_time: 0.7
confidence_now: 0.3
editorial_status: approved
---

## Retrospective Reinterpretation

[Narrative explaining how understanding evolved...]

## What Changed
...

## What Did Not Change
...

## Editorial Note
This reinterpretation does not invalidate the original event record.
It reflects how understanding evolved as new information emerged.
```

**Effect on canonical layer:** When a retrospective is issued, the event's Summary section is updated to reflect current understanding, and a reinterpretation banner links to the full retrospective. The original event body remains immutable.

### Signed Syntheses (First-Class Artifact)

Threads culminate not in consensus, but in a **signed synthesis**: "current best reading, with named unresolved disagreements." This is the canonical view most readers see.

```yaml
---
id: synthesis-ai-military-2026-q1
thread: ai-military-ethics
author: terry-tang
date: 2026-04-01
review_date: 2026-07-01
type: canonical-synthesis
supersedes: synthesis-ai-military-2025-q4   # previous synthesis
---

## Current Best Reading

As of Q1 2026, the dominant trajectory is...

## Unresolved Disagreements

1. **Institutional capture vs. democratic embedding** — [contested, see controversy]
2. **Whether commercial incentives override safety commitments** — [unresolved]

## What Changed Since Last Synthesis

- Anthropic's DoD refusal (landmark event) shifted the landscape...
```

### Perspectives (Meta-Analysis Layer)

Periodic synthesis pieces — the "chapters" of the chronicle:

```yaml
---
id: consolidation-era-2026
title: "Q1 2026: The Consolidation Era"
author: terry-tang
type: quarterly-synthesis                  # quarterly-synthesis | thematic-essay | retrospective
date: 2026-04-01
review_date: 2026-07-01
events_covered: [deepseek-r1, anthropic-dod-ban, ...]
---
```

Explicitly labeled as editorial analysis, authored and signed, with a review date for revisitation.

### Actor Registry

Structured references instead of free-text:

```yaml
# actors/anthropic.yml
id: anthropic
name: Anthropic
type: company                              # company | government | research-lab | individual | organization
founded: 2021
website: https://anthropic.com
aliases: [Anthropic PBC]
```

### Event State Machine

Every event follows a lifecycle:

```
draft → published → challenged → revised/superseded
                  ↘ uncontested (after challenge window)
```

- **draft:** Being written, not yet public
- **published:** Live, within challenge window
- **challenged:** A formal contestation has been filed
- **uncontested:** Challenge window closed with no disputes
- **superseded:** A retrospective has materially updated understanding

---

## 5. Directory Structure

```
the-ledger/
├── README.md
├── CONTRIBUTING.md
├── LICENSE                                # CC BY-SA 4.0
│
├── editorial/
│   ├── constitution.md                    # editorial principles
│   ├── review-process.md                  # how PRs are reviewed
│   ├── confidence-guidelines.md           # calibration guide
│   ├── style-guide.md                     # writing standards
│   └── ai-assistance.md                   # AI tool disclosure
│
├── content/
│   ├── events/
│   │   ├── 2023/
│   │   ├── 2024/
│   │   ├── 2025/
│   │   └── 2026/
│   │       ├── 01-deepseek-r1-release.md
│   │       ├── 02-anthropic-dod-ban.md
│   │       └── ...
│   ├── threads/
│   │   ├── ai-military-ethics.md
│   │   ├── open-vs-closed-weights.md
│   │   ├── scaling-laws-debate.md
│   │   └── ai-copyright-wars.md
│   ├── controversies/
│   │   ├── militarization-vs-safety.md
│   │   └── ...
│   ├── retrospectives/
│   │   └── ...
│   ├── syntheses/                         # canonical thread syntheses
│   │   └── ...
│   ├── perspectives/
│   │   ├── 2026-q1-consolidation-era.md
│   │   └── ...
│   └── actors/
│       ├── anthropic.yml
│       ├── openai.yml
│       ├── us-dod.yml
│       └── ...
│
├── schema/
│   ├── event.schema.json
│   ├── thread.schema.json
│   ├── controversy.schema.json
│   ├── retrospective.schema.json
│   ├── synthesis.schema.json
│   └── actor.schema.json
│
├── scripts/
│   ├── validate.ts                        # frontmatter schema check
│   ├── check-links.ts                     # source URL liveness
│   ├── check-archives.ts                  # Wayback Machine coverage
│   ├── build-graph.ts                     # event-thread relationship graph
│   ├── build-canonical.ts                 # compute canonical views from ledger
│   └── generate-feed.ts                   # RSS/Atom
│
├── site/                                  # Astro static site
│   ├── astro.config.mjs
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro                # timeline hero
│   │   │   ├── events/[id].astro          # event deep-dive
│   │   │   ├── threads/[id].astro         # thread narrative (canonical view)
│   │   │   ├── controversies/[id].astro
│   │   │   ├── retrospectives/[id].astro
│   │   │   ├── perspectives/[id].astro
│   │   │   ├── explore.astro              # search/filter explorer
│   │   │   └── about.astro
│   │   ├── components/
│   │   │   ├── Timeline.tsx               # interactive vertical timeline
│   │   │   ├── EventCard.tsx
│   │   │   ├── CanonicalSummary.tsx       # the "current view" — what readers see first
│   │   │   ├── LedgerHistory.tsx          # expandable provenance/diff view
│   │   │   ├── ThreadView.tsx
│   │   │   ├── ControversyPanel.tsx
│   │   │   ├── ReinterpretationBanner.tsx  # visual flag on reinterpreted events
│   │   │   ├── ContestationBadge.tsx      # shows contestation status
│   │   │   ├── SignificanceHistory.tsx     # shows significance evolution
│   │   │   └── ConfidenceBadge.tsx
│   │   └── lib/
│   │       ├── content.ts                 # parse all markdown
│   │       ├── canonical.ts               # compute canonical views
│   │       └── graph.ts                   # build relationship graph
│   └── public/
│
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── new-event.yml                  # Tier 0: simple claim + source
    │   ├── challenge.yml                  # file a formal contestation
    │   └── reinterpretation.yml
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        ├── validate.yml                   # CI: schema, links, dates
        ├── deploy.yml                     # auto-deploy on merge
        └── stale-sources.yml              # weekly link rot check
```

---

## 6. Contribution Workflow (Progressive)

### Tier 0: Anyone (Issue Form)
- Submit a claim + source via GitHub Issue form
- No schema knowledge required
- Template: "What happened? When? Link to source."
- An editor picks it up and normalizes into a full event

### Tier 1: Event Normalization (Editors)
- Editor converts Tier 0 submissions into kernel schema
- Adds category, significance, confidence, sources
- 72-hour minimum from initial reporting
- **1 reviewer** sign-off required
- AI-drafted events labeled `draft_assistance: ai-assisted`

### Tier 2: Enrichment (Trusted Contributors)
- Add thread connections, actor links, controversy structures
- Create/update signed syntheses
- Write perspectives and retrospectives
- **2 reviewer** sign-off required
- Threads must have a named curator

### Tier 3: Editorial (Board)
- Constitution changes, significance framework, schema evolution
- RFC process → community discussion → editorial board vote
- 3-5 rotating board members, 6-month terms

### Contestation Workflow
1. Community member files a **challenge** (via issue form or PR)
2. Event moves to `challenged` state
3. Challenge is either:
   - Resolved (event updated via retrospective if warranted)
   - Documented as ongoing controversy
   - Dismissed with stated reasoning
4. All challenge resolutions are public and diffable

---

## 7. Presentation — Layered Reading Modes

Three views over the same data, serving different needs:

### Reader View (Default)
- **Canonical synthesis first** — concise narrative summary, confidence, key sources
- Clean, legible, citable
- Contestation badge visible but not dominant
- "Dive deeper →" link to analyst view
- This is what 80% of visitors see and use

### Analyst View
- Full event body with all sections
- Structured claims and evidence
- Thread connections and controversy panels
- Interpretations sections
- Significance history

### Auditor View
- Full provenance: revision log, diffs, editorial actions
- Retrospective chain
- Challenge history
- Git-level detail

**Key UI rule:** Never expose ontology first. Expose answer first, structure second.

### Timeline (Hero)
- Vertical scrolling, events as cards
- Sized by significance (landmark > major > notable)
- Color-coded by category
- Filter by category, date range, actor, confidence, contestation status

### Event Pages
- Summary (canonical) at top
- Full narrative + sources sidebar
- **Reinterpretation banner** (visually unavoidable) if retrospectives exist
- Contestation badge
- Significance history shown if upgraded
- "Part of thread: [link]" navigation
- "Last reviewed: [date]" always visible
- "View history" expandable (ledger layer)

### Thread Pages
- **Signed canonical synthesis at top** (current best reading)
- Mini-timeline of connected events
- Interpretations sections (competing readings)
- Active controversies panel
- Curator attribution
- "View full ledger" for provenance

### Explorer
- Searchable, filterable grid
- Facets: category, date, significance, confidence, region, actor, contestation status

---

## 8. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Content | Markdown + YAML frontmatter | Git-native, diffable, zero lock-in |
| Site | Astro | Static-first, markdown-native, fast, SEO-friendly |
| Interactive components | React (via Astro islands) | Timeline, explorer, controversy panels, layered views |
| Search | Pagefind (static) | No infrastructure, works offline |
| CI | GitHub Actions | Schema validation, link checking, archive verification |
| Hosting | Vercel or Netlify | Free tier, auto-deploy on merge |
| Analytics | Plausible | Privacy-respecting |
| Feed | RSS/Atom | Auto-generated from events |
| License | CC BY-SA 4.0 | Open, attribution required |

**Scale note:** Flat files + static generation is fine to ~100K events. The bottleneck will be editorial throughput, not technology. Astro islands handle interactive requirements without framework lock-in.

---

## 9. Launch Plan

### Phase 1: Seed Content (Weeks 1-3)
- 40-60 events from 2023-2026 (landmark + major)
- 4 threads: AI Military Ethics, Open vs Closed Weights, Scaling Laws Debate, AI Copyright Wars
- 5 controversies
- 3-5 retrospective reinterpretations (demonstrating belief evolution)
- 4 signed syntheses (one per thread)
- 1 quarterly perspective piece
- Actor registry: ~20 key actors
- Editorial Constitution v1
- Framing: "Foundational Sample Set (2023-2026)" — curating for epistemic movement, not coverage

### Phase 2: Build Site (Weeks 4-5)
- Astro static site with layered reading modes (Reader/Analyst/Auditor)
- Canonical synthesis computation
- CI validation pipeline (schema + links)
- Pagefind search
- RSS feed

### Phase 3: Launch (Week 6)
- GitHub repo public
- Ship to HN, Reddit r/MachineLearning, Twitter/X
- Recruit 3-5 editorial board members from community response
- Recruit thread co-curators — specifically people who **disagree** with initial interpretations

### Year 1 Funding
- Grants (AI governance, digital humanities, epistemology)
- Individual sponsors (Patreon-style, no editorial perks)

### Year 2+
- Institutional sponsorships with hard firewall from editorial decisions
- Paid quarterly synthesis reports (clearly labeled as editorial products)

---

## 10. Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **Epistemic UX collapse** (too rigorous to be usable) | Dual-layer architecture: canonical view first, ledger underneath. Three reading modes. "Answer first, structure second." |
| **Schema friction** (contributors can't master ontology) | Progressive formalization: Tier 0 is just claim + source. Editors enrich. Full schema available but never required for contribution. |
| **Narrative cowardice** (softening disagreement) | Contestability built in — challenge windows, formal contestation workflow, all resolutions public. |
| **Fake dissent** (forcing disagreement where none exists) | Contestability, not compulsory dissent. "Uncontested" is a valid, honest state. |
| **Editor burnout** | Single-curator threads. AI assists on research, not judgment. Progressive tiers distribute work. |
| **Legal exposure** | Tight sourcing. Claims attributed, not asserted. State machine makes event lifecycle explicit. |
| **US-centric bias** | `regions` field. Actively recruit non-US contributors. Editorial dashboard tracks geographic coverage gaps. |
| **AI hallucinations in drafts** | Global AI assistance disclosure. Human editor reviews all factual claims. Labeled clearly. |
| **Completeness anxiety** | Framed as curating for depth, not coverage. "This project grows by reinterpretation depth, not event count." |
| **Contributor quality collapse** | Tiered contribution model. Low barrier (Tier 0 issue forms) but editorial gate (Tier 1-2). |

---

## 11. Canon Formation Policy

The canonical layer requires explicit governance to prevent it from becoming either a wiki-like free-for-all or a bottleneck controlled by a small editorial class.

### Canon Entry Lifecycle

```yaml
# A canonical synthesis for a thread or topic
canon_entry:
  id: canon-ai-military-2026-q1
  scope: thread/ai-military-ethics          # what this canon covers
  version: 2
  status: ratified                          # proposed | ratified | deprecated | superseded | forked
  synthesis_text: "..."                     # the canonical narrative
  supporting_claims: [claim-1, claim-2]
  dissenting_claims: [claim-3]
  proposer: terry-tang
  ratified_by: [editor-1, editor-2]
  ratified_at: 2026-04-01
  supersedes: canon-ai-military-2025-q4     # previous version
  fork_group: null                          # non-null if competing syntheses exist
```

### Canon Decision Record

Every canonical change requires a formal decision:

```yaml
canon_decision:
  id: cd-2026-04-01-military
  canon_entry_id: canon-ai-military-2026-q1
  decision_type: ratify                     # ratify | reject | deprecate | supersede | fork
  trigger: new_evidence                     # new_evidence | challenge_upheld | periodic_review | scope_split
  authority: 2_of_3_reviewers              # single_editor | 2_of_3_reviewers | panel_majority
  rationale: "Anthropic DoD refusal materially changed the landscape..."
  decided_by: [editor-1, editor-2]
  created_at: 2026-04-01
```

### Rules

- **Ratification:** A `canon_entry` reaches `ratified` status only with `2_of_3_reviewers` minimum sign-off
- **Supersession:** A ratified canon can be superseded only if at least one supporting claim changed to `retracted` | `superseded` | `materially_challenged`, or a new claim with stronger evidence was accepted
- **Competing syntheses:** Allowed via `status: forked` with shared `fork_group` ID; each fork must declare scope distinction or unresolved methodological disagreement
- **Escalation:** Challenge to canon → review queue → reviewer triage → editorial panel if disagreement persists >14 days
- **Update SLA:** Canon must be re-evaluated within 30 days of a landmark event being added to its scope
- **Required for launch:** Every thread above `major` significance must have a ratified canon

---

## 12. Epistemic Status Model

A single status field is insufficient for a system that claims epistemic rigor. The Ledger uses an **orthogonal status model** with 6 independent dimensions:

```yaml
claim_status:
  publication: published                    # draft | published | withdrawn
  contestation: challenged                  # unchallenged | challenged | disputed | resolved
  evidence: corroborated                    # unsupported | single_source | corroborated | strongly_corroborated
  editorial: editorially_accepted           # unreviewed | editorially_accepted | editorially_rejected
  consensus: emerging_consensus             # no_position | emerging_consensus | consensus | minority_view
  temporal: current                         # current | superseded | retracted
```

### Key semantic rules

- `unchallenged` MUST NOT imply `corroborated` — absence of objection ≠ validation
- `consensus` requires ≥3 independent sources + editorial acceptance + no unresolved material challenge
- `superseded` means "historically recorded but no longer preferred reading"
- `retracted` means "affirmatively invalid due to correction, fabrication, or error"
- `corroborated` requires ≥2 independent sources of type `primary_document` | `primary_recording` | `secondary_reporting`
- Each dimension can be queried independently in the Explorer (e.g., "show me all claims that are `challenged` + `single_source`")

### Display in UI

- **Reader view:** Simplified badge (e.g., "Contested", "Established", "Superseded")
- **Analyst view:** Full 6-dimension breakdown
- **Auditor view:** Status change history with timestamps and decision links

---

## 13. Source & Evidence Typing

### Source Schema

```yaml
source:
  id: src-nyt-anthropic-dod-2026
  title: "Anthropic Declines Pentagon AI Contract"
  source_type: secondary_reporting
  # Types: primary_document | primary_recording | primary_dataset |
  #        secondary_reporting | expert_interpretation | editorial_synthesis |
  #        hearsay_unverified | retraction | correction
  publisher: New York Times
  author: Jane Doe
  published_at: 2026-03-01
  url: https://...
  archive_url: https://web.archive.org/...
  accessed_at: 2026-03-03
  independence_group: nyt-coverage          # sources in same group aren't independently corroborating
```

### Claim-Evidence Link

```yaml
claim_evidence:
  claim_id: claim-anthropic-refused-dod
  source_id: src-nyt-anthropic-dod-2026
  relation: supports                        # supports | contradicts | contextualizes | retracts | corrects
  excerpt: "Anthropic CEO confirmed in a memo..."
  confidence_weight: 2                      # 0 (weak) to 3 (definitive)
  directness: direct                        # direct | indirect
```

### Evidence Policy

- `editorial_synthesis` cannot be sole support for a factual claim
- `hearsay_unverified` cannot elevate evidentiary state above `single_source`
- `retraction` | `correction` sources automatically trigger review of all linked claims
- Sources sharing an `independence_group` count as one source for corroboration purposes

---

## 14. Revision Artifacts (Replacing Monolithic Retrospectives)

The original "Retrospective" concept carried too many semantic loads. It is now split into **4 distinct artifacts**, each with a single purpose:

### 14.1 Challenge Case

Formal contestation of a specific claim. Creates a procedural record.

```yaml
challenge_case:
  id: cc-scaling-laws-2026
  target_claim_id: claim-scaling-saturating
  allegations:
    - unsupported_inference
    - context_omission
  # Allegation types: misquote | context_omission | overstatement |
  #   unsupported_inference | category_error | source_misattribution |
  #   timeline_error | duplication
  status: under_review                     # open | under_review | sustained | dismissed | partially_sustained
  opened_at: 2026-04-10
  opened_by: contributor-1
  resolution_note_id: null                  # linked when resolved
```

### 14.2 Summary Revision

Versioned update to a canonical summary when underlying claims change.

```yaml
summary_revision:
  id: sr-scaling-2026-04
  target_summary_id: canon-scaling-laws-2025-q4
  prior_version: "We believed scaling laws were saturating..."
  new_version: "Post-2025 compute efficiency gains invalidated..."
  reason: "New evidence from efficiency research"
  changed_claim_ids: [claim-scaling-saturating]
  triggered_by_case_id: cc-scaling-laws-2026
  author: terry-tang
  created_at: 2026-04-15
```

### 14.3 Interpretive Memo

Reflective analysis about framing, uncertainty, or competing readings. NOT a factual correction — captures interpretation.

```yaml
interpretive_memo:
  id: im-scaling-framing-2026
  subject: { kind: claim, id: claim-scaling-saturating }
  # subject kinds: claim | summary | case | source | topic
  thesis: "The 'scaling plateau' narrative was shaped by incentive structures as much as evidence"
  stance: interpretive                      # interpretive | methodological | skeptical | comparative
  confidence: medium
  related_claims: [claim-scaling-saturating, claim-efficiency-gains]
  related_sources: [src-epoch-compute-2025]
  supersedes_memo: null
  author: terry-tang
  created_at: 2026-05-01
```

### 14.4 Resolution Note

Formal disposition of a challenge case. Records what changed in the ledger.

```yaml
resolution_note:
  id: rn-scaling-2026
  case_id: cc-scaling-laws-2026
  disposition: sustained                    # upheld | rejected | mixed | deferred
  findings:
    - "Original claim overweighted a single compute trend study"
    - "Subsequent evidence from 3 independent sources contradicts the plateau thesis"
  actions:
    - type: claim_status_changed
      claim_id: claim-scaling-saturating
      from: { temporal: current }
      to: { temporal: superseded }
    - type: summary_revision_created
      summary_revision_id: sr-scaling-2026-04
    - type: interpretive_memo_attached
      memo_id: im-scaling-framing-2026
  decided_by: [editor-1, editor-2]
  issued_at: 2026-04-20
```

### Why 4 artifacts instead of 1

| Artifact | Purpose | Semantic function |
|----------|---------|-------------------|
| **Challenge Case** | Accusation / contestation | Dispute |
| **Summary Revision** | Textual change to synthesis | Revision |
| **Interpretive Memo** | Reflective analysis or framing note | Interpretation |
| **Resolution Note** | Official decision and action log | Judgment |

These are fundamentally different acts. Collapsing them into one "retrospective" object obscures whether the system is disputing, revising, interpreting, or adjudicating — which is exactly the kind of ambiguity an epistemic system must avoid.

---

## 15. Updated Directory Structure

```
the-ledger/
├── content/
│   ├── events/                            # immutable event records
│   ├── threads/                           # narrative arcs
│   ├── controversies/                     # multi-axis disagreements
│   ├── syntheses/                         # ratified canonical syntheses
│   ├── challenges/                        # challenge cases
│   ├── revisions/                         # summary revisions
│   ├── memos/                             # interpretive memos
│   ├── resolutions/                       # resolution notes
│   ├── perspectives/                      # quarterly/thematic essays
│   └── actors/                            # actor registry
├── editorial/
│   ├── constitution.md
│   ├── canon-formation-policy.md          # NEW
│   ├── epistemic-status-guide.md          # NEW
│   ├── evidence-standards.md              # NEW
│   ├── review-process.md
│   ├── confidence-guidelines.md
│   ├── style-guide.md
│   └── ai-assistance.md
├── schema/
│   ├── event.schema.json
│   ├── thread.schema.json
│   ├── controversy.schema.json
│   ├── synthesis.schema.json              # canon entry
│   ├── challenge.schema.json              # NEW
│   ├── revision.schema.json              # NEW
│   ├── memo.schema.json                   # NEW
│   ├── resolution.schema.json            # NEW
│   ├── source.schema.json                # NEW
│   ├── claim-status.schema.json          # NEW
│   └── actor.schema.json
└── ...
```

---

## 16. Review History

### GPT-5.2 (4 Rounds) — Grade: A
- Established core architecture: events, threads, controversies, retrospectives
- Named the project "The Ledger"
- Key contributions: actor registry, source typing, 72-hour rule, significance tracking, thread pluralism, Editorial Constitution
- Key rule: "If the site ever feels reasonable instead of alive, you've lost"
- Full transcript: `GPT52-REVIEW.md`

### GPT-5.4-pro (3 Rounds) — Initial Grade: B-
- Challenged 5.2's assumptions on three axes:
  1. Schema complexity → **Progressive formalization** (3 primitives + extensions)
  2. Immutability UX → **Dual-layer representation** (canonical + ledger)
  3. Mandatory disagreement → **Contestability, not compulsory dissent**
- Identified "epistemic UX collapse" as the non-obvious death mode
- Key insight: "The institution is not the log; it is the editorial process that turns the log into public knowledge"
- Analogy: Wikidata + Wikipedia + Git — hide complexity behind editorial surfaces
- Full transcript: `GPT54-REVIEW.md`

### GPT-5.4-pro Rounds 4-6 — A- → A
- Canon formation policy: CanonEntry lifecycle + CanonDecision records + ratification rules
- Orthogonal epistemic status model: 6-dimension ClaimStatus replacing single status field
- Typed source model: Source schema with 9 types + ClaimEvidence links with relation/confidence/directness
- Split retrospectives into 4 artifacts: ChallengeCase (dispute), SummaryRevision (revision), InterpretiveMemo (interpretation), ResolutionNote (judgment)
- Confirmed: all 4 fixes implemented → **grade: A**

### Synthesis
The best version of The Ledger is: **immutable, contestable, synthesis-first, and progressively formalized.** 5.2 was more right about the soul of the product. 5.4 was more right about the operating model needed to make it usable.

---

*Document compiled March 8, 2026. Architecture v3 — final, incorporating GPT-5.2 + GPT-5.4-pro synthesis. Grade: A.*
