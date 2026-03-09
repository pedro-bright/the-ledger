---
id: mistral-7b-release
title: "Mistral AI Releases Mistral 7B via Torrent"
date: 2023-09-27
category: open-source
significance: major
confidence: high
actors:
  - id: mistral
    role: developer
regions: [EU, FR]
tags: [open-weights, small-model, european-ai, efficiency]
threads: [open-vs-closed-weights, scaling-laws-debate]
sources:
  - url: https://mistral.ai/news/announcing-mistral-7b/
    title: "Announcing Mistral 7B"
    type: primary
  - url: https://arxiv.org/abs/2310.06825
    title: "Mistral 7B"
    type: primary
  - url: https://techcrunch.com/2023/09/27/mistral-ai-makes-its-first-large-language-model-free-for-everyone/
    title: "Mistral AI makes its first large language model free for everyone"
    type: secondary
---

## Summary

French AI startup Mistral AI released Mistral 7B, a compact open-weight model that outperformed all existing open models at its size class and rivaled much larger models, demonstrating that European AI labs could compete at the frontier of open-source AI development.

## What Happened

On September 27, 2023, Mistral AI — a French startup founded just four months earlier by former Google DeepMind and Meta researchers — released Mistral 7B by dropping a magnet link on X (formerly Twitter) with no accompanying blog post or press release. The model was released under the permissive Apache 2.0 license with no usage restrictions.

Mistral 7B, with only 7.3 billion parameters, outperformed Llama 2's 13B model across multiple benchmarks and approached the performance of Llama 2's 34B (unreleased) variant. It introduced grouped-query attention (GQA) for faster inference and sliding window attention (SWA) for efficient handling of longer sequences.

The deliberately unconventional release style — a bare torrent link with no fanfare — was widely interpreted as a statement about openness and a rejection of the controlled, marketing-heavy release strategies employed by larger AI labs.

## Why It Matters

Mistral 7B demonstrated that smaller, more efficient models could dramatically close the gap with much larger ones, complicating the "bigger is better" narrative that dominated AI discourse in 2023. This was significant for the scaling laws debate: if architectural innovations could substitute for raw scale, the economics and geopolitics of AI development looked very different.

The release also established Mistral AI as a serious European contender in a field dominated by American and, increasingly, Chinese companies. At the time of release, Mistral had raised €105 million in one of Europe's largest seed rounds, and the company's ability to produce frontier-competitive models with a small team challenged assumptions about the capital requirements for AI development.

Mistral's choice of the Apache 2.0 license — with no restrictions whatsoever on commercial or military use — staked out a maximally permissive position in the open-weights debate, contrasting with Meta's more restrictive Llama license. This created a new benchmark for what "open" meant in AI model releases.
