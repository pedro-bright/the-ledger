---
id: rn-deepseek-v4-pro-release-20261115
case_id: cc-deepseek-v4-pro-release-20261115
disposition: sustained
findings:
  - "The DeepSeek-V4-Pro model card compares V4-Pro with Claude Opus 4.6 (\"Opus-4.6 Max\"), not with Claude Opus 4.7. The 0.2-point SWE-bench Verified gap in the Summary and in Why It Matters is the gap to Claude Opus 4.6: 80.6 for V4-Pro against 80.8."
  - "The LiveCodeBench comparison is also with Claude Opus 4.6: 93.5 for V4-Pro against 88.8. The What Happened section attributes the 88.8 to Claude Opus 4.7."
  - "None of the entry's sources gives an SWE-bench Verified score for Claude Opus 4.7 or GPT-5.5, so the 87.6% and 89.1% figures in What Happened are unsupported by the entry's own sources."
actions:
  - type: summary_revision_created
    claim_id: deepseek-v4-pro-release
    summary_revision_id: sr-deepseek-v4-pro-release-20261115
  - type: event_state_changed
    claim_id: deepseek-v4-pro-release
    from:
      state: published
      contestation: uncontested
    to:
      state: published
      contestation: contested
decided_by:
  - terry-tang
issued_at: '2026-11-15'
---

## Decision

The challenge is sustained on both allegations.
The Summary attributed DeepSeek's comparison with Claude Opus 4.6 to Claude Opus 4.7, which is a source misattribution, and so misstated what the model card reports.
The Summary is corrected through [a summary revision](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-deepseek-v4-pro-release-20261115.md).
The What Happened and Why It Matters sections stay in the entry as published, below a correction note that says which of their figures the sources do not support.

## Evidence

- [DeepSeek-V4-Pro model card](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro), DeepSeek AI, April 24, 2026, read on November 15, 2026.
  [Archived copy, captured 2026-04-27](https://web.archive.org/web/20260427030628/https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro).
  The table "DeepSeek-V4-Pro-Max vs Frontier Models" has columns for Opus-4.6 Max, GPT-5.4 xHigh, Gemini-3.1-Pro High, K2.6 Thinking, GLM-5.1 Thinking and DS-V4-Pro Max.
  It gives SWE-bench Verified (Resolved) as 80.8 for Opus-4.6 Max and 80.6 for DS-V4-Pro Max, and LiveCodeBench (Pass@1) as 88.8 and 93.5.
- [DeepSeek V4](https://simonwillison.net/2026/Apr/24/deepseek-v4/), Simon Willison, April 24, 2026, read on November 15, 2026.
  The post compares prices and gives no benchmark scores for Claude Opus 4.7 or GPT-5.5.

The Bloomberg article the entry cites could not be read past its paywall, so this review does not rely on it.

## Review

This note was drafted with AI assistance and takes effect when the curator approves it on the pull request that adds it.
