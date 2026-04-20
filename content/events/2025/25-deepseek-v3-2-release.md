---
id: deepseek-v3-2-release
title: "DeepSeek Releases V3.2 and V3.2-Speciale with Sparse Attention"
date: 2025-12-01
category: open-source
significance: landmark
confidence: high
actors:
  - id: deepseek
    role: subject
regions: [CN]
tags: [open-weights, moe, reasoning, agents, math-olympiad, sparse-attention]
threads: [open-vs-closed-weights]
sources:
  - url: https://api-docs.deepseek.com/news/news251201
    title: "DeepSeek V3.2 Release Notes"
    type: official
    date: 2025-12-01
  - url: https://huggingface.co/deepseek-ai/DeepSeek-V3.2
    title: "DeepSeek-V3.2 Model Card"
    type: primary_document
    date: 2025-12-01
  - url: https://simonwillison.net/2025/Dec/1/deepseek-v32/
    title: "DeepSeek V3.2 release notes"
    type: secondary_reporting
    date: 2025-12-01
---

## Summary

DeepSeek released V3.2, a 685-billion parameter mixture-of-experts model activating 37 billion parameters per forward pass, featuring a new DeepSeek Sparse Attention mechanism that reduced inference costs by 50–75% compared to standard attention at long contexts. Alongside the open-weight release, DeepSeek deployed V3.2-Speciale — an API-only variant with additional training — which achieved gold medal performance at the International Mathematical Olympiad, the China Mathematical Olympiad, the ICPC World Finals, and the International Olympiad in Informatics 2025. Math scores on AIME 2025 surpassed GPT-5 High.

## What Happened

On December 1, 2025, DeepSeek published V3.2 weights on Hugging Face with full MIT licensing. The 685B MoE architecture maintained the 37B active parameter count of prior V3 checkpoints but introduced DeepSeek Sparse Attention (DSA), an architectural modification to the attention mechanism that achieved computational savings of 50–75% at the long-context lengths increasingly common in production deployment. This translated directly to lower inference cost per token for users self-hosting the model.

Simultaneously, DeepSeek announced V3.2-Speciale as an API-only service with additional post-training steps not included in the public weights. This bifurcation — open base model, enhanced closed variant — was a new pattern in DeepSeek's release strategy. V3.2-Speciale's performance on competitive mathematics and programming was exceptional: it achieved gold medal performance at all four of the world's premier student computing and mathematics competitions in 2025. On AIME 2025, it posted scores exceeding GPT-5 High, a result DeepSeek described as the first time a Chinese-built model had surpassed OpenAI's flagship on the benchmark.

## Why It Matters

The V3.2 release had layered significance. The open-weight component demonstrated that frontier MoE architecture with genuine inference efficiency innovations could be released under MIT — reinforcing that architectural research, not just scaling, was occurring in the open-source Chinese AI ecosystem.

The V3.2-Speciale performance on mathematical olympiads was a more pointed statement: a model had achieved gold medal human expert performance on the world's hardest mathematics and programming competitions. For the open-vs-closed debate, the bifurcated release crystallized a new competitive dynamic — labs releasing open weights as a foundation while retaining API-only enhancements — raising questions about whether the gap between public and private model capability was reopening after a period of convergence.
