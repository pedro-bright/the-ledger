---
id: meta-llama-3-release
title: "Meta Releases Llama 3"
date: 2024-04-18
category: open-source
significance: major
confidence: high
actors:
  - id: meta-ai
    role: developer
  - id: yann-lecun
    role: advocate
regions: [US]
tags: [open-weights, large-language-model, frontier-model]
threads: [open-vs-closed-weights, scaling-laws-debate]
sources:
  - url: https://ai.meta.com/blog/meta-llama-3/
    title: "Introducing Meta Llama 3: The most capable openly available LLM to date"
    type: primary
  - url: https://github.com/meta-llama/llama3
    title: "Meta Llama 3 GitHub Repository"
    type: primary
---

## Summary

Meta released Llama 3 in 8B and 70B parameter sizes, claiming it was the most capable openly available model at its release, with significantly improved reasoning and coding capabilities over Llama 2 and competitive performance against proprietary models.

## What Happened

On April 18, 2024, Meta released Llama 3, the third generation of its open-weight large language model family, in 8B and 70B parameter sizes. Meta described it as "the most capable openly available LLM to date," with the 70B model performing competitively with proprietary models like GPT-3.5-turbo and approaching Claude 3 Sonnet on several benchmarks.

Key improvements included a new tokenizer with a 128K vocabulary (4x larger than Llama 2), training on over 15 trillion tokens (7x more data than Llama 2), and support for an 8,192-token context length. The model was trained on a custom-built cluster of 24,000 H100 GPUs, reflecting the enormous compute investment Meta was making in open AI development.

Meta released the models under the Llama 3 Community License, which maintained the commercial use permissions from Llama 2 while updating terms. A larger 400B+ parameter version was announced as in training, previewing the Llama 3.1 release that would follow in July.

## Why It Matters

Llama 3 continued Meta's strategy of using open-weight releases to commoditize the AI model layer — a move that benefited Meta by reducing competitors' API revenue while costing Meta relatively little given its advertising-driven business model. The 8B model, in particular, was capable enough for many production use cases while being small enough to run on consumer hardware, dramatically lowering the barrier to AI deployment.

The scale of compute invested (24,000 H100s) underscored that "open" AI development was not cheap: only a handful of companies worldwide could afford to train models at this scale and then give them away. This created an interesting dynamic where open-weight AI was, paradoxically, only possible because of massive corporate investment — complicating the narrative that open source was the democratizing force its advocates claimed.
