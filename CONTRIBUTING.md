# Contributing to The Ledger

Thank you for your interest in contributing to The Ledger. This guide explains how contributions work, from casual submissions to deep editorial involvement.

## Contribution Philosophy

The Ledger uses **progressive formalization** — you don't need to master the full data model to contribute. Start simple. Editors enrich over time.

## Contribution Tiers

### Tier 0: Anyone Can Submit

**What:** Submit a claim and a source.

**How:** Open a [GitHub Issue](../../issues/new) using the "New Event" template, or the "Source Tip" template when you have a source and a short note.
To add a source to an entry that is already in the ledger, use the "Source Tip" template and fill in the entry's ID.

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

### Automated Daily Scan

Daily scan entries are drafted and published automatically under the editorial rules: factual claims require sources, publication waits at least 72 hours after initial reporting, significance is limited to `notable`, and entries must pass validation.
These entries may not be read individually by a human before or after publication.
The curator is accountable for them and corrects errors when they are found or challenged, in public, through the existing correction and challenge process.
Anyone can [challenge a published claim](#challenging-existing-content); corrections and challenge resolutions remain part of the public record.
Contributor submissions follow the review process below.

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

Create a scaffold from the repository root:

```bash
npm run new-event -- --id example-event --date 2026-11-01 --category policy
```

The command creates `content/events/<year>/<number>-<id>.md` with the required frontmatter and body headings.
It uses the highest existing number in that year plus one, leaving gaps for open pull requests.
The id must be unique and the category must be listed in the event schema.
Fill in the title and sources, set `state`, `revision.draft_assistance` and `revision.final_author`, then write the body and run `npm run validate` before submitting.
The [publication rules](#publication-rules) list what a new event must include.

**AI assistance:** If you use AI tools to draft content, set `draft_assistance: ai-assisted` under `revision` in the frontmatter (`revision.draft_assistance`).
This is a disclosure.
See [editorial/ai-assistance.md](editorial/ai-assistance.md).

**Quality checklist:**
- [ ] Summary is self-contained (could be read alone)
- [ ] All factual claims have sources
- [ ] Analysis is labeled and separated from reporting
- [ ] Dates are specific and verified
- [ ] Sources meet the [evidence standards](editorial/evidence-standards.md)

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

- **Automated daily scan PRs:** Publication is automatic under the editorial rules above, with no reviewer sign-off; errors are corrected when they are found or challenged.
- **Tier 1 PRs:** 1 reviewer required
- **Tier 2 PRs:** 2 reviewers required
- **Tier 3 PRs (editorial changes):** Full board review + 30-day RFC

### What Reviewers Check

1. **Factual accuracy:** Are claims supported by sources?
2. **Source quality:** Are sources typed correctly? Are primary sources archived?
3. **Prose quality:** Is it clear, precise, and consistent with our [style guide](editorial/style-guide.md)?
4. **Schema compliance:** Is the frontmatter complete and valid?
5. **Neutrality of reporting / transparency of analysis:** Are factual claims separated from interpretation? Is analysis attributed?

### Publication Rules

`npm run validate` enforces these rules for every event whose `revision.created` is on or after `PUBLICATION_RULES_FROM` in `scripts/publication-rules.ts` (currently 2026-11-15).
Events whose `revision.created` is a YYYY-MM-DD date before that date are not checked.
An event without a valid `revision.created` is checked.
Each violation names the file, the rule and the field, followed by the fix.

| Rule | Requirement |
|------|-------------|
| revision record | `revision.created` (as YYYY-MM-DD), `revision.last_reviewed`, `revision.final_author` and `revision.draft_assistance` are set. |
| lifecycle state | `state` is set. |
| source details | Every source has `publisher`, `date` and `accessed`. |
| minimum sourcing | At least one source has type `official` or a type starting with `primary`, or the event has at least two sources. |
| archived primary sources | Every source with type `official` or a type starting with `primary` has an `archive_url`. |
| fixed archive capture | An `archive_url` on `web.archive.org` points to one capture with a 14-digit timestamp, such as `https://web.archive.org/web/20261115120000/<url>`. |
| automatic entries are notable | When `revision.final_author` is `pedro-bright`, the account that publishes the automated daily scan, `significance` is `notable`. |

The validator does not check whether two sources are independent or whether a publisher is credible; reviewers check those against the [evidence standards](editorial/evidence-standards.md).

---

## Challenging Existing Content

**Anyone** can challenge a published claim at any time.

### How to File a Challenge

1. Open a GitHub Issue using the "Challenge" template
2. Specify the claim you're challenging
3. Provide your basis: `misquote` | `context_omission` | `overstatement` | `unsupported_inference` | `category_error` | `source_misattribution` | `timeline_error` | `duplication`
4. Include sources supporting your challenge

### What Happens

1. The claim moves to `challenged` status
2. An editor reviews the challenge
3. Possible outcomes:
   - **Sustained:** The claim is revised via a formal summary revision
   - **Dismissed:** The challenge is rejected with stated reasoning
   - **Partially sustained:** Some aspects are revised
4. All resolutions are public and recorded

## Handling a challenge

The curator approves every disposition.
Maintainers prepare the records and evidence in a pull request for that approval.

1. Create the challenge record from the repository root:

   ```bash
   npm run new-challenge -- --target gpt-4-release --allegation misquote --issue 123
   ```

   Repeat `--allegation` for each applicable allegation from the challenge schema; `--issue` is optional.
   Fill `opened_by`, quote the challenged assertion, and write the basis with sources and the procedural status.
   Update the entry's `state` and `contestation` for the challenge, and record any justified confidence change.
   Keep the entry's ID and original claims available in the public record.

2. Review the evidence and, when the summary needs to change, create a revision:

   ```bash
   npm run new-revision -- --target gpt-4-release --case cc-gpt-4-release-20261114
   ```

   Use the actual challenge ID printed by the first command.
   `--case` is optional for revisions outside a challenge.
   The scaffold copies the entry's current Summary into `prior_version` and its frontmatter into Original metadata.
   Fill `new_version`, `reason`, `author` and `changed_claim_ids`, then write Scope and Evidence.
   Update the entry's Summary to match `new_version` and its `revision.last_reviewed` where applicable.

3. Prepare the resolution using a disposition approved by the curator:

   ```bash
   npm run new-resolution -- --case cc-gpt-4-release-20261114 --disposition sustained
   ```

   Choose the disposition from the resolution schema: `upheld`, `rejected`, `mixed`, `deferred` or `sustained`.
   Fill `findings`, `actions` and `decided_by`, cite the evidence, and record the curator's approval in Review.
   A `summary_revision_created` action must name the actual revision in `summary_revision_id`.
   If no change is approved, record the appropriate action rather than inventing a revision.
   Update the challenge's `status` and `resolution_note_id`, and the entry's `state`, `confidence`, `contestation`, Summary and review date as the approved actions require.

4. Run `npm run validate` and submit the linked files and entry updates together for review.

The commands create `content/challenges/cc-<entry-id>-<YYYYMMDD>.md`, `content/revisions/sr-<entry-id>-<YYYYMMDD>.md` and `content/resolutions/rn-<entry-id>-<YYYYMMDD>.md` using the local calendar day.
If an ID or filename is taken, the command adds `-2`, `-3` and so on without overwriting it.
Each command prints the fields left to fill and the related updates to make.
Empty or null editorial placeholders deliberately fail schema validation until completed.
The commands write only the new record; maintainers apply the approved entry and challenge updates.

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

*Questions? Open an issue with the blank template.*
