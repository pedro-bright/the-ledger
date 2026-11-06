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
    title: Mistral 7B
    type: primary_document
    publisher: Mistral AI
    date: '2023-09-27'
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261014093018/https://mistral.ai/news/announcing-mistral-7b/
  - url: https://arxiv.org/abs/2310.06825
    title: Mistral 7B
    type: primary
  - url: https://techcrunch.com/2023/09/27/mistral-ai-makes-its-first-large-language-model-free-for-everyone/
    title: Mistral AI makes its first large language model free for everyone
    type: secondary
revision:
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

Mistral AI released Mistral 7B on September 27, 2023.
Mistral reported that the 7.3B-parameter model outperformed Llama 2 13B on its benchmark suite and compared favorably with Llama 1 34B on many benchmarks.
The 34B baseline was from the first Llama generation; Llama 2 34B had not been released.

## Editorial correction, October&nbsp;26,&nbsp;2026

The primary announcement explicitly identifies Llama 1 34B and explains why it did not use Llama 2 34B.
The original body's comparison with an unreleased Llama 2 34B variant is corrected in the canonical summary.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-mistral-7b-release-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

On September 27, 2023, Mistral AI — a French startup founded just four months earlier by former Google DeepMind and Meta researchers — released Mistral 7B by dropping a magnet link on X (formerly Twitter) with no accompanying blog post or press release. The model was released under the permissive Apache 2.0 license with no usage restrictions.

Mistral 7B, with only 7.3 billion parameters, outperformed Llama 2's 13B model across multiple benchmarks and approached the performance of Llama 2's 34B (unreleased) variant. It introduced grouped-query attention (GQA) for faster inference and sliding window attention (SWA) for efficient handling of longer sequences.

The deliberately unconventional release style — a bare torrent link with no fanfare — was widely interpreted as a statement about openness and a rejection of the controlled, marketing-heavy release strategies employed by larger AI labs.

## Why It Matters

Mistral 7B demonstrated that smaller, more efficient models could dramatically close the gap with much larger ones, complicating the "bigger is better" narrative that dominated AI discourse in 2023. This was significant for the scaling laws debate: if architectural innovations could substitute for raw scale, the economics and geopolitics of AI development looked very different.

The release also established Mistral AI as a serious European contender in a field dominated by American and, increasingly, Chinese companies. At the time of release, Mistral had raised €105 million in one of Europe's largest seed rounds, and the company's ability to produce frontier-competitive models with a small team challenged assumptions about the capital requirements for AI development.

Mistral's choice of the Apache 2.0 license — with no restrictions whatsoever on commercial or military use — staked out a maximally permissive position in the open-weights debate, contrasting with Meta's more restrictive Llama license. This created a new benchmark for what "open" meant in AI model releases.
