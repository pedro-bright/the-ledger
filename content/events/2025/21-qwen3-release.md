---
id: qwen3-release
title: "Alibaba Releases Qwen3 with Native Hybrid Reasoning"
date: 2025-04-28
category: open-source
significance: major
confidence: high
actors:
  - id: alibaba
    role: subject
regions: [CN]
tags: [open-weights, reasoning, moe, hybrid-thinking, multilingual]
threads: [open-vs-closed-weights]
sources:
  - url: https://qwenlm.github.io/blog/qwen3/
    title: "Qwen3: Think Deeper, Act Faster"
    type: official
    date: 2025-04-28
  - url: https://arxiv.org/abs/2505.09388
    title: "Qwen3 Technical Report"
    type: primary_document
    date: 2025-05-14
  - url: https://huggingface.co/Qwen/Qwen3-235B-A22B
    title: "Qwen3-235B-A22B Model Card"
    type: primary_document
    date: 2025-04-28
---

## Summary

Alibaba released Qwen3, a family of eight open-weight models — six dense ranging from 0.6B to 32B, and two mixture-of-experts models at 30B-A3B and 235B-A22B — all under Apache 2.0. The family introduced a native hybrid thinking mode that allows models to switch between extended chain-of-thought reasoning and fast non-reasoning responses at inference time, the first open-source model family to offer this capability. The flagship 235B-A22B model was pretrained on 36 trillion tokens.

## What Happened

On April 28, 2025, the Qwen team released the full Qwen3 family simultaneously across Hugging Face. The eight models covered a wide deployment spectrum: the 0.6B and 1.7B dense models target edge devices, while the 235B-A22B MoE was designed for high-capability server deployment activating 22 billion parameters per forward pass.

The defining architectural feature was the hybrid thinking switch: every Qwen3 model could operate in "thinking" mode — generating an extended scratchpad before answering — or "non-thinking" mode for direct fast responses. The switch was controllable at inference time via a system prompt or API parameter, without requiring separate model checkpoints. This contrasted with contemporaneous approaches that required separate "reasoning" and "non-reasoning" model variants.

The 235B-A22B flagship was trained on 36 trillion tokens, making it one of the most data-intensive open-weight pretrains to date. All models used Apache 2.0 licensing with no restrictions on commercial use, distillation, or redistribution. The technical report published in May detailed the training curriculum, including multiple stages that progressively incorporated long-context data, code, and mathematical reasoning material.

## Why It Matters

Qwen3 collapsed the distinction between reasoning and non-reasoning model tiers into a single deployable artifact. Until this release, accessing extended chain-of-thought reasoning required either a dedicated reasoning model or a separate API endpoint — both often with higher latency and cost. By baking the mode switch into a unified model, Qwen3 reduced deployment complexity for developers who needed both fast responses and deep reasoning from the same system.

The release also demonstrated that Apache 2.0 open-weight models could remain competitive with frontier closed APIs on reasoning benchmarks. For the open-vs-closed debate, Qwen3 represented further evidence that capability differentiation — once considered a durable moat for proprietary labs — was eroding rapidly as open training runs scaled.
