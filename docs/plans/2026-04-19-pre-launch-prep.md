# Pre-Launch Prep Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to dispatch this plan task-by-task.

**Goal:** Get The Ledger ready for a public launch under a hybrid framing — curator-led with Tier-0 source contributions welcome, honest about current state, with the missing epistemic UX surfaces shipped.

**Architecture:** Six independent UX/copy tasks, parallel-safe (touch different files). One repo branch (`pre-launch-prep`), each subagent writes files but does NOT commit; orchestrator commits in batches after validation.

**Tech Stack:** Astro 5 + React 19 + Tailwind 3, content from YAML/Markdown, JSON Schema validation, static-output build. Existing components: `ContestationBadge`, `ConfidenceBadge`, `SignificanceHistory`, `EventCard`, `Timeline`, `Explorer`, `FilterBar`, `SEO`.

**Verification command for all tasks:** `cd site && npm run build` must succeed; `npm run validate` (from root) must pass.

---

## Strategic decisions baked into this plan

1. **Hybrid framing.** Drop "we" / "community-maintained" as primary. Reposition as "curated by Terry Tang, with public source-tip contributions welcome." Path to community contribution is real but explicit as roadmap, not present-tense reality.
2. **Empty content-type dirs stay.** Threads embed their syntheses in markdown body — `content/syntheses/` doesn't need population. Other empty dirs (`challenges/`, `memos/`, `perspectives/`, `resolutions/`, `revisions/`) are honest "future content types" — they get acknowledged on About as roadmap, not pretended-to-exist.
3. **Don't claim retrospectives.** `content/retrospectives/` doesn't exist as a dir. Stop referring to it in README/About; replace with what we actually have (significance_history, contestation status).
4. **Graph visualization ships.** The data exists (`graph.json`); the wow-feature should not be hidden.
5. **Actors get first-class pages.** 20 are defined and linkable but currently dead-ended into search filters.

---

## Task structure & dispatch order

Six tasks, dispatched in **one parallel wave** (all independent — touch different files):

| # | Task | Files Touched | Subagent Focus |
|---|------|---------------|----------------|
| 1 | Reframe public copy | `README.md`, `site/src/pages/index.astro`, `site/src/pages/about.astro` | Copy / framing |
| 2 | Polish event detail page | `site/src/pages/events/[...id].astro`, `site/src/components/ConfidenceBadge.tsx` | UX micro-polish |
| 3 | Build actor pages | `site/src/pages/actors/index.astro` (new), `site/src/pages/actors/[...id].astro` (new), `site/src/layouts/Base.astro` (nav) | New pages |
| 4 | Enhance Explore page | `site/src/components/Explorer.tsx`, `site/src/components/FilterBar.tsx`, `site/src/pages/explore.astro` | Filtering UX |
| 5 | Build graph visualization | `site/src/pages/graph.astro` (new), `site/src/components/Graph.tsx` (new), `site/public/graph.json` (copied at build), `site/src/layouts/Base.astro` (nav) | Data viz |
| 6 | Tier-0 source-tip template + Contribute polish | `.github/ISSUE_TEMPLATE/source-tip.yml` (new), `CONTRIBUTING.md` (light edit) | Contribution surface |

After all six return, orchestrator runs `validate` + `build`, fixes any cross-task conflicts, commits in logical groups, opens PR.

---

## Task 1: Reframe public copy

**Goal:** Honest curator-led framing; remove dissonance between stated scope and shipped reality.

**Files:**
- Modify: `README.md`
- Modify: `site/src/pages/index.astro` (only the Contribute CTA section, ~lines 222-255)
- Modify: `site/src/pages/about.astro`

**Context the subagent needs:**
- Curator: Terry Tang (GitHub: `terrytangyin`)
- Repo: `https://github.com/pedro-bright/the-ledger` (verified from `git remote -v`)
- Current README claims "50 events" (live count is 59), mentions `content/retrospectives/` (does not exist), positions project as "community-maintained" (it has one curator).
- About page (`about.astro:103`) has a broken link to `https://github.com/terrytang/the-ledger/blob/main/CONTRIBUTING.md` — this URL is wrong; should be `pedro-bright/the-ledger`.
- About page lists "Retrospectives" as a content type but no retrospectives exist; the "wrongness" feature is implemented via `significance_history` and `contestation` fields on events instead.

**Step 1: README.md edits**

Change lines 42-50 (the "Current Content" section) to remove specific counts and reframe as illustrative:

```markdown
## Current Content

Live counts are visible at the top of [the homepage](https://the-ledger.dev). At launch, the seed dataset spans:

- Events from 2023-2026, covering model releases, policy developments, governance crises, and geopolitical shifts
- An actor registry of companies, governments, research labs, and key individuals
- Narrative threads with canonical syntheses, competing interpretations, and open questions
- Structured controversies with multi-axis positions and evidence
- A full editorial framework: constitution, evidence standards, style guide, AI assistance policy
```

