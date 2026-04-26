# The Ledger

### *An epistemic ledger of AI history*

> "History is written by the present. We write it as it happens — then watch ourselves be wrong."

---

The AI field's history is being lost. It lives in tweets that get deleted, blog posts that get revised, press releases that get memory-holed, and corporate narratives that get rewritten after the fact. The most consequential technology of our era has no durable, structured, contestable historical record.

**The Ledger is that record.**

We don't aggregate news. We don't write encyclopedias. We build a **machine for watching collective understanding evolve** — tracking events, connecting them into narrative threads, preserving disagreement, and making "here's what we got wrong" a first-class feature.

## What Makes This Different

- **Not a news site.** We're archival, not breaking. The 72-hour rule means we don't publish hot takes.
- **Not Wikipedia.** We're chronological, narrative, and opinionated about significance — with transparent provenance underneath.
- **Not a newsletter.** We're structured data, open source, and curator-led.
- **Not Twitter.** We're curated, permanent, and evolving.

## Core Architecture

### Dual-Layer Representation

The Ledger has two layers over the same data:

1. **Canonical Layer** (what readers see) — The "current best understanding" of each event, thread, and controversy. Legible, citable, periodically reviewed narratives.

2. **Ledger Layer** (what powers it) — Immutable, append-only event history. All assertions, disagreements, and revisions preserved. No silent rewriting. Git is the audit trail.

### What We Track

📅 **Events** — Sourced, dated records of what happened in AI. Each with significance ratings, confidence levels, and contestation status.

🧵 **Threads** — Narrative arcs connecting events into larger stories: *The Scaling Laws Debate*, *Open vs. Closed Weights*, *The AI Copyright Wars*, *AI and the Military-Industrial Complex*.

⚡ **Controversies** — Structured multi-axis disagreements where credible positions are documented, not adjudicated.

🔄 **Significance + Contestation tracking** — The "wrongness" feature. Every event carries a significance level (landmark/major/notable) that can be upgraded as understanding shifts, plus a contestation status that surfaces ongoing disagreement.

## Current Content

Live counts are visible at the top of [the homepage](https://the-ledger.net). At launch, the seed dataset spans:

- Events from 2023-2026, covering model releases, policy developments, governance crises, and geopolitical shifts
- An actor registry of companies, governments, research labs, and key individuals
- Narrative threads with canonical syntheses, competing interpretations, and open questions
- Structured controversies with multi-axis positions and evidence
- A full editorial framework: constitution, evidence standards, style guide, AI assistance policy

## Editorial Constitution

Nine non-negotiable principles govern The Ledger:

1. **No Silent Rewrites** — Events are immutable. Updates happen via significance history, revisions, and supersession.
2. **Contestability by Default** — Every claim has a challenge window.
3. **Claims ≠ Facts** — Claims are attributed, dated, and contestable.
4. **Time Awareness** — Wrongness is a feature. We track belief decay.
5. **AI Transparency** — AI tools disclosed. Human editors review all content.
6. **Source Primacy** — Primary sources over commentary. Archived URLs required.
7. **Pluralism** — Minority views documented, not deleted.
8. **Bias Disclosure** — Affiliations with relevant actors must be disclosed.
9. **Canon over Log** — Readers see synthesis first. Provenance is one click away.

Full editorial constitution: [`editorial/constitution.md`](editorial/constitution.md)

## Contributing

The Ledger uses a progressive contribution model:

| Tier | Who | What |
|------|-----|------|
| **Tier 0** | Anyone | Submit a claim + source via GitHub Issue |
| **Tier 1** | Editors | Normalize submissions into full events |
| **Tier 2** | Trusted contributors | Add thread connections, controversies, syntheses |
| **Tier 3** | Editorial board | Constitution changes, schema evolution |

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## Project Structure

```
the-ledger/
├── content/
│   ├── events/          # Immutable event records (by year)
│   ├── threads/         # Narrative arcs with embedded syntheses
│   ├── controversies/   # Multi-axis disagreements
│   ├── actors/          # Actor registry (YAML)
│   ├── challenges/      # Formal challenges to claims (scaffolded)
│   ├── memos/           # Editorial memos (scaffolded)
│   ├── perspectives/    # Quarterly/thematic essays (scaffolded)
│   └── syntheses/       # Standalone canonical syntheses (scaffolded; threads currently embed their own)
├── editorial/           # Constitution, policies, style guide
├── schema/              # JSON Schema definitions
└── scripts/             # Validation and build tools
```

## License

All content is licensed under [CC BY-SA 4.0](LICENSE). Attribution required. Share-alike.

## Philosophy

The most interesting thing about history isn't what happened — it's how our understanding of what happened changes over time. The Ledger exists to make that evolution visible, structured, and honest.

If the site ever feels reasonable instead of alive, we've lost.

## About

Curated by [Terry Tang](https://terrytang.dev) under the [Editorial Constitution](editorial/constitution.md). All editorial decisions, source selections, and significance ratings follow its principles.

The Ledger is **curator-led** at launch. The four-tier contribution model (see [CONTRIBUTING.md](CONTRIBUTING.md)) is real but, in practice, only Tier 0 (issue-based source tips) and Tier 1 (curator-normalized events) are active. Tier 2 (trusted contributors) and Tier 3 (editorial board) are roadmap — they activate as the project finds collaborators who want to commit to its standards.

Every edit is tracked in git. There are no private channels for content changes. If you spot a missing event, a stale source, or a position that's been dropped from a controversy: open an issue.

---

*Founded March 2026.*
