# Evidence Standards

*How The Ledger classifies, evaluates, and weighs sources and evidence.*

**Version:** 1.0 | **Last updated:** 2026-03-08

---

## Source Types

Every source used in The Ledger is classified by type. The type determines how much evidentiary weight the source carries.

| Type | Description | Examples | Weight |
|------|-------------|----------|--------|
| `primary_document` | Original document, filing, announcement, or official statement | Press releases, court filings, published research papers, official blog posts, executive orders | Highest |
| `primary_recording` | Direct audio, video, or transcript of the event | Conference keynotes, interviews, congressional testimony, leaked recordings | Highest |
| `primary_dataset` | Original data or measurements | Benchmark results, financial filings, usage statistics from official sources | Highest |
| `secondary_reporting` | Journalistic or research reporting based on primary sources | News articles, investigative reports, research summaries | High |
| `expert_interpretation` | Analysis by domain experts | Op-eds by practitioners, academic commentary, think tank analyses | Medium |
| `editorial_synthesis` | Aggregated interpretation or meta-analysis | Newsletter roundups, "state of AI" reports, year-in-review articles | Medium |
| `hearsay_unverified` | Unconfirmed reports, anonymous sources, social media claims | Tweets, forum posts, unverified insider claims | Low |
| `retraction` | Formal retraction of a previously published source | Journal retractions, corrections, editor's notes | Special |
| `correction` | Partial correction to a previously published source | Updated articles, errata | Special |

## Evidentiary Rules

### What counts as independent

Two sources are independent if they:

1. Come from different organizations
2. Are based on separate reporting or investigation
3. Do not cite each other as their primary basis

Sources that share the same underlying reporting — even if published by different outlets — are assigned to the same `independence_group` and count as one source for corroboration purposes.

### Minimum standards by claim type

| Claim Type | Minimum Source Requirement |
|------------|---------------------------|
| Factual event (what happened) | 1 primary source OR 2 independent secondary sources |
| Attribution (who did what) | 1 primary source with direct attribution |
| Significance assessment | Editorial judgment, documented reasoning |
| Causal claim (X caused Y) | 2 independent sources supporting causal link + editorial reasoning |
| Prediction or forecast | Attributed to named source, labeled as prediction |

### Restrictions

- `editorial_synthesis` cannot be the sole support for a factual claim
- `hearsay_unverified` cannot elevate evidentiary state above `single_source`
- `retraction` or `correction` sources automatically trigger review of all linked claims
- Confidence weights range from 0 (weak) to 3 (definitive) per source-claim link

## Archiving Policy

### Mandatory archiving

All primary sources must have an `archive_url` pointing to a preserved copy (via the Wayback Machine, archive.ph, or equivalent). This protects against link rot and ensures the evidentiary foundation remains accessible.

### Recommended archiving

Secondary sources should be archived when feasible, with priority given to:

1. Sources behind paywalls
2. Sources on platforms known for content removal
3. Sources in rapidly evolving news environments

## Source Quality Assessment

When evaluating sources, editors should consider:

1. **Publisher credibility:** Does the publisher have a track record of accurate reporting?
2. **Author expertise:** Does the author have relevant domain knowledge?
3. **Methodology:** For research or data sources, is the methodology sound?
4. **Timeliness:** How close to the event was the source published?
5. **Independence:** Does the source have financial or ideological ties to the subject?
6. **Corroboration:** Do other independent sources support the same claims?

## Handling Conflicting Sources

When sources disagree:

1. Record both claims with their respective sources
2. Assign appropriate contestation status to the affected claims
3. Note the discrepancy in the event body or analysis section
4. Do not silently prefer one source over another without documented reasoning