Change lines 83-96 (the project structure tree) to remove `retrospectives/` (doesn't exist) and clarify which dirs are populated vs scaffolded:

```markdown
## Project Structure

\`\`\`
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
\`\`\`
```

Change lines 108-114 (the "About" section) to be honest about curator model:

```markdown
## About

Curated by [Terry Tang](https://github.com/terrytangyin) under the [Editorial Constitution](editorial/constitution.md). All editorial decisions, source selections, and significance ratings follow its principles.

The Ledger is **curator-led** at launch. The four-tier contribution model (see [CONTRIBUTING.md](CONTRIBUTING.md)) is real but, in practice, only Tier 0 (issue-based source tips) and Tier 1 (curator-normalized events) are active. Tier 2 (trusted contributors) and Tier 3 (editorial board) are roadmap — they activate as the project finds collaborators who want to commit to its standards.

Every edit is tracked in git. There are no private channels for content changes. If you spot a missing event, a stale source, or a position that's been dropped from a controversy: open an issue.
```

**Step 2: index.astro Contribute CTA edits**

Replace the current CTA block (lines 222-255) with the more honest version. Keep the same visual structure — only change the copy:

```astro
  <!-- Contribute CTA Band -->
  <section class="border-t border-ledger-border bg-ledger-surface/30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-3">
          Spot something missing? Tell us.
        </h2>
        <p class="text-ledger-text-muted mb-6">
          The Ledger is curator-led and open-source. The fastest way to help: drop a source link via a GitHub issue. No schema knowledge required — the curator turns it into a structured event.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://github.com/pedro-bright/the-ledger/issues/new?template=source-tip.yml"
            target="_blank"
            rel="noopener noreferrer"
            class="px-5 py-2.5 text-sm font-medium text-white bg-category-policy rounded-lg hover:bg-category-policy/80 transition-colors inline-flex items-center gap-2"
          >
            Submit a source tip
          </a>
          <a
            href="https://github.com/pedro-bright/the-ledger"
            target="_blank"
            rel="noopener noreferrer"
            class="px-5 py-2.5 text-sm font-medium text-white bg-ledger-surface border border-ledger-border-light rounded-lg hover:bg-ledger-border transition-colors inline-flex items-center gap-2"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
```

(The `source-tip.yml` template is created by Task 6. The link will 404 until that ships — coordinate via the orchestrator's batched commit.)

**Step 3: about.astro edits**

a) Remove "Retrospectives" from the Content Types list (lines 75-80) — replace bullet 4 with:

```astro
        <li><strong>Significance + Contestation tracking</strong> — Every event carries a significance level (landmark/major/notable) that can be upgraded as understanding shifts, plus a contestation status that surfaces ongoing disagreement.</li>
```

b) Replace the "How to Contribute" section (lines 93-105) with honest current-state:

```astro
      <h2>How to Contribute</h2>
      <p>
        The Ledger is curator-led at launch. The contribution model is tiered:
      </p>
      <ul>
        <li><strong>Tier 0 — Active.</strong> Anyone can drop a source + claim via a <a href="https://github.com/pedro-bright/the-ledger/issues/new?template=source-tip.yml">GitHub issue</a>. The curator turns it into a structured event. This is the highest-leverage way to help.</li>
        <li><strong>Tier 1 — Active.</strong> The curator normalizes submissions, writes summaries, attaches sources, and assigns significance.</li>
        <li><strong>Tier 2 — Roadmap.</strong> Trusted contributors will eventually add thread connections, controversy positions, and signed syntheses. Activates once 2-3 collaborators are committed to the editorial standards.</li>
        <li><strong>Tier 3 — Roadmap.</strong> An editorial board (3-5 rotating members) governs constitution and schema changes. Activates as the project scales.</li>
      </ul>
      <p>
        See the <a href="https://github.com/pedro-bright/the-ledger/blob/main/CONTRIBUTING.md">Contributing Guide</a> for full process. <strong>Note:</strong> the broken link to <code>terrytang/the-ledger</code> in older versions is fixed — the canonical repo is <a href="https://github.com/pedro-bright/the-ledger">pedro-bright/the-ledger</a>.
      </p>
```

(Drop the parenthetical "broken link" note in the final version — it's just here so the subagent understands which link to update.)

c) Add a new section after "How to Contribute" — "Roadmap" — making the unbuilt machinery honest:

