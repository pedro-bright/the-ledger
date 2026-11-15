---
id: sr-deepseek-v4-pro-release-20261115
target_summary_id: deepseek-v4-pro-release
prior_version: >-
  On April 24, 2026 — one year after DeepSeek's V3 model destabilized AI market
  valuations across the United States — DeepSeek released DeepSeek-V4-Pro and
  DeepSeek-V4-Flash as open-weight production models under the MIT license.
  V4-Pro, with 1.6 trillion total parameters and 49 billion active per inference
  step, scored within 0.2 percentage points of Claude Opus 4.7 on SWE-bench
  Verified and outperformed it on LiveCodeBench, while offering API pricing at
  approximately one-seventh of comparable Western model rates. Training was
  conducted in part on Huawei Ascend 950 chips operating in "Supernode" cluster
  configurations — the first publicly confirmed instance of a frontier-adjacent
  model trained on Chinese domestic silicon operating under US export controls.
new_version: |-
  On April 24, 2026 — one year after DeepSeek's V3 model destabilized AI market valuations across the United States — DeepSeek released DeepSeek-V4-Pro and DeepSeek-V4-Flash as open-weight production models under the MIT license.
  V4-Pro, with 1.6 trillion total parameters and 49 billion active per inference step, scored 80.6% on SWE-bench Verified, 0.2 percentage points below Claude Opus 4.6's 80.8% in DeepSeek's own comparison, and outperformed Opus 4.6 on LiveCodeBench, 93.5% to 88.8%, while offering API pricing at approximately one-seventh of comparable Western model rates.
  Training was conducted in part on Huawei Ascend 950 chips operating in "Supernode" cluster configurations — the first publicly confirmed instance of a frontier-adjacent model trained on Chinese domestic silicon operating under US export controls.
reason: >-
  A review of the entry against its sources, raised in the follow-ups of pull request 234, found the error.
  The model card's comparison table, the source for the 0.2-point gap and the LiveCodeBench comparison, compares V4-Pro with Claude Opus 4.6 and not with Claude Opus 4.7, so the summary now names the model and states the figures the table gives.
changed_claim_ids:
  - deepseek-v4-pro-release
triggered_by_case_id: null
author: terry-tang
created_at: '2026-11-15'
---

## Scope

This revision corrects the benchmark comparison in the Summary.
It names Claude Opus 4.6 as the model DeepSeek compared V4-Pro with and gives the SWE-bench Verified and LiveCodeBench figures from that comparison.
The rest of the summary is unchanged.
The What Happened and Why It Matters sections stay as published, below a correction note.
The revision was drafted with AI assistance for the curator's review.

## Event location and identity

Original file: `content/events/2026/30-deepseek-v4-pro-release.md`.
Entry ID: `deepseek-v4-pro-release`.

## Evidence

[DeepSeek-V4-Pro model card](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro), table "DeepSeek-V4-Pro-Max vs Frontier Models."
The table gives SWE-bench Verified (Resolved) as 80.8 for "Opus-4.6 Max" and 80.6 for "DS-V4-Pro Max," and LiveCodeBench (Pass@1) as 88.8 and 93.5.
The archived copy the entry cites has the same figures.
The SWE-bench Verified figures of 87.6% for Claude Opus 4.7 and 89.1% for GPT-5.5 in What Happened do not appear in the two sources that were read, the DeepSeek-V4-Pro model card and Simon Willison's post "DeepSeek V4".
The third source, the Bloomberg article, could not be read behind its paywall.

```yaml
url: https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
title: "DeepSeek-V4-Pro Model Card"
type: official
publisher: DeepSeek AI
date: "2026-04-24"
accessed: "2026-11-15"
archive_url: https://web.archive.org/web/20260427030628/https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
```

## Metadata changes

- `revision.last_reviewed`: 2026-04-27 to 2026-11-15.
- The model card source's `accessed` date stays 2026-04-27; this review read it again on 2026-11-15.

## Original metadata

```yaml
id: deepseek-v4-pro-release
title: "DeepSeek Releases V4-Pro, Open-Weight Frontier Model Trained on Huawei Ascend Chips"
date: 2026-04-24
category: models
significance: major
significance_history:
  - level: notable
    date: 2026-04-27
    reason: Initial rating at publication.
  - level: major
    date: 2026-11-14
    reason: "An open-weight frontier model trained on domestic Chinese chips shifts both the open-weight and export-control landscape."
confidence: high
sources:
  - url: https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
    title: "DeepSeek-V4-Pro Model Card"
    type: official
    publisher: DeepSeek AI
    date: 2026-04-24
    accessed: 2026-04-27
    archive_url: https://web.archive.org/web/20260427030628/https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
  - url: https://www.bloomberg.com/news/articles/2026-04-24/deepseek-unveils-newest-flagship-a-year-after-ai-breakthrough
    title: "DeepSeek Unveils Newest Flagship AI Model a Year after Upending Silicon Valley"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-04-24
    accessed: 2026-04-27
  - url: https://simonwillison.net/2026/Apr/24/deepseek-v4/
    title: "DeepSeek V4"
    type: expert_interpretation
    publisher: Simon Willison
    date: 2026-04-24
    accessed: 2026-04-27
actors:
  - id: deepseek
    role: subject
  - id: huawei
    role: counterparty
regions: [CN, US]
tags: [open-weight, moe, price-compression, chinese-ai, huawei-ascend, mit-license, export-controls, agentic]
threads: [open-vs-closed-weights, chip-export-controls]
related: [deepseek-r1-distill-impact]
state: published
revision:
  created: 2026-04-27
  last_reviewed: 2026-04-27
  draft_assistance: ai-assisted
  final_author: pedro-bright
```
