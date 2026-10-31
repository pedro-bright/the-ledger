# AI Assistance Disclosure

*How The Ledger uses AI tools, and the boundaries we maintain.*

**Version:** 1.1 | **Last updated:** 2026-10-30

---

## Policy

The Ledger uses AI tools as part of its editorial process.
We disclose this use transparently because we believe honest methodology disclosure is more valuable than pretending AI wasn't involved.

## How AI is Used

### Research assistance

AI tools are used to:

- Summarize and organize source material during research
- Identify relevant connections between events, threads, and actors
- Draft initial summaries and outlines for events
- Check for factual consistency across entries
- Suggest related events and thread connections

### Draft structuring

AI tools may generate initial drafts of:

- Event summaries and "What Happened" sections
- Thread arc descriptions
- Controversy position summaries
- Metadata (tags, categories, actor connections)

### What AI does NOT do

AI tools do not:

- Approve or reject challenges, retrospectives, or canon changes
- Set editorial policy or modify the constitution

Outside the automatic daily scan described below, AI tools also do not:

- Make final editorial judgments about significance, confidence, or contestation status
- Make final decisions about which interpretations are included or excluded
- Replace human judgment on any matter where judgment is required

## Automatic Publishing and Human Review

Daily scan entries are drafted and published automatically under the editorial rules:

1. **Sourced claims:** Factual assertions require sources under the [evidence standards](evidence-standards.md).
2. **The 72-hour rule:** Publication waits at least 72 hours after initial reporting.
3. **Notable significance only:** Automated entries use `notable`; significance upgrades require human editorial judgment.
4. **Validation:** Entries must pass schema and cross-reference validation before publication.
5. **AI disclosure:** AI-assisted entries set `draft_assistance: ai-assisted` under `revision` in the frontmatter (`revision.draft_assistance`).

An AI tool selects the events, writes the entries, and sets their `confidence` and `significance` within these rules.
These entries may not be read individually by a human before or after publication, which makes them the documented exception to the human approval in principle 5 of the [editorial constitution](constitution.md).
The curator, Terry Tang, is accountable for them and corrects errors when they are found or challenged, in public, through the existing correction and challenge process.
Corrections are recorded publicly through revisions and git history.
Contributor submissions continue to require editorial review before publication, as described in [the contribution guide](../CONTRIBUTING.md#review-process).

**Anyone can [challenge a published claim](../CONTRIBUTING.md#challenging-existing-content) at any time.**
Challenges, corrections, and their resolutions remain part of the public record.

## Why This Matters

The Ledger tracks what we know, how we know it, and how our understanding changes.
Automatic publication can put errors on the record that no human has caught.
Disclosing that process and preserving corrections lets readers assess the record and challenge it.

AI-assisted research and drafting do not remove the curator's responsibility for judgment, context, and accuracy.

## Accountability

The curator is responsible for automatically published scan entries; named human editors remain responsible for their contributions.
"The AI wrote it" is never a defense for factual errors, biased framing, or editorial lapses.

## Updating This Policy

As AI tools evolve, this policy will be updated to reflect changes in capability and use patterns.
All changes will be versioned and recorded in git history.

---

*The irony of an AI history project using AI tools is not lost on us. We embrace it.*
