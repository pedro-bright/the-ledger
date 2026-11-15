---
id: cc-deepseek-v4-pro-release-20261115
target_claim_id: deepseek-v4-pro-release
allegations:
  - source_misattribution
  - misquote
status: sustained
opened_at: '2026-11-15'
opened_by: terry-tang
resolution_note_id: rn-deepseek-v4-pro-release-20261115
---

Raised in the follow-ups of [pull request 234](https://github.com/pedro-bright/the-ledger/pull/234) and taken up under [issue 265](https://github.com/pedro-bright/the-ledger/issues/265).

## Challenged assertion

The entry's Summary states that V4-Pro "scored within 0.2 percentage points of Claude Opus 4.7 on SWE-bench Verified and outperformed it on LiveCodeBench."
The Why It Matters section repeats the comparison as "A 0.2-percentage-point gap on SWE-bench Verified against Claude Opus 4.7."
The What Happened section of the same entry gives V4-Pro 80.6% against 87.6% for Claude Opus 4.7, a gap of 7 points, and gives Claude Opus 4.7 88.8% on LiveCodeBench.

## Basis

The entry cites the DeepSeek-V4-Pro model card as its official source.
The model card's table "DeepSeek-V4-Pro-Max vs Frontier Models" compares V4-Pro with Claude Opus 4.6, labelled "Opus-4.6 Max," and not with Claude Opus 4.7.
In that table V4-Pro scores 80.6 on SWE-bench Verified (Resolved) against 80.8 for Opus 4.6 Max, a gap of 0.2 points.
On LiveCodeBench (Pass@1) V4-Pro scores 93.5 against 88.8 for Opus 4.6 Max.
The archived copy of the model card from April 27, 2026, the capture the entry cites, has the same table and figures as the live page read on November 15, 2026.
The 0.2-point gap and the 88.8 LiveCodeBench score are therefore DeepSeek's comparison with Claude Opus 4.6, attributed in the entry to Claude Opus 4.7.
None of the entry's sources gives an SWE-bench Verified score for Claude Opus 4.7 or GPT-5.5, so the 87.6% and 89.1% figures in What Happened have no support in the entry's own sources.

[DeepSeek-V4-Pro model card](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro), DeepSeek AI, April 24, 2026, accessed November 15, 2026.
[Archived copy, captured 2026-04-27](https://web.archive.org/web/20260427030628/https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro).

## Procedural status

The challenge was opened and reviewed on November 15, 2026, against the entry's own sources.

## Outcome

The challenge was sustained on November 15, 2026, subject to the curator's approval of the pull request that adds this record.
The [resolution note](https://github.com/pedro-bright/the-ledger/blob/main/content/resolutions/rn-deepseek-v4-pro-release-20261115.md) records the findings and the [summary revision](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-deepseek-v4-pro-release-20261115.md) that followed.
