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

## Design

- Dark mode only. Background `#0A0A0F`, surface `#111118`, text `#E8E4DF`.
- Category colors: policy=indigo, models=amber, research=emerald, industry=violet, safety=red, culture=pink, open-source=cyan.
- All custom colors/fonts defined in `site/tailwind.config.mjs` under `ledger.*` and `category.*` tokens.

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
