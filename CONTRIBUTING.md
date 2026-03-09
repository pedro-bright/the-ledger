# Contributing to The Ledger

Thank you for your interest in contributing to The Ledger. This guide explains how contributions work, from casual submissions to deep editorial involvement.

## Contribution Philosophy

The Ledger uses **progressive formalization** — you don't need to master the full data model to contribute. Start simple. Editors enrich over time.

## Contribution Tiers

### Tier 0: Anyone Can Submit

**What:** Submit a claim and a source.

**How:** Open a [GitHub Issue](../../issues/new) using the "New Event" template.

**What to include:**
- What happened (1-3 sentences)
- When it happened (specific date)
- A link to a source

**What you don't need:**
- Knowledge of our schema
- Frontmatter formatting
- Significance ratings or thread connections
- An account beyond GitHub

**What happens next:** An editor picks up your submission, verifies the source, and normalizes it into a full event file. You'll be credited in the event metadata.

**The 72-hour rule:** Events can't be published until 72 hours after initial reporting. This prevents hot-take history. You can submit immediately; publication will wait.

---

### Tier 1: Event Normalization (Editors)

**What:** Convert Tier 0 submissions into full event files with proper frontmatter.

**Requirements:**
- Familiarity with the [event schema](ARCHITECTURE.md#events-kernel-schema)
- Ability to write clear, sourced prose
- 1 reviewer sign-off required

**Process:**
1. Pick up an unprocessed submission from Issues
2. Verify sources and research additional context
3. Write the event file (Summary, What Happened, Why It Matters)
4. Add kernel frontmatter: `id`, `title`, `date`, `category`, `sources`
5. Submit a PR

**AI assistance:** If you use AI tools to draft content, mark the event with `draft_assistance: ai-assisted` in the frontmatter. This is not a judgment — it's a disclosure. See [editorial/ai-assistance.md](editorial/ai-assistance.md).

**Quality checklist:**
- [ ] Summary is self-contained (could be read alone)
- [ ] All factual claims have sources
- [ ] Analysis is labeled and separated from reporting
- [ ] Dates are specific and verified
- [ ] At least one source is primary or official

---

### Tier 2: Enrichment (Trusted Contributors)

**What:** Add depth and connections to events. Create and update threads, controversies, and syntheses.

**Requirements:**
- Track record of quality Tier 1 contributions
- 2 reviewer sign-offs required
- Named authorship for syntheses

**Activities:**
- Add enriched frontmatter: `significance`, `confidence`, `actors`, `regions`, `tags`, `threads`
- Create or update thread narratives and canonical syntheses
- Write controversy structures with multi-axis positions
- Draft retrospective reinterpretations when understanding changes
- Connect events to threads and other events

**Thread curation:** Each active thread has a named curator responsible for maintaining the canonical synthesis. Curators are responsible for updating the synthesis when significant events are added to the thread (within 30 days for landmark events, 60 days for major events).

---

### Tier 3: Editorial (Board)

**What:** Governance, constitution changes, and schema evolution.

**Requirements:**
- Appointment to the editorial board (3-5 rotating members, 6-month terms)
- RFC process for structural changes

**Activities:**
- Review and approve constitutional amendments
- Resolve escalated challenges and disputes
- Set editorial policy
- Conduct quarterly significance reviews
- Approve schema changes

---

## Pull Request Guidelines

### Commit Messages

Use descriptive commit messages that explain *what* and *why*:

```
Add event: OpenAI releases GPT-4 (March 2023)

Landmark model release. Includes multimodal capabilities, benchmark
results, and analysis of opacity decision.
```

### Branch Naming

```
event/gpt-4-release
thread/scaling-laws-update
editorial/constitution-v2
fix/typo-in-claude-3-event
```

### Review Process

- **Tier 1 PRs:** 1 reviewer required
- **Tier 2 PRs:** 2 reviewers required
- **Tier 3 PRs (editorial changes):** Full board review + 30-day RFC

### What Reviewers Check

1. **Factual accuracy:** Are claims supported by sources?
2. **Source quality:** Are sources typed correctly? Are primary sources archived?
3. **Prose quality:** Is it clear, precise, and consistent with our [style guide](editorial/style-guide.md)?
4. **Schema compliance:** Is the frontmatter complete and valid?
5. **Neutrality of reporting / transparency of analysis:** Are factual claims separated from interpretation? Is analysis attributed?

---

## Challenging Existing Content

**Anyone** can challenge a published claim at any time.

### How to File a Challenge

1. Open a GitHub Issue using the "Challenge" template
2. Specify the claim you're challenging
3. Provide your basis: `misquote` | `context_omission` | `overstatement` | `unsupported_inference` | `source_misattribution` | `timeline_error`
4. Include sources supporting your challenge

### What Happens

1. The claim moves to `challenged` status
2. An editor reviews the challenge
3. Possible outcomes:
   - **Sustained:** The claim is revised via a formal summary revision
   - **Dismissed:** The challenge is rejected with stated reasoning
   - **Partially sustained:** Some aspects are revised
4. All resolutions are public and recorded

---

## Code of Conduct

- **Argue positions, not people.** Challenge claims, not contributors.
- **Disclose conflicts.** If you work at, invest in, or are otherwise affiliated with a relevant actor, say so.
- **Accept reversals gracefully.** Your contribution may be revised or superseded. This is the system working, not a personal attack.
- **Contribute in good faith.** The Ledger exists to track understanding honestly. Deliberate misinformation, spam, or agenda-driven distortion will result in removal.

---

## Getting Started

1. **Read a few events** to understand the style and structure
2. **Browse open issues** for submissions that need normalization
3. **Pick something you know about** and contribute what you can
4. **Don't worry about being perfect** — editors are here to help

The best contributions often come from people who know a specific event or topic deeply and can add context, nuance, or sources that aren't widely known. If you were there when it happened, or you covered it as a journalist, or you researched it as a scholar — your contribution is especially valuable.

---

*Questions? Open a Discussion on GitHub or reach out to the editorial team.*
