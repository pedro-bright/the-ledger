---
id: deepseek-v4-pro-release
title: "DeepSeek Releases V4-Pro, Open-Weight Frontier Model Trained on Huawei Ascend Chips"
date: 2026-04-24
category: models
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
    title: "DeepSeek-V4-Pro Model Card"
    type: official
    publisher: DeepSeek AI
    date: 2026-04-24
    accessed: 2026-04-27
    archive_url: https://web.archive.org/web/*/https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
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
threads: []
related: [deepseek-r1-distill-impact]
state: published
revision:
  created: 2026-04-27
  last_reviewed: 2026-04-27
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On April 24, 2026 — one year after DeepSeek's V3 model destabilized AI market valuations across the United States — DeepSeek released DeepSeek-V4-Pro and DeepSeek-V4-Flash as open-weight production models under the MIT license. V4-Pro, with 1.6 trillion total parameters and 49 billion active per inference step, scored within 0.2 percentage points of Claude Opus 4.7 on SWE-bench Verified and outperformed it on LiveCodeBench, while offering API pricing at approximately one-seventh of comparable Western model rates. Training was conducted in part on Huawei Ascend 950 chips operating in "Supernode" cluster configurations — the first publicly confirmed instance of a frontier-adjacent model trained on Chinese domestic silicon operating under US export controls.

## What Happened

DeepSeek released two models on April 24. DeepSeek-V4-Pro is a Mixture-of-Experts architecture with 1.6 trillion total parameters, of which 49 billion activate per token during inference. DeepSeek-V4-Flash is a lighter variant at 284 billion parameters with 13 billion active per token. Both support a one-million-token context window and are available as open weights under the MIT license — permitting unrestricted commercial use, modification, and redistribution without DeepSeek authorization.

The central architectural innovation is a hybrid attention mechanism interleaving Compressed Sparse Attention (CSA) and Heavily Compressed Attention (HCA) across transformer layers. At a one-million-token context, V4-Pro requires approximately 27% of the inference compute and 10% of the key-value cache of DeepSeek-V3.2, its predecessor. The reduction makes million-token inference economically feasible at production scale without dedicated specialized hardware.

V4-Pro pretraining used 33 trillion tokens. On SWE-bench Verified — the standard benchmark for autonomous resolution of GitHub software engineering issues — V4-Pro scored 80.6%, placing it within 8.5 percentage points of GPT-5.5's 89.1% and within 7 percentage points of Claude Opus 4.7's 87.6%, while substantially outperforming the next-highest open-weight models. On LiveCodeBench, V4-Pro scored 93.5% against Claude Opus 4.7's 88.8%. On Codeforces rating, V4-Pro reached 3206, among the highest published for any model at release.

DeepSeek's API pricing at release was $1.74 per million input tokens and $3.48 per million output tokens, with a 75% promotional discount active through May 5, 2026 reducing the promotional output price to $0.87 per million tokens. Standard US-based output token pricing from comparable models ranged from $12 to $30 per million tokens at the same date. The cache-hit promotional price was approximately $0.0036 per million input tokens.

Training was conducted using Huawei's "Supernode" infrastructure: clusters of Huawei Ascend 950 chips connected via Huawei's proprietary high-bandwidth interconnect. Bloomberg and the model card both confirm this as the compute platform for V4. US export controls enacted in October 2022 — and subsequently tightened — blocked Chinese AI labs from purchasing NVIDIA A100 and H100 GPUs for training. Huawei's Ascend series is the primary available domestic alternative; its suitability for frontier-scale training had been debated but not publicly demonstrated with verifiable performance benchmarks prior to V4.

The technical report is accessible via the HuggingFace model repository. Both models were available for download and via the DeepSeek API from the date of release. On April 27, DeepSeek announced a 75% promotional pricing reduction, triggering Bloomberg to describe the move as initiating a fresh round of the Chinese AI price war.

## Why It Matters

DeepSeek V4-Pro extended a pattern that began with V3 and R1 in early 2026 (see Event 01: DeepSeek R1 Distillation Impact): DeepSeek periodically compresses the price-performance frontier for AI inference by releasing open-weight models competitive with Western closed-source leaders. V4-Pro's release is historically distinct from prior DeepSeek releases in two specific respects.

First, V4-Pro achieves the smallest gap yet between an open-weight model and the leading closed models on software engineering benchmarks. A 0.2-percentage-point gap on SWE-bench Verified against Claude Opus 4.7 means the primary benchmark used to justify enterprise coding AI subscriptions no longer shows a practically meaningful advantage for the leading closed model. Enterprises procuring AI for code-heavy workflows now have a publicly verifiable open-weight alternative within statistical noise of the closed-model leader. Combined with the MIT license — which permits unrestricted commercial deployment and fine-tuning — this removes the principal justification for paying Western frontier model API rates for coding-heavy enterprise workloads.

Second, the confirmed use of Huawei Ascend 950 chips in training-scale configurations is a documented data point on the efficacy of China's domestic semiconductor program under export controls. Prior to V4, it was not publicly confirmed that Chinese AI labs could train frontier-adjacent models on domestic silicon with performance competitive against NVIDIA H100 or H200 training results. V4-Pro's benchmark performance, combined with the disclosed Huawei training infrastructure, provides the first strong public evidence that the US export control regime has not prevented Chinese frontier AI development — it has instead accelerated domestic Chinese chip adoption for AI workloads.

What remains unknown: the full training compute cost and duration for V4-Pro on Huawei Ascend hardware versus NVIDIA equivalents; whether the remaining benchmark gap to GPT-5.5 reflects architectural limitations or addressable training resource differences; and whether DeepSeek's open-weight release strategy is economically sustainable, given that it depresses the API pricing floor for the broader industry while simultaneously enabling competitors to fine-tune V4-Pro for targeted applications.
