---
id: deepseek-v3-0324-release
title: "DeepSeek Silently Uploads V3-0324 Checkpoint, Open Weights Hit Frontier"
date: 2025-03-24
category: open-source
significance: major
confidence: high
actors:
  - id: deepseek
    role: subject
regions: [CN]
tags: [open-weights, moe, frontier-models, benchmark, silent-release]
threads: [open-vs-closed-weights]
sources:
  - url: https://huggingface.co/deepseek-ai/DeepSeek-V3-0324
    title: "DeepSeek-V3-0324 Model Card"
    type: primary_document
    date: 2025-03-24
  - url: https://artificialanalysis.ai/models/deepseek-v3-0324
    title: "DeepSeek-V3-0324 Benchmark Analysis"
    type: secondary_reporting
    date: 2025-03-25
---

## Summary

DeepSeek published an updated V3 checkpoint — DeepSeek-V3-0324 — to Hugging Face without any official announcement, blog post, or press release. Independent benchmarkers discovered the upload and found it delivered massive capability jumps: AIME performance rose from 39.6% to 59.4%, GPQA jumped from 59.1% to 68.4%, and LiveCodeBench from 39.2% to 49.2%. Artificial Analysis declared it the first open-weight model to surpass all non-reasoning proprietary models, including GPT-4o and Claude 3.5 Sonnet.

## What Happened

On March 24, 2025, the model file `DeepSeek-V3-0324` appeared on Hugging Face under DeepSeek's account with an MIT license — no accompanying announcement, technical report, or changelog. The 671-billion parameter mixture-of-experts model activates 37 billion parameters per forward pass and was distributed with full weights available for download.

Community members and benchmarking services discovered the upload within hours and began running evaluations. The results were striking: the model showed roughly 20 percentage point improvements on AIME 2025 math competition problems and nearly 10 percentage point gains on GPQA graduate-level science questions compared to the prior V3 checkpoint. LiveCodeBench coding performance improved by 10 points.

Artificial Analysis, which maintains a comparative leaderboard of models across providers, flagged the checkpoint as the first open-weight model to exceed all commercially available non-reasoning proprietary models on their composite quality score. The MIT license applied to the released weights permitted unrestricted commercial use, redistribution, and fine-tuning.

## Why It Matters

The silent release format itself was significant: by uploading weights without fanfare, DeepSeek bypassed the press cycle that typically accompanies major model releases from Western labs. The absence of a technical report meant performance claims came initially from community benchmarkers rather than the lab itself — yet the results held up across independent evaluations.

The release crystallized what critics of closed development had argued: that the capability gap between open-weight and proprietary frontier models was narrowing faster than industry consensus acknowledged. A Chinese research lab, releasing a model quietly on a Saturday with an MIT license, had reached or surpassed the performance of models that US labs charged per-token API access for.
