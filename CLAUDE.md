# CLAUDE.md

Open-source epistemic ledger of AI history -- tracks events, threads, controversies, and retrospective reinterpretations with immutable records and contestable claims.

## Quick Start

```bash
# Root-level tools (validation, feeds, graph)
npm install              # Node >= 22
npm run validate         # Schema + cross-reference validation
npm run build-graph      # Generates graph.json
npm run generate-feed    # Generates feed.xml + rss.xml
npm run check-links      # Checks for broken source URLs

# Site (Astro dev server)
cd site
npm install
npm run dev              # Local dev server
npm run build            # Static build -> site/dist/
npm run preview          # Preview production build
```

## Project Structure

```
the-ledger/
  content/               # All content lives here (source of truth)
    events/              # 59 events in year subdirs (2023/, 2024/, 2025/, 2026/)
    threads/             # 4 narrative threads (.md with YAML frontmatter)
    controversies/       # 5 multi-axis controversies (.md with YAML frontmatter)
    actors/              # 20 actors (.yml files)
    challenges/          # Formal challenges to claims
    memos/               # Editorial memos
    perspectives/        # Perspective essays
    resolutions/         # Challenge resolutions
    revisions/           # Summary revisions
    syntheses/           # Signed canonical syntheses
  schema/                # JSON Schema definitions (draft-07)
  scripts/               # TypeScript tooling (validate, build-graph, check-links, generate-feed)
  editorial/             # Constitution, style guide, evidence standards, AI assistance policy
  site/                  # Astro site (separate package.json)
    src/
      components/        # React (.tsx) + Astro (.astro) components
      layouts/           # Base.astro layout
      lib/content.ts     # Content loader -- reads from ../content/
      pages/             # Route pages (index, explore, about, events/[id], threads/, controversies/)
      styles/            # global.css
    tailwind.config.mjs  # Tailwind config with custom theme
    astro.config.mjs     # Astro + React + Tailwind integrations
  .github/workflows/     # CI: validate.yml, deploy.yml, stale-sources.yml
```

## Stack

- **Site:** Astro 5 + React 19 + Tailwind 3, static output
- **Content:** Markdown with YAML frontmatter (events, threads, controversies) + plain YAML (actors)
- **Tooling:** TypeScript scripts via tsx, schema validation via ajv
- **Fonts:** Inter (sans), JetBrains Mono (mono)
- **License:** CC-BY-SA-4.0

## Content Schema

All schemas are in `schema/`. Validation runs via `npm run validate`.

### Event (`content/events/{year}/{nn}-slug.md`)
Required frontmatter: `id`, `title`, `date`, `category`, `sources`
- **id:** kebab-case, unique (`^[a-z0-9][a-z0-9-]*[a-z0-9]$`)
- **date:** ISO 8601 (YYYY-MM-DD)
- **category:** `policy` | `models` | `research` | `industry` | `safety` | `culture` | `open-source`
- **sources:** Array, min 1. Each needs `url` + `title`. Optional: `type`, `publisher`, `archive_url`, `date`, `accessed`
- Optional: `significance` (landmark/major/notable), `confidence` (high/medium/low/disputed), `contestation`, `actors` (array of {id, role}), `regions`, `tags`, `threads`, `related`, `significance_history`, `state`, `revision`
- Body sections: `## Summary`, `## What Happened`, `## Why It Matters`

### Thread (`content/threads/{slug}.md`)
Required: `id`, `title`, `status`, `started`, `core_question`, `curator`, `events`
- **status:** `active` | `dormant` (never "resolved" -- understanding always evolves)
- **events:** ordered array of event IDs

### Controversy (`content/controversies/{slug}.md`)
Required: `id`, `thread`, `status`, `polarity`, `positions`
- **polarity:** `binary` | `multi-axis`
- **positions:** min 2, each with `claim` + optional `proponents`, `sources`, `confidence`

### Actor (`content/actors/{slug}.yml`)
Required: `id`, `name`, `type`
- **type:** `company` | `government` | `research-lab` | `individual` | `organization`
- Pure YAML (no markdown body)

### Source (embedded in events/controversies)
Required: `url`, `title`
- **type:** `primary` | `secondary` | `commentary` | `official` | `primary_document` | `primary_recording` | `primary_dataset` | `secondary_reporting` | `expert_interpretation` | `editorial_synthesis` | `hearsay_unverified` | `retraction` | `correction`

## Architecture Principles

1. **Immutable events** -- no silent rewrites. Updates happen via retrospectives, revisions, and supersession. Git history is the audit trail.
2. **Dual-layer** -- Ledger layer (immutable append-only records) + Canonical layer (computed "current best understanding" shown to readers).
3. **Contestability, not compulsory dissent** -- every claim has a challenge window and contestation status, but "uncontested" is a valid state.
4. **Progressive formalization** -- Tier 0 (source + claim from anyone) -> Tier 1 (editor normalizes) -> Tier 2 (specialists enrich with threads, controversies, syntheses).
5. **Signed syntheses** -- thread syntheses have named curators responsible for maintenance.

