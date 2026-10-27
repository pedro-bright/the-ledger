---
id: deepseek-v3-release
title: "DeepSeek Releases DeepSeek-V3, High-Performance Open-Weight Model"
date: '2024-12-26'
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
    title: DeepSeek-V3 GitHub Repository
    type: primary
  - url: https://arxiv.org/abs/2412.19437
    title: DeepSeek-V3 Technical Report
    type: primary
  - url: https://github.com/deepseek-ai/DeepSeek-V3/commit/4c2fdb8f55e049553b9f4f1a3241f86d739c8cf8
    title: Release DeepSeek-V3 (release commit, December 26, 2024)
    type: primary_document
    publisher: DeepSeek
    date: '2024-12-26'
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20260805070954/https://github.com/deepseek-ai/DeepSeek-V3/commit/4c2fdb8f55e049553b9f4f1a3241f86d739c8cf8
  - url: https://arxiv.org/abs/2412.19437v1
    title: DeepSeek-V3 Technical Report (v1)
    type: primary_document
    publisher: DeepSeek-AI
    date: '2024-12-27'
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20260923214756/https://arxiv.org/abs/2412.19437v1
  - url: https://github.com/deepseek-ai/DeepSeek-V3/blob/e2c15caf041dc0809f616349fa145e56ac2b72aa/README.md
    title: 'DeepSeek-V3 release README: code and model licenses'
    type: primary_document
    publisher: DeepSeek
    accessed: '2026-10-26'
revision:
  draft_assistance: ai-assisted
---

## Summary

DeepSeek released DeepSeek-V3 on December 26, 2024, a 671B-parameter mixture-of-experts model with 37B parameters activated per token.
DeepSeek reported $5.576 million in compute costs for the official training run, including pre-training, context extension, and post-training, at an assumed $2 per H800 GPU-hour; this excluded prior research and ablation experiments.
The code used the MIT license, while the model weights were governed by a separate DeepSeek Model License that allowed commercial use.

## Editorial correction (2026-10-26)

DeepSeek's preserved release commit is dated December 26, 2024 at 11:01:57 UTC; the original December 25 date has no documented timezone basis in this record.
The technical report's Table 1 distinguishes $5.328 million for pre-training from $5.576 million for the full official training run, excluding prior research and ablations.
The release README distinguishes MIT-licensed code from separately licensed weights; the original body's MIT-derivative/fully-open characterization should not be relied on.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-deepseek-v3-release-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

On December 25, 2024, DeepSeek released DeepSeek-V3, a large open-weight model using a Mixture-of-Experts architecture with 671 billion total parameters (37 billion active per token). The model was trained on 14.8 trillion tokens using 2,048 NVIDIA H800 GPUs — a version of the H100 modified to comply with US export restrictions on advanced AI chips to China.

The most striking aspect of the release was the reported training cost: approximately $5.6 million, a fraction of the estimated hundreds of millions spent on comparable Western models. DeepSeek attributed this efficiency to architectural innovations including Multi-head Latent Attention (MLA) for efficient inference and DeepSeekMoE for efficient training.

DeepSeek-V3 performed competitively with leading proprietary models on standard benchmarks, particularly excelling in math and coding tasks. It was released under an MIT-derivative license, making it one of the most capable fully open models available.

## Why It Matters

DeepSeek-V3 sent shockwaves through the Western AI industry for two reasons. First, it demonstrated that frontier-competitive AI models could be developed at a fraction of the cost that Western labs were spending — raising uncomfortable questions about whether the billions being invested in Western AI development were efficiently allocated.

Second, it challenged the premise of US export controls on advanced AI chips. The US government had restricted exports of NVIDIA's most advanced GPUs to China precisely to slow Chinese AI development. DeepSeek's ability to train a competitive model using the less powerful H800s, through architectural efficiency, suggested that export controls were a less effective bottleneck than policymakers had assumed.

The release previewed the seismic impact that DeepSeek-R1 would have just weeks later, and began reshaping assumptions about the relationship between compute spending and AI capability — a central question in the scaling laws debate.