```astro
      <h2>Roadmap</h2>
      <p>
        The constitution describes content types that aren't yet active on the site:
      </p>
      <ul>
        <li><strong>Standalone syntheses</strong> — Currently each thread embeds its own canonical synthesis. Once threads outgrow that, syntheses will move to dedicated documents under <code>content/syntheses/</code>.</li>
        <li><strong>Formal challenges + resolutions</strong> — Schema and directories exist (<code>content/challenges/</code>, <code>content/resolutions/</code>); the workflow activates once the editorial board does.</li>
        <li><strong>Editorial memos</strong> — Public-facing notes on significant editorial decisions (significance upgrades, contestation outcomes).</li>
        <li><strong>Perspectives</strong> — Quarterly thematic essays.</li>
        <li><strong>Graph visualization deepening</strong> — The relationship graph ships at launch as force-directed view; planned filters: by year, by category, by actor degree.</li>
      </ul>
```

**Verification:**
```bash
cd site && npm run build
```
Expected: build succeeds. Visual check (orchestrator does this): homepage CTA reads new copy; about page no longer mentions "Retrospectives" as a content type; README has live-count language and accurate project structure.

**Do NOT commit.** Report back to orchestrator with file diffs.

---

## Task 2: Polish event detail page

**Goal:** Reduce noise (high-confidence badge), prepare actor links to point at new actor pages, soften developer-facing sidebar metadata.

**Files:**
- Modify: `site/src/pages/events/[...id].astro`
- Modify: `site/src/components/ConfidenceBadge.tsx`

