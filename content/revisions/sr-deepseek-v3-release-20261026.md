---
id: sr-deepseek-v3-release-20261026
target_summary_id: deepseek-v3-release
prior_version: >-
  Chinese AI lab DeepSeek released DeepSeek-V3, a 671-billion parameter Mixture-of-Experts model trained for approximately $5.6 million that performed competitively with GPT-4o and Claude 3.5 Sonnet.
  The release challenged Western assumptions about the compute requirements for frontier AI development and the effectiveness of US export controls on advanced AI chips.
new_version: |-
  DeepSeek released DeepSeek-V3 on December 26, 2024, a 671B-parameter mixture-of-experts model with 37B parameters activated per token.
  DeepSeek reported $5.576 million in compute costs for the official training run, including pre-training, context extension, and post-training, at an assumed $2 per H800 GPU-hour; this excluded prior research and ablation experiments.
  The code used the MIT license, while the model weights were governed by a separate DeepSeek Model License that allowed commercial use.
reason: >-
  DeepSeek's preserved release commit is dated December 26, 2024 at 11:01:57 UTC; the original December 25 date has no documented timezone basis in this record.
  The technical report's Table 1 distinguishes $5.328 million for pre-training from $5.576 million for the full official training run, excluding prior research and ablations.
  The release README distinguishes MIT-licensed code from separately licensed weights; the original body's MIT-derivative/fully-open characterization should not be relied on.
changed_claim_ids:
  - deepseek-v3-release
author: codex-ai-assisted
created_at: "2026-10-26"
---

## Scope

DeepSeek's preserved release commit is dated December 26, 2024 at 11:01:57 UTC; the original December 25 date has no documented timezone basis in this record.
The technical report's Table 1 distinguishes $5.328 million for pre-training from $5.576 million for the full official training run, excluding prior research and ablations.
The release README distinguishes MIT-licensed code from separately licensed weights; the original body's MIT-derivative/fully-open characterization should not be relied on.

This AI-assisted revision was prepared under Terry Tang's approval of the 22 editorial findings.
It records the correction and its evidence without claiming a new human review of the retained narrative.

## Event location and identity

Original file: `content/events/2024/17-deepseek-v3-release.md`.
Current file: [`content/events/2024/17-deepseek-v3-release.md`](https://github.com/pedro-bright/the-ledger/blob/main/content/events/2024/17-deepseek-v3-release.md).
The event ID remains `deepseek-v3-release`; its public URL is [unchanged](https://the-ledger.net/events/deepseek-v3-release/).

## Evidence

[Release DeepSeek-V3 (release commit, December 26, 2024)](https://github.com/deepseek-ai/DeepSeek-V3/commit/4c2fdb8f55e049553b9f4f1a3241f86d739c8cf8).

```yaml
url: https://github.com/deepseek-ai/DeepSeek-V3/commit/4c2fdb8f55e049553b9f4f1a3241f86d739c8cf8
title: Release DeepSeek-V3 (release commit, December 26, 2024)
type: primary_document
publisher: DeepSeek
date: "2024-12-26"
accessed: "2026-10-26"
archive_url: https://web.archive.org/web/20260805070954/https://github.com/deepseek-ai/DeepSeek-V3/commit/4c2fdb8f55e049553b9f4f1a3241f86d739c8cf8
```

[DeepSeek-V3 Technical Report (v1)](https://arxiv.org/abs/2412.19437v1).

```yaml
url: https://arxiv.org/abs/2412.19437v1
title: DeepSeek-V3 Technical Report (v1)
type: primary_document
publisher: DeepSeek-AI
date: "2024-12-27"
accessed: "2026-10-26"
archive_url: https://web.archive.org/web/20260923214756/https://arxiv.org/abs/2412.19437v1
```

[DeepSeek-V3 release README: code and model licenses](https://github.com/deepseek-ai/DeepSeek-V3/blob/e2c15caf041dc0809f616349fa145e56ac2b72aa/README.md).

```yaml
url: https://github.com/deepseek-ai/DeepSeek-V3/blob/e2c15caf041dc0809f616349fa145e56ac2b72aa/README.md
title: "DeepSeek-V3 release README: code and model licenses"
type: primary_document
publisher: DeepSeek
accessed: "2026-10-26"
```

No Wayback capture of this pinned README was available on October 26, 2026; its commit-pinned permalink is the stable copy for this citation.

## Original metadata

This snapshot preserves the title, date, source metadata, and review fields before this revision.
The original narrative from `## What Happened` onward remains verbatim in the event.

```yaml
id: deepseek-v3-release
title: "DeepSeek Releases DeepSeek-V3, High-Performance Open-Weight Model"
date: 2024-12-25
category: open-source
significance: major
confidence: high
actors:
  - id: chinese-government
    role: regulatory-context
regions: [CN, US]
tags: [open-weights, chinese-ai, efficiency, mixture-of-experts, cost-efficiency]
threads: [open-vs-closed-weights, scaling-laws-debate]
sources:
  - url: https://github.com/deepseek-ai/DeepSeek-V3
    title: "DeepSeek-V3 GitHub Repository"
    type: primary
  - url: https://arxiv.org/abs/2412.19437
    title: "DeepSeek-V3 Technical Report"
    type: primary
```