## Design Context

### Users
Primary: AI-interested readers who want **history, not news** — researchers, journalists, policy people, engineers. They arrive curious and skeptical; they stay because the sourcing holds up. Context is deliberate reading, not doomscrolling. Long-read experience on mobile matters — syntheses run long. Job to be done: "show me what happened, who said what, when we were wrong, and how I can check the sources myself."

Secondary: contributors submitting source tips via GitHub. Provenance must be one click away; contribution obvious without schema knowledge.

### Brand Personality
**Archival, sober, precise.** Curator-led — Terry Tang is visibly responsible for the editorial framework, not an anonymous aggregator. Quiet authority; trust earned through rigor, never claimed through adjectives. Epistemically humble — "wrongness is a feature" (significance upgrades, contestation badges, belief-decay tracking are visible, not hidden). No hype, no marketing gloss. Should feel like a court record or research archive that happens to be beautifully typeset.

Emotional goals: **confidence** (sourcing is solid), **curiosity** (threads invite further reading), **responsibility** (the reader feels the weight of getting AI history right).

### Aesthetic Direction
**Editorial typography meets data journalism.** Stripe Press / Works in Progress rigor (generous whitespace, careful hierarchy, serif-mono interplay) combined with Pudding.cool / Observable information density (timelines, graphs, cross-references).

Locked in — do not redesign without cause:
- **Dark mode only.** Background `#0A0A0F`, surface `#111118`, text `#E8E4DF`.
- **Inter (sans) + JetBrains Mono (mono).** Mono is reserved for metadata: dates, counts, tags, IDs, categories. This contrast is a load-bearing pattern.
- **Category colors** are tokens, not decoration: policy=indigo, models=amber, research=emerald, industry=violet, safety=red, culture=pink, open-source=cyan. Always paired with text; never color-only.
- **Primary accent** is `category-policy` indigo (#6366F1) for links, CTAs, focus rings.
- All tokens live in `site/tailwind.config.mjs` under `ledger.*` and `category.*`.

Push toward: longer line lengths and more generous leading on bodies; subtle fade-in/slide-up animation only (no parallax, no scroll-hijacking); monospace metadata strips, thin 1px borders, understated hover states; dense-but-legible list layouts over card-heavy grids where scanning matters.

Anti-references — reject changes that make the site resemble any of these:
- **SaaS landing pages** — gradient heroes, product mocks, "Trusted by" logo walls, emoji value props.
- **Crypto / AI startup sites** — neon glows, animated gradients, glassmorphism, generated orbs.
- **Generic AI dashboards** — chatbot bubbles, sparkle icons, "Ask anything" inputs, "Powered by GPT" badges.

### Design Principles
1. **Evidence over polish.** Every claim-bearing element (event, thread, controversy) should feel sourced and inspectable. Provenance is a first-class UI concern.
2. **Rigor over excitement.** No hype typography, no hero gradients, no sparkles. If it would look at home on a research-paper preprint, it belongs here.
3. **Information density with breathing room.** Dense where density aids comprehension (timelines, metadata strips); spacious where reading fatigue matters (event bodies, thread syntheses).
4. **Designed to last a decade.** Favor timeless editorial patterns over trend-driven styling. A visitor in 2035 should read this as rigorous, not dated.
5. **Contestability is visible.** Significance level, confidence, contestation status, and revision history are core design elements — never afterthoughts.

### Accessibility Commitments
- **Respect `prefers-reduced-motion`.** Fade-ins, slide-ups, scroll-triggered animations must disable cleanly. Motion is never load-bearing for meaning.
- **Color-blind safe.** Category and status color is always paired with text labels.
- **Long-read optimized.** Target ~65ch measure on body copy, strong heading hierarchy, generous line-height on event/thread pages.
- **Keyboard + focus.** Visible focus-visible rings, logical tab order, no keyboard traps in Graph/Explore views.

## Deployment

- **Live:** https://the-ledger.net
- **CI:** Push/PR to `main` triggers `validate.yml` (schema validation + graph build). Push to `main` also triggers `deploy.yml` (build site + deploy to Vercel).
- **Stale sources:** Weekly cron checks for broken source URLs.
- **Branch protection:** PRs required for `main`, reviews enforced.

## Key Conventions

- Event files are numbered (`01-`, `02-`, ...) within year directories for ordering.
- The 72-hour rule: events can't be published until 72 hours after initial reporting.
- AI-assisted drafts must be marked with `draft_assistance: ai-assisted` in frontmatter.
- Commit messages: `Add event: ...`, `thread/...`, `editorial/...`, `fix/...`.
- Branch naming: `event/slug`, `thread/slug-update`, `editorial/change`, `fix/description`.
- Content loader (`site/src/lib/content.ts`) resolves content dir relative to `site/` via `path.join(process.cwd(), '..', 'content')`.
- Always run `npm run validate` before committing content changes.