**Context the subagent needs:**
- ConfidenceBadge is rendered unconditionally on the event detail page (line 85). UX feedback: when nearly every event shows "High," the badge becomes visual noise. Solution: hide when `confidence === 'high'` OR when undefined; only render for `medium`, `low`, `disputed`.
- Sidebar actor links currently point to `/explore?actor=${actor.id}` (line 193). Task 3 builds `/actors/${id}` pages — change link to that. (If Task 3 isn't done yet, the link will 404 momentarily; orchestrator commits the two together.)
- Sidebar Metadata block (lines 226-247) shows the raw event ID — UX feedback flags this as developer-facing. Hide the ID row entirely; keep state and regions.

**Step 1: ConfidenceBadge — early return for high/undefined**

Read `site/src/components/ConfidenceBadge.tsx`. Add an early return at the top of the component:

```tsx
if (!level || level === 'high') return null;
```

(Default expected behavior is "high" — only show the badge when something is unusual.)

**Step 2: Update event detail actor link**

In `site/src/pages/events/[...id].astro`, find the `<a href={`/explore?actor=${actor.id}`}` (line 193) and change to:

```astro
<a
  href={`/actors/${actor.id}`}
  class="..."
>
```

Keep the styling.

**Step 3: Hide raw ID from sidebar metadata**

In the Metadata `<dl>` (lines 230-247), remove the ID row (lines 231-234). Keep `state` and `regions`. If the resulting block has no rows, hide the whole block:

```astro
{(event.state || event.regions) && (
  <div class="p-4 rounded-lg border border-ledger-border bg-ledger-surface/30">
    <h3 class="text-xs font-mono uppercase tracking-wider text-ledger-text-dim mb-3">
      Metadata
    </h3>
    <dl class="space-y-2 text-sm">
      {event.state && (
        <div class="flex justify-between">
          <dt class="text-ledger-text-dim">State</dt>
          <dd class="font-mono text-xs capitalize text-ledger-text-muted">{event.state}</dd>
        </div>
      )}
      {event.regions && (
        <div class="flex justify-between">
          <dt class="text-ledger-text-dim">Regions</dt>
          <dd class="font-mono text-xs text-ledger-text-muted">{event.regions.join(', ')}</dd>
        </div>
      )}
    </dl>
  </div>
)}
```

**Verification:**
```bash
cd site && npm run build
```
Expected: build succeeds. Visual check: pick an event known to have `confidence: high` (most do) — badge no longer shown. Pick an event with actors — link goes to `/actors/openai` (will 404 until Task 3 lands; that's fine for now).

**Do NOT commit.** Report back.

---

## Task 3: Build actor pages

**Goal:** Make actors first-class. Currently 20 actors are defined but have no pages.

**Files:**
- Create: `site/src/pages/actors/index.astro`
- Create: `site/src/pages/actors/[...id].astro`
- Modify: `site/src/layouts/Base.astro` (add "Actors" to nav)

**Context the subagent needs:**
- `loadActors()` and `buildActorEventMap()` already exist in `site/src/lib/content.ts`.
- Actor types: `company | government | research-lab | individual | organization`.
- Actor YAML schema (see `content/actors/openai.yml`): `id`, `name`, `type`, `founded?`, `website?`, `aliases?`.
- Style: dark theme, matches existing pages. Look at `site/src/pages/threads/index.astro` for a reference list page.
- Category colors are not used for actors — pick a neutral accent (use `text-ledger-text` and `border-ledger-border-light`).

**Step 1: Create actors index page**

`site/src/pages/actors/index.astro` — lists all actors grouped by type, with event counts:

```astro
---
import Base from '../../layouts/Base.astro';
import { loadActors, loadEvents, buildActorEventMap } from '../../lib/content';

const actors = loadActors();
const events = loadEvents();
const actorEventMap = buildActorEventMap(events);

// Group by type
const grouped = actors.reduce<Record<string, typeof actors>>((acc, actor) => {
  const type = actor.type || 'organization';
  if (!acc[type]) acc[type] = [];
  acc[type].push(actor);
  return acc;
}, {});

// Sort each group by event count desc
for (const type in grouped) {
  grouped[type].sort((a, b) => (actorEventMap.get(b.id)?.length || 0) - (actorEventMap.get(a.id)?.length || 0));
}

const typeOrder = ['company', 'research-lab', 'government', 'individual', 'organization'];
const typeLabels: Record<string, string> = {
  company: 'Companies',
  'research-lab': 'Research Labs',
  government: 'Governments',
  individual: 'Individuals',
  organization: 'Organizations',
};
---

<Base title="Actors" description="Organizations, governments, research labs, and individuals shaping AI history.">
  <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <p class="text-xs font-mono uppercase tracking-[0.2em] text-ledger-text-dim mb-2">Actors</p>
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
        Who shapes AI history
      </h1>
      <p class="text-ledger-text-muted">
        {actors.length} actors across {Object.keys(grouped).length} types — companies, governments, research labs, and individuals tracked across events.
      </p>
    </div>

    {typeOrder.filter((t) => grouped[t]).map((type) => (
      <section class="mb-10">
        <h2 class="text-sm font-mono uppercase tracking-wider text-ledger-text-dim mb-4">
          {typeLabels[type] || type} <span class="text-ledger-text-dim/60">({grouped[type].length})</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {grouped[type].map((actor) => {
            const count = actorEventMap.get(actor.id)?.length || 0;
            return (
              <a
                href={`/actors/${actor.id}`}
                class="group block p-4 rounded-lg border border-ledger-border bg-ledger-surface/30 hover:bg-ledger-surface/60 hover:border-ledger-border-light transition-all"
              >
                <div class="flex items-start justify-between gap-3 mb-1">
                  <h3 class="text-sm font-semibold text-ledger-text group-hover:text-white transition-colors">
                    {actor.name}
                  </h3>
                  <span class="flex-shrink-0 text-xs font-mono text-ledger-text-dim">
                    {count} {count === 1 ? 'event' : 'events'}
                  </span>
                </div>
                {actor.founded && (
                  <p class="text-xs font-mono text-ledger-text-dim">Founded {actor.founded}</p>
                )}
              </a>
            );
          })}
        </div>
      </section>
    ))}
  </section>
</Base>
```

**Step 2: Create actor detail page**

`site/src/pages/actors/[...id].astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { loadActors, loadEvents, buildActorEventMap, getCategoryColor } from '../../lib/content';

export function getStaticPaths() {
  const actors = loadActors();
  return actors.map((actor) => ({
    params: { id: actor.id },
    props: { actor },
  }));
}

const { actor } = Astro.props;
const events = loadEvents();
const actorEventMap = buildActorEventMap(events);
const actorEvents = actorEventMap.get(actor.id) || [];

// Group events by year
const byYear = actorEvents.reduce<Record<number, typeof actorEvents>>((acc, evt) => {
  const year = new Date(evt.date).getFullYear();
  if (!acc[year]) acc[year] = [];
  acc[year].push(evt);
  return acc;
}, {});
const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

const typeLabels: Record<string, string> = {
  company: 'Company',
  'research-lab': 'Research Lab',
  government: 'Government',
  individual: 'Individual',
  organization: 'Organization',
};
---

<Base title={actor.name} description={`Events involving ${actor.name} in The Ledger.`}>
  <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="flex items-center gap-2 text-xs font-mono text-ledger-text-dim mb-6">
      <a href="/actors" class="hover:text-ledger-text transition-colors">Actors</a>
      <span>/</span>
      <span class="text-ledger-text-muted">{actor.name}</span>
    </nav>

    <header class="mb-10 pb-8 border-b border-ledger-border">
      <p class="text-xs font-mono uppercase tracking-[0.2em] text-ledger-text-dim mb-2">
        {typeLabels[actor.type] || actor.type}
      </p>
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-4">{actor.name}</h1>

      <dl class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {actor.founded && (
          <div class="flex items-baseline gap-2">
            <dt class="text-ledger-text-dim">Founded</dt>
            <dd class="font-mono text-ledger-text-muted">{actor.founded}</dd>
          </div>
        )}
        {actor.website && (
          <div class="flex items-baseline gap-2">
            <dt class="text-ledger-text-dim">Website</dt>
            <dd>
              <a href={actor.website} target="_blank" rel="noopener noreferrer" class="text-category-policy hover:underline">
                {actor.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </dd>
          </div>
        )}
        <div class="flex items-baseline gap-2">
          <dt class="text-ledger-text-dim">Tracked events</dt>
          <dd class="font-mono text-ledger-text-muted">{actorEvents.length}</dd>
        </div>
      </dl>

      {actor.aliases && actor.aliases.length > 0 && (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span class="text-ledger-text-dim font-mono">Also known as:</span>
          {actor.aliases.map((alias) => (
            <span class="px-2 py-0.5 font-mono text-ledger-text-muted bg-ledger-surface rounded border border-ledger-border">
              {alias}
            </span>
          ))}
        </div>
      )}
    </header>

    <section>
      <h2 class="text-lg font-semibold text-white mb-6">Events</h2>

      {actorEvents.length === 0 ? (
        <p class="text-ledger-text-muted italic">No tracked events yet.</p>
      ) : (
        years.map((year) => (
          <div class="mb-8">
            <h3 class="text-sm font-mono uppercase tracking-wider text-ledger-text-dim mb-3">{year}</h3>
            <div class="space-y-1">
              {byYear[year].map((evt) => {
                const catColor = getCategoryColor(evt.category);
                const role = evt.actors?.find((a) => a.id === actor.id)?.role;
                return (
                  <a
                    href={`/events/${evt.slug}`}
                    class="group flex items-center gap-3 sm:gap-4 py-2.5 px-3 -mx-3 rounded-lg hover:bg-ledger-surface/50 transition-colors"
                  >
                    <time class="flex-shrink-0 text-xs font-mono text-ledger-text-dim w-20 sm:w-24">
                      {new Date(evt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </time>
                    <span class="flex-1 text-sm text-ledger-text group-hover:text-white transition-colors line-clamp-1">
                      {evt.title}
                    </span>
                    {role && (
                      <span class="flex-shrink-0 text-[10px] font-mono uppercase tracking-wider text-ledger-text-dim hidden sm:inline">
                        {role}
                      </span>
                    )}
                    <span
                      class="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full border hidden sm:inline-block"
                      style={`background: ${catColor}15; color: ${catColor}; border-color: ${catColor}30;`}
                    >
                      {evt.category.replace('-', ' ')}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ))
      )}
    </section>
  </article>
</Base>
```

**Step 3: Add "Actors" to nav**

Read `site/src/layouts/Base.astro`. Find the nav link list (likely a series of `<a href="/threads">`, `<a href="/explore">` etc.) and add an `<a href="/actors">Actors</a>` link in the appropriate spot (alphabetical or after Controversies). Match the existing styling.

**Verification:**
```bash
cd site && npm run build
```
Expected: build succeeds, 20 actor detail pages are generated. Visual check: `/actors` shows grouped grid; `/actors/openai` shows OpenAI's events.

**Do NOT commit.** Report back, including the path you used in Base.astro nav so orchestrator can verify.

---

## Task 4: Enhance Explore page

**Goal:** Promised features from earlier UX review — date filter, sort, significance display.

**Files:**
- Modify: `site/src/components/Explorer.tsx` (main interactive component)
- Modify: `site/src/components/FilterBar.tsx` (filter UI)
- Modify (possibly): `site/src/pages/explore.astro` (props passed to Explorer)

**Context the subagent needs:**
- Read `Explorer.tsx` and `FilterBar.tsx` first to understand the current state before editing.
- Don't redesign — extend. The current category + significance filter UX should remain; add year filter and sort dropdown alongside.
- Year filter: not a date range slider (overkill). Two simple options: (a) a row of clickable year buttons (`All | 2026 | 2025 | 2024 | 2023`), or (b) a single-select dropdown. Pick (a) — matches the visual style of category chips already present.
- Sort options: `Newest first` (default), `Oldest first`, `Most significant first`. Use `getSignificanceOrder()` from `content.ts` for the third — landmark > major > notable.
- Show significance level on event cards: a small badge like the latest-events list on the homepage (uses `significanceColors` map there as reference).

**Step 1: Read existing files**
```bash
# Subagent: read these to understand the current state
cat site/src/components/Explorer.tsx
cat site/src/components/FilterBar.tsx
cat site/src/components/EventCard.tsx
cat site/src/pages/explore.astro
```

**Step 2: Add year filter to FilterBar**

Add a `years` prop (sorted desc, computed from events). Render a row of year chips below the category chips, using the same chip styling. Selected year highlighted; default `All`.

**Step 3: Add sort dropdown to FilterBar**

Add a sort select on the right side of the search input row. Options: `newest`, `oldest`, `significance`.

**Step 4: Apply filters/sort in Explorer**

Wire the new filter + sort into the existing useState/useMemo logic. The filter is straightforward; for sort, use `getSignificanceOrder()` for "significance" (tie-break by date desc).

**Step 5: Display significance on EventCard**

Add a small significance badge to the EventCard, mirroring the homepage style:

```tsx
const significanceColors = {
  landmark: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  major: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
  notable: 'text-ledger-text-dim bg-ledger-surface border-ledger-border',
};
// Render only when event.significance is set
```

Place it next to the category badge.

**Verification:**
```bash
cd site && npm run build
```
Expected: build succeeds. Visual check: Explore page now has year chips, sort dropdown, significance shown on cards. Filtering and sorting both work.

**Do NOT commit.** Report back with a summary of the changes.

---

## Task 5: Build graph visualization

**Goal:** Ship the relationship graph that's been generated all along but never rendered.

**Files:**
- Create: `site/src/pages/graph.astro`
- Create: `site/src/components/Graph.tsx`
- Modify: `site/src/layouts/Base.astro` (add "Graph" to nav — coordinate with Task 3)
- Modify: `site/astro.config.mjs` if needed (likely not)
- Modify: `site/package.json` (add dependency: `react-force-graph-2d`)

**Context the subagent needs:**
- `graph.json` is generated at repo root by `scripts/build-graph.ts`. Schema:
  ```ts
  { nodes: [{id, type: 'event'|'thread'|'controversy'|'actor', title, date?, category?, significance?}],
    edges: [{source, target, type: 'belongs_to_thread'|'has_controversy'|'related_event'|'involves_actor'|'references_thread'}],
    stats: {...},
    generated_at: string }
  ```
- For the site to access it, copy at build time. Easiest: read the file in the Astro page's frontmatter via `fs.readFileSync(path.resolve('..', 'graph.json'))` and pass to the React component as a prop. (No bundler config needed.)
- Library choice: `react-force-graph-2d` — simplest API, canvas-rendered, performant for ~100 nodes. Install with `npm install react-force-graph-2d` in `site/`.
- Color nodes by type: event=indigo, thread=violet, controversy=red, actor=cyan. Use existing `ledger.*` and `category.*` color tokens where they fit.
- Hover shows label; click navigates to the appropriate route (`/events/{id}`, `/threads/{id}`, `/controversies/{id}`, `/actors/{id}`).
- Add a category-filter toggle row at the top (event categories): clicking hides events of that category and recomputes layout.
- Don't try to be clever with layouts. Default force-directed is fine.

**Step 1: Install dependency**
```bash
cd site && npm install react-force-graph-2d
```

**Step 2: Create the Graph component**

`site/src/components/Graph.tsx`:

```tsx
import { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

type GraphNode = {
  id: string;
  type: 'event' | 'thread' | 'controversy' | 'actor';
  title: string;
  date?: string;
  category?: string;
  significance?: string;
  // Filled by force-graph
  x?: number; y?: number; vx?: number; vy?: number;
};

type GraphEdge = {
  source: string;
  target: string;
  type: string;
};

type Props = {
  data: { nodes: GraphNode[]; edges: GraphEdge[] };
};

const NODE_COLORS: Record<string, string> = {
  event: '#6366F1',       // indigo (policy color, used as event default)
  thread: '#8B5CF6',      // violet
  controversy: '#EF4444', // red
  actor: '#06B6D4',       // cyan
};

const TYPE_LABELS: Record<string, string> = {
  event: 'Events',
  thread: 'Threads',
  controversy: 'Controversies',
  actor: 'Actors',
};

export default function Graph({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>();
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!containerRef.current) return;
    const resize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setSize({ width: rect.width, height: Math.max(500, window.innerHeight - 280) });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const filteredData = useMemo(() => {
    const visibleNodes = data.nodes.filter((n) => !hidden.has(n.type));
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = data.edges.filter(
      (e) => visibleIds.has(typeof e.source === 'string' ? e.source : (e.source as any).id) &&
             visibleIds.has(typeof e.target === 'string' ? e.target : (e.target as any).id)
    );
    return { nodes: visibleNodes, links: visibleEdges };
  }, [data, hidden]);

  const toggleType = (type: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleNodeClick = (node: any) => {
    const route =
      node.type === 'event' ? `/events/${node.id}` :
      node.type === 'thread' ? `/threads/${node.id}` :
      node.type === 'controversy' ? `/controversies/${node.id}` :
      `/actors/${node.id}`;
    window.location.href = route;
  };

  const types = ['event', 'thread', 'controversy', 'actor'];
  const counts = types.reduce<Record<string, number>>((acc, t) => {
    acc[t] = data.nodes.filter((n) => n.type === t).length;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const isHidden = hidden.has(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border transition-all ${
                isHidden
                  ? 'border-ledger-border text-ledger-text-dim bg-transparent opacity-50'
                  : 'border-ledger-border-light text-ledger-text bg-ledger-surface'
              }`}
              style={!isHidden ? { borderColor: NODE_COLORS[type], color: NODE_COLORS[type] } : {}}
            >
              {TYPE_LABELS[type]} ({counts[type]})
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        className="border border-ledger-border rounded-lg bg-ledger-surface/30 overflow-hidden"
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={filteredData}
          width={size.width}
          height={size.height}
          nodeColor={(node: any) => NODE_COLORS[node.type] || '#888'}
          nodeRelSize={4}
          nodeLabel={(node: any) => `${node.title} (${node.type})`}
          linkColor={() => 'rgba(255,255,255,0.1)'}
          linkWidth={1}
          onNodeClick={handleNodeClick}
          backgroundColor="rgba(0,0,0,0)"
          cooldownTicks={100}
        />
      </div>

      <p className="text-xs text-ledger-text-dim font-mono">
        Click a node to open. Drag to pan, scroll to zoom. Toggle types above to filter.
      </p>
    </div>
  );
}
```

**Step 3: Create the Graph page**

`site/src/pages/graph.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Graph from '../components/Graph';
import fs from 'node:fs';
import path from 'node:path';

