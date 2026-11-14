---
id: rn-deepseek-r1-distill-impact-20261114
case_id: cc-deepseek-r1-distill-impact-20261026
disposition: sustained
findings:
  - "No listed or newly found source records a distinct DeepSeek-R1 distillation milestone on January 15, 2026, or dozens of community models appearing in early 2026."
  - "DeepSeek's R1 report, first posted January 22, 2025, released six smaller Qwen- and Llama-based models distilled from R1."
  - "Community distillation of R1 began within a week of that report: on January 28, 2025, Hugging Face announced Open-R1, whose first step was to replicate the R1-Distill models, and the Open Thoughts project launched an open reasoning dataset, citing R1 as a cheap source of reasoning demonstrations."
  - "The entry is kept as an attributed account of a trend that began in January 2025. No dated source in the record measures its size or places a peak in early 2026."
actions:
  - type: summary_revision_created
    claim_id: deepseek-r1-distill-impact
    summary_revision_id: sr-deepseek-r1-distill-impact-20261114
  - type: event_state_changed
    claim_id: deepseek-r1-distill-impact
    from:
      state: challenged
      contestation: unresolved
    to:
      state: published
      contestation: contested
decided_by:
  - terry-tang
issued_at: "2026-11-14"
---

## Decision

The challenge is sustained on both allegations.
The January 15, 2026 date is a timeline error, and the early-2026 adoption wave is an unsupported inference.
The entry is re-scoped as an attributed account of the distillation trend, dated by its sources to January 2025.
The event keeps its ID and date so existing links still resolve, and the date identifies the original assertion only.
The summary is corrected through [a summary revision](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-deepseek-r1-distill-impact-20261114.md).
The original narrative stays in the event as published, below the correction note.

## Evidence

- Finding 2: [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (v1)](https://arxiv.org/abs/2501.12948v1), posted January 22, 2025.
  [Archived copy, captured 2026-10-26](https://web.archive.org/web/20261026162442/https://arxiv.org/abs/2501.12948v1).
- Finding 3: [Open-R1: a fully open reproduction of DeepSeek-R1](https://huggingface.co/blog/open-r1), Hugging Face, published January 28, 2025.
  [Archived copy, captured 2025-03-06](https://web.archive.org/web/20250306100821/https://huggingface.co/blog/open-r1).
  Its plan lists "Step 1: Replicate the R1-Distill models by distilling a high-quality reasoning dataset from DeepSeek-R1."
- Finding 3: [Launching the Open Thoughts Project](https://www.open-thoughts.ai/blog/launch), January 28, 2025.
  [Archived copy, captured 2025-03-06](https://web.archive.org/web/20250306123229/https://www.open-thoughts.ai/blog/launch).
  It states: "With the release of DeepSeek-R1, such thinking demonstrations can now be synthetically created at low cost and at scale."
- Findings 1 and 4: neither the event's sources nor the sources above give a date in 2026 or a count of community models.

## Review

This note was drafted with AI assistance and takes effect when the curator approves it on the pull request that adds it.
