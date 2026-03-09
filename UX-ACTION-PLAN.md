# The Ledger — UX Action Plan (GPT-5.4-pro + 3 UX Research Agents)

**Date:** March 8, 2026  
**Source:** 3 independent UX research agents + 2 rounds with GPT-5.4-pro  

---

## Triage: MUST FIX Before HN Launch (~2 days)

### 1. OG Meta Tags (1-2 hours)
Add reusable `SEO.astro` component with `og:title`, `og:description`, `og:image`, `twitter:card`. Create one default social card image. Add per-page titles for events/threads.

### 2. Hero Headline Rewrite (30 min)
- **New headline:** "Track the real history of AI."
- **Subhead:** "Events, debates, and turning points — organized for understanding, not doomscrolling."
- **Add stats row:** "59 events · 4 threads · 5 controversies · 20 actors"

### 3. Homepage Redesign — Lead with Threads (3-4 hours)
The single most impactful change. Current homepage looks like a blog. New layout:
1. **Hero** — clear headline + stats + two CTAs ("Explore Threads" primary, "Browse Timeline" secondary)
2. **Featured Threads** — 2x2 grid of thread cards (title, 1-sentence synthesis, event count, mini-timeline, entity chips)
3. **Latest Major Milestones** — compact strip of 5-8 recent events with thread links
4. **Explore by Entity** — pill buttons for People, Organizations, Models, Concepts
5. **Contribute CTA band** — dark panel with 3-tier contribution options
6. **Footer** — persistent links to all sections

Move full timeline to `/timeline`. Homepage shows preview only.

### 4. Fix Controversies 404 (1-2 hours)
Audit Astro routes — ensure controversy slugs match content files. Add `/controversies` index page. Add "Controversies" to main nav.

### 5. Fix Generic Source URLs (2-3 hours)
Content pass on all 59 events — replace domain-root URLs with specific article/paper links. Critical for credibility.

### 6. Cross-Navigation (3-4 hours)
Kill "disconnected page syndrome":
- **Event pages:** Add clickable chips for actors, tags, threads, related events
- **Thread pages:** Link every event mention, add entity chips, "View in timeline" link
- **Timeline:** Each row links to event detail + related thread + actors
- **Explore:** Make all tags, actors, threads clickable

### 7. Contestation Status Badges (1 hour)
Show epistemic status badges on event pages (contested/uncontested/superseded). Core to the product thesis.

### 8. Contribution CTA (1-2 hours)
- Add "Contribute" to nav header
- Create `/contribute` page with 3 tiers:
  1. **Easy:** Suggest a correction (form → GitHub issue)
  2. **Medium:** Submit a source or event (structured form)
  3. **Advanced:** Direct GitHub contribution (link to repo + guide)

### 9. RSS Discovery (15 min)
Add `<link rel="alternate" type="application/rss+xml">` in head. Add RSS icon in header/footer.

### 10. Single-Author Framing (30 min)
Don't fake plurality. Reframe as: "Curated by Terry Tang under a transparent editorial framework. Contributions, corrections, and source additions are public." Show methodology, changelog, editorial policy prominently.

---

## Fix Within First Week

### 11. Mobile Hamburger Menu (2-3 hours)
Replace cramped horizontal nav with hamburger at <768px.

### 12. Timeline Pagination (2 hours)
Progressive disclosure — show 10-15 events initially, "Load more" or year-based pagination.

### 13. Date Filter on Explore (1-2 hours)
Add date range picker to Explore page facets.

### 14. Controversy Title Display (30 min)
Render proper titles instead of raw slugs (`militarization-vs-safety` → "Military AI: Safety Through Engagement vs. Normalization of Militarization").

### 15. Archived URLs (2-3 hours)
Add archive.org links for all primary sources. Consider automating via Wayback Machine API.

### 16. Confidence Badge Logic (30 min)
Only show confidence badge when NOT high. Everything being "High confidence" is noise.

---

## Featured Threads Card Design (for homepage)

```
┌─────────────────────────────────────────┐
│  The Scaling Laws Debate                │
│                                         │
│  "Whether raw compute or clever         │
│  methodology drives AI progress"        │
│                                         │
│  2020–present · 12 events · 5 actors    │
│                                         │
│  ┄┄┄●──────●───────●──────●┄┄┄         │
│  GPT-3  Chinchilla DeepSeek  ???        │
│                                         │
│  [OpenAI] [Google] [DeepSeek]           │
│                                         │
│  Read thread →                          │
└─────────────────────────────────────────┘
```

- Whole card clickable
- Hover: subtle border glow
- Fixed height for clean 2x2 grid
- Mobile: stacked single column

---

## HN Launch Notes

**Title:** "The AI field has no durable historical record. I'm trying to fix that."
**Don't say:** "Epistemic ledger" (jargon)
**Lead with:** The insight, not the tool
**Best shareable URL:** A thread page (e.g., scaling laws debate), not the homepage

---

*Sources: UX-REVIEW-LANDING.md, UX-REVIEW-CONTENT.md, UX-REVIEW-STRATEGY.md, GPT-5.4-pro consultation (2 rounds)*
