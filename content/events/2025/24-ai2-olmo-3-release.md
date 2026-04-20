---
id: ai2-olmo-3-release
title: "AI2 Releases OLMo 3 — First Fully Open Frontier Reasoning Model"
date: 2025-11-20
category: open-source
significance: landmark
confidence: high
actors:
  - id: ai2
    role: subject
regions: [US]
tags: [open-weights, reasoning, fully-open, training-data, apache-2]
threads: [open-vs-closed-weights]
sources:
  - url: https://allenai.org/blog/olmo3
    title: "OLMo 3: The First Truly Open Frontier Model with Reasoning"
    type: official
    date: 2025-11-20
  - url: https://arxiv.org/abs/2512.13961
    title: "OLMo 3 Technical Report"
    type: primary_document
    date: 2025-12-18
  - url: https://huggingface.co/allenai/Olmo-3-1125-32B
    title: "OLMo 3 32B Model Page"
    type: primary_document
    date: 2025-11-20
---

## Summary

The Allen Institute for AI released OLMo 3, a family of 7B and 32B models including OLMo 3-Think — the first fully open 32B reasoning model. "Fully open" meant not just released weights, but complete transparency across training data, intermediate checkpoints, training code, and reasoning traces, all under Apache 2.0. The 32B Think variant supported a 65K token context window and demonstrated competitive performance on mathematical and scientific reasoning benchmarks.

## What Happened

AI2 released OLMo 3 on November 20, 2025, in two base sizes — 7B and 32B — with both standard instruct and thinking variants. The OLMo 3-Think 32B was the flagship: a reasoning model trained with a long chain-of-thought curriculum that generated extended scratchpads before producing answers, following the approach popularized by OpenAI o1 and DeepSeek R1.

Crucially, AI2 released every artifact associated with the model under Apache 2.0:
- Full training data (Dolma dataset, with provenance documentation)
- All intermediate training checkpoints at regular intervals throughout the training run
- Complete reasoning traces used in the thinking curriculum
- Training code and configuration files
- Final model weights in multiple quantization formats

This transparency went substantially beyond what any other organization had released for a frontier-class reasoning model. Most open-weight releases at comparable capability levels provided only final weights; training data and intermediate checkpoints were withheld. The 32B Think model supported contexts up to 65K tokens.

AI2 framed the release explicitly as a response to the proliferation of models described as "open" that withheld training data, code, or intermediate states — arguing that reproducing results, verifying safety properties, and conducting independent research required full artifact transparency.

## Why It Matters

OLMo 3 established a higher standard for what "fully open" means in AI development at frontier capability levels. By releasing reasoning traces and intermediate checkpoints alongside final weights, AI2 made it possible for outside researchers to study not just what the model does, but how it was trained to do it — a level of transparency that had not previously existed for a reasoning model of this scale.

The release had direct implications for the open-vs-closed debate: it showed that a nonprofit research lab could build a frontier reasoning model and release it completely, undermining arguments that safety or competitive concerns inherently required withholding training artifacts. It also provided the AI safety community with a fully auditable training run for a reasoning-capable model, enabling research that closed-weight releases precluded.