// Read graph.json from repo root (one level above site/)
const graphPath = path.resolve(process.cwd(), '..', 'graph.json');
let graph: any = { nodes: [], edges: [] };
try {
  graph = JSON.parse(fs.readFileSync(graphPath, 'utf-8'));
} catch (e) {
  console.warn('graph.json not found — run `npm run build-graph` from repo root.');
}
---

<Base title="Graph" description="Relationship graph: events, threads, controversies, and actors connected.">
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-6">
      <p class="text-xs font-mono uppercase tracking-[0.2em] text-ledger-text-dim mb-2">Graph</p>
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
        How everything connects
      </h1>
      <p class="text-ledger-text-muted">
        {graph.nodes.length} nodes, {graph.edges.length} edges. Events belong to threads; threads contain controversies; events involve actors.
      </p>
    </div>

    <Graph data={graph} client:only="react" />
  </section>
</Base>
```

(Use `client:only="react"` because react-force-graph-2d uses canvas/window APIs and won't SSR.)

**Step 4: Ensure graph.json is built before site build**

Update `site/package.json`'s build script to depend on graph being built. The simplest path: assume the orchestrator ensures `npm run build-graph` is run before `cd site && npm run build`. Document this in a comment in the page if needed.

Alternatively, modify the root `package.json` to chain. For now, leave the chaining to the orchestrator and CI — just ensure the page handles a missing `graph.json` gracefully (already does via try/catch).

**Step 5: Add Graph to nav**

In `site/src/layouts/Base.astro`, add `<a href="/graph">Graph</a>` to the nav. Coordinate with Task 3 — both modify Base.astro. Subagent should add the link without overwriting Task 3's Actors link if both are in flight.

**Verification:**
```bash
cd /Users/terrytang/Projects/the-ledger && npm run build-graph
cd site && npm run build
```
Expected: builds succeed. Visual check: `/graph` renders a force-directed visualization. Type filter buttons toggle visibility. Clicking a node navigates to its detail page.

**Do NOT commit.** Report back, including any issues integrating Base.astro with Task 3.

---

## Task 6: Tier-0 source-tip template + Contribute polish

**Goal:** Make the lowest-bar contribution path obvious and easy.

**Files:**
- Create: `.github/ISSUE_TEMPLATE/source-tip.yml`
- Modify: `.github/ISSUE_TEMPLATE/config.yml` (if exists; create if not, to set ordering)

**Context the subagent needs:**
- Existing templates: `new-event.yml` (full event), `challenge.yml` (formal challenge), `reinterpretation.yml` (significance change request).
- The new template is the lowest bar: just a URL + a sentence about why it matters. The curator does the rest.
- This template is what the homepage and About page link to: `?template=source-tip.yml`.

**Step 1: Read existing templates for structure**
```bash
cat .github/ISSUE_TEMPLATE/new-event.yml
```
Match the YAML form schema and required field patterns.

**Step 2: Create source-tip.yml**

`.github/ISSUE_TEMPLATE/source-tip.yml`:

```yaml
name: Source Tip
description: Drop a source link for an AI event you think should be tracked. The curator will normalize it.
title: "[Tip] "
labels: ["tier-0", "source-tip"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for contributing! This is the lowest-bar way to help: just give us a source and a short note. We'll do the rest.

        **Before submitting**, scan [the timeline](https://the-ledger.dev) to make sure it isn't already covered.

  - type: input
    id: source-url
    attributes:
      label: Source URL
      description: A primary source preferred (announcement, paper, official statement). Secondary reporting is also welcome.
      placeholder: https://example.com/article-or-paper
    validations:
      required: true

  - type: input
    id: source-title
    attributes:
      label: Source title
      description: The title of the linked piece.
    validations:
      required: true

  - type: input
    id: source-publisher
    attributes:
      label: Publisher
      description: Who published it? (Company name, news outlet, journal, etc.)
      placeholder: e.g., Anthropic, The New York Times, arXiv

  - type: input
    id: event-date
    attributes:
      label: Date of the event (YYYY-MM-DD)
      description: When did the thing happen? (Not the publish date of the source, unless they're the same.)
      placeholder: 2026-01-15
    validations:
      required: true

  - type: textarea
    id: why
    attributes:
      label: Why does this matter?
      description: One or two sentences. What is this event, and why should The Ledger track it?
      placeholder: |
        e.g., "Anthropic released Claude 4.7 with a new long-context architecture. Significance: first commercial deployment of [technique]; relevant to the Scaling Laws Plateau thread."
    validations:
      required: true

  - type: input
    id: actors
    attributes:
      label: Actors involved (optional)
      description: Comma-separated. Use names; the curator will resolve IDs.
      placeholder: e.g., Anthropic, OpenAI, US Government

  - type: textarea
    id: archive
    attributes:
      label: Archived URL (optional but recommended)
      description: A link to an archive.org or archive.today snapshot, in case the original disappears.
      placeholder: https://web.archive.org/web/...

  - type: checkboxes
    id: confirmations
    attributes:
      label: Confirmations
      options:
        - label: I've checked that this isn't already in the timeline
          required: true
        - label: The source URL is publicly accessible (not behind a paywall I can't share)
          required: false
```

**Step 3: Optionally create config.yml to set template order**

If `.github/ISSUE_TEMPLATE/config.yml` doesn't exist, create it to make source-tip the default/most prominent option:

```yaml
blank_issues_enabled: true
contact_links:
  - name: Contributing Guide
    url: https://github.com/pedro-bright/the-ledger/blob/main/CONTRIBUTING.md
    about: Read the full contributor guide before opening Tier 1+ issues.
```

(Order in the issue template chooser is by filename — `source-tip.yml` will appear after `reinterpretation.yml` alphabetically. If we want it first, rename other files to `02-`, `03-`, etc. — defer this micro-optimization to post-launch unless it's trivially cheap.)

**Step 4: Verify YAML is well-formed**

GitHub's issue forms parser is strict. Validate locally:
```bash
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/ISSUE_TEMPLATE/source-tip.yml', 'utf8')))"
```
Expected: prints the parsed object without throwing.

**Do NOT commit.** Report back to orchestrator.

---

## Orchestrator playbook (after all tasks return)

1. **Validate everything together:**
   ```bash
   cd /Users/terrytang/Projects/the-ledger
   npm run validate
   npm run build-graph
   cd site && npm run build
   ```
   Fix any conflicts (esp. Base.astro nav — Tasks 3 and 5 both touch it).

2. **Spot-check visually** with dev server if uncertain:
   ```bash
   cd site && npm run dev
   ```
   Visit: `/`, `/about`, `/explore`, `/actors`, `/actors/openai`, `/graph`, `/events/openai-removes-military-ban`.

3. **Commit in logical batches:**
   - Commit 1 (copy): README + index.astro CTA + about.astro + source-tip template
   - Commit 2 (event polish): events/[...id].astro + ConfidenceBadge
   - Commit 3 (actors): actors pages + Base.astro nav
   - Commit 4 (explore): Explorer/FilterBar/EventCard
   - Commit 5 (graph): Graph component + page + Base.astro nav (if separate from commit 3)

4. **Push and open PR** following user-level CLAUDE.md ("Open a PR" rule):
   ```bash
   git push -u origin pre-launch-prep
   gh pr create --title "Pre-launch prep: hybrid framing + missing UX surfaces" --body "..."
   ```

5. **Domain decision** is out-of-scope for subagents — flag to user: configure `the-ledger.dev` in Vercel, or update RSS to use the Vercel preview URL until domain is ready.

---

## Out of scope (deferred to post-launch)

- Writing additional events or backfilling Q2 2026 (content work, not pre-launch UX)
- Recruiting editorial board members (people work)
- Newsletter signup integration
- Search index / typeahead (current text search is adequate for 59 events)
- AI-assisted draft pipeline / auto-detection of new events
- Standalone synthesis docs migration (threads embed them; defer until threads outgrow)
- Rich graph filters (year, actor degree) — ship basic version first

---

## Definition of done

- All six tasks complete; build passes; validation passes.
- Visual verification done by orchestrator/user on each new/changed page.
- PR opened against main, ready for user review.
- Tactical launch blockers addressed (counts, broken link, contestation surface, graph hidden, no actor pages, missing source-tip template).
- README and About are honest about curator-led present and community-roadmap future.
