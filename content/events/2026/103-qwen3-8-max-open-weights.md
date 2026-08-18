---
id: qwen3-8-max-open-weights
title: "Alibaba Publishes Open Weights for a Qwen-Max-Class Flagship for the First Time"
date: 2026-08-12
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B
    title: "Qwen3.8-2.4T-A95B Model Card"
    type: primary_document
    publisher: Alibaba
    date: 2026-08-12
    accessed: 2026-08-18
    archive_url: https://web.archive.org/web/*/https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B
  - url: https://huggingface.co/Qwen/Qwen3.8-27B
    title: "Qwen3.8-27B Model Card"
    type: official
    publisher: Alibaba
    date: 2026-08-14
    accessed: 2026-08-18
    archive_url: https://web.archive.org/web/*/https://huggingface.co/Qwen/Qwen3.8-27B
  - url: https://simonwillison.net/2026/Aug/16/qwen-38-27b/
    title: "Qwen 3.8 27B is excellent, but it defaults to wildly overthinking things"
    type: secondary_reporting
    publisher: Simon Willison
    date: 2026-08-16
    accessed: 2026-08-18
actors:
  - id: alibaba
    role: subject
  - id: hugging-face
    role: distribution-partner
regions: [CN]
tags: [open-weights, mixture-of-experts, model-release, chinese-ai, model-licensing, local-inference]
threads: [open-vs-closed-weights]
related: [moonshot-kimi-k3-open-weights, meta-muse-glimmer-open-weights, thinking-machines-inkling-open-weights, qwen3-release]
state: published
revision:
  created: 2026-08-18
  last_reviewed: 2026-08-18
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 12, 2026, Alibaba published downloadable weights for Qwen3.8-2.4T-A95B, a sparse mixture-of-experts model with approximately 2.4 trillion total parameters and 95 billion activated per token.
The model card states that "for the first time, Qwen3.8 brings a Qwen-Max-class model to open release," making it the first of Alibaba's top-tier Max models to be distributed as weights rather than only through a paid API.
The weights carry a model-specific license that requires a separate commercial agreement from operators of model-hosting or AI coding and office-productivity businesses above a revenue threshold, rather than the Apache 2.0 terms Alibaba applies to its smaller models.
A 27-billion-parameter sibling, Qwen3.8-27B, followed on August 14 under Apache 2.0.

## What Happened

The Qwen3.8-2.4T-A95B repository was created on Hugging Face on August 8 and the weights were published on August 12.
The distribution comprises 213 safetensors shards totaling roughly 4.9 terabytes.
The configuration lists a `Qwen3_5MoeForCausalLM` architecture with 512 experts, of which 10 routed experts plus one shared expert are activated per token.
The model card gives a native context length of 262,144 tokens, extensible to approximately 1,010,000, and exposes a `reasoning_effort` parameter with `xhigh`, `medium` and `low` settings.
Unlike the 27B sibling, the Max-class checkpoint is text-only.

The license file is the part of the release that departs most from Alibaba's prior practice.
Qwen has open-weighted the majority of its lineup under Apache 2.0 since the Qwen3 release in April 2025, and Hugging Face's own mid-2026 survey of the Hub found Qwen to be the single largest source of derivative models on the platform.
The Qwen3.8-Max license grants broad rights to use, modify, distribute, sublicense, host and fine-tune the weights, but adds two conditions.
Products or services with more than 100 million monthly active users or more than US$20 million in monthly revenue must display the model name prominently in their user interface.
Separately, a licensee operating a "Model as a Service" or "AI Work Assistant" business whose aggregate revenue exceeds US$50 million over any twelve consecutive months must obtain a separate license from Qwen before any commercial use.
The license text defines "AI Work Assistant" as a product primarily designed for AI-assisted coding or office productivity, and names Alibaba's own Qoder and QwenWork as examples of the category.
Internal use is carved out, provided the model, its outputs and its capabilities are not made available to third parties.

Qwen3.8-27B, published two days later on August 14, is licensed under Apache 2.0 with no equivalent conditions.
It is a 27-billion-parameter model with 64 layers and a hidden dimension of 5,120, arranged in a repeating block of three linear-attention layers followed by one full-attention layer, and it accepts images and video in addition to text.
Its model card reports vendor-run scores of 73.0 on Terminal-Bench 2.1, 61.7 on SWE-bench Pro, 90.3 on LiveCodeBench v6, 89.2 on GPQA Diamond, and 84.3 on OSWorld-Verified for computer use.
None of these figures had been independently replicated at the time of publication.

Adoption diverged sharply between the two.
As of August 18 the 27B model had recorded roughly 665,000 downloads and about 10,900 likes on Hugging Face; the 2.4T Max-class model had recorded roughly 11,200 downloads and about 1,050 likes.
Writing on August 16, Simon Willison reported running a 17 GB quantized build of the 27B locally on a 128 GB MacBook Pro and an NVIDIA DGX Spark, and criticized the `xhigh` reasoning default as "absolutely not a good way to run the model" on consumer hardware — one test consumed 22,276 reasoning tokens over 21 minutes to produce output that took 137 seconds with reasoning disabled.
He accessed the 2.4T model through a third-party inference provider rather than running it.

## Why It Matters

Publishing a Max-tier checkpoint closes a gap that had defined Alibaba's strategy since Qwen3: strong open weights below the frontier, with the flagship reserved for the API.
That pattern is common across laboratories in both the United States and China, and its erosion at Alibaba is a datapoint about where the commercial line is being drawn rather than a general reversal.
Alibaba is not the first to publish weights at this scale — Moonshot AI released the 2.8-trillion-parameter Kimi K3 in July 2026 — but Moonshot's flagship and its open release were the same artifact, whereas Alibaba is now publishing the model that also backs a paid endpoint.

The license is the more durable signal.
Alibaba built its position on the Hub largely through Apache 2.0 releases, and the choice to gate the flagship behind a revenue-triggered separate-license requirement — aimed specifically at inference providers and at coding and office assistants, the category Alibaba's own Qoder and QwenWork occupy — indicates that "open weights" at the top tier is being treated as a distribution channel with competitive carve-outs rather than an unconditional grant.
Whether this becomes the norm for frontier-scale open releases is not yet established; Moonshot also used a custom license for Kimi K3, while Meta moved in the opposite direction with Apache 2.0 for the smaller Muse Glimmer in August 2026.

The download figures show the practical limit of the release.
A 4.9-terabyte checkpoint requiring multi-node serving is not something the community that drives Qwen's derivative ecosystem can run, and the 60-to-1 gap in downloads between the 27B and the Max-class model reflects that.
The immediate beneficiaries are well-capitalized inference providers and research groups with cluster access — which is also the population the license's separate-agreement clause is written to reach.
What the release does supply, and what the API never could, is an inspectable frontier-scale artifact: the weights, the router configuration and the expert allocation of a 2.4-trillion-parameter production model are now available for study regardless of who can afford to serve it.
