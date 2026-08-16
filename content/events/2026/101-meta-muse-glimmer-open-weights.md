---
id: meta-muse-glimmer-open-weights
title: "Meta Releases Muse Glimmer, a 30B Open-Weight Agentic Model Under Apache 2.0"
date: 2026-08-10
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/meta-models/Muse-Glimmer-30B
    title: "Muse-Glimmer-30B Model Card"
    type: official
    publisher: Meta
    date: 2026-08-10
    accessed: 2026-08-16
    archive_url: https://web.archive.org/web/*/https://huggingface.co/meta-models/Muse-Glimmer-30B
  - url: https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model
    title: "Introducing Muse Glimmer: An Open Agentic Model That Runs on Your Device"
    type: official
    publisher: Meta
    date: 2026-08-10
    accessed: 2026-08-16
    archive_url: https://web.archive.org/web/*/https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model
  - url: https://techcrunch.com/2026/08/10/metas-new-glimmer-ai-model-offers-a-hint-at-zuckerbergs-personal-intelligence-vision/
    title: "Meta's new Glimmer AI model offers a hint at Zuckerberg's personal intelligence vision"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-08-10
    accessed: 2026-08-16
actors:
  - id: meta
    role: subject
  - id: hugging-face
    role: distribution-partner
  - id: mark-zuckerberg
    role: commentator
regions: [US]
tags: [open-weights, apache-2-0, agentic-ai, local-inference, multimodal, meta-superintelligence-labs]
threads: []
related: [meta-muse-spark-1-1, thinking-machines-inkling-open-weights, moonshot-kimi-k3-open-weights, anthropic-open-weights-policy-position]
state: published
revision:
  created: 2026-08-16
  last_reviewed: 2026-08-16
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 10, 2026, Meta released Muse Glimmer, a roughly 29.6-billion-parameter multimodal model built for agentic tasks, and published the weights on Hugging Face under the Apache 2.0 license.
Meta sized the model to run on a single consumer GPU, publishing quantized configurations that fit in 24 GB and 32 GB of VRAM alongside a 64 GB full-precision configuration.
The release followed Muse Spark 1.1, which Meta had launched a month earlier as a closed model behind its first paid API.

## What Happened

Meta Superintelligence Labs described Muse Glimmer as a dense causal transformer with 52 layers and a hidden dimension of 6,656, paired with a roughly 1.8-billion-parameter ViT-G/14 perception encoder.
The model card lists a context length of 131,072 tokens or more, a vocabulary of 202,048 tokens, support for more than 100 languages, and a knowledge cutoff of January 4, 2026.
It accepts interleaved text and images and produces text.

The published hardware configurations were central to the release framing.
Meta reported a BF16 full-precision footprint requiring 64 GB of VRAM, a dynamic K-quantized configuration at 32 GB with a stated 0.2 percent degradation, and a 17 GB K-quantized configuration at 24 GB with a stated 1.0 percent degradation.
The model card reports throughput with speculative decoding of 233.4 tokens per second on an RTX 5090, 37.8 tokens per second on an Apple M4 Max, and 50.2 tokens per second on an Apple M5 Max.
Meta said documentation and optimized integrations for llama.cpp, MLX and ExecuTorch would follow in subsequent days.

Meta stated the model was trained and evaluated for end-to-end agentic task completion, multi-step reasoning, tool and function calling against precise schemas, and failure recovery.
It positioned the intended uses as local coding agents, always-on local agent workflows and evaluation as an LLM judge.
In its announcement Meta said the release kept with "our long tradition of sharing fundamental AI research" and argued that "the open source community has shown that smaller models, when trained effectively, can approach frontier-level performance on targeted tasks."

The Apache 2.0 license is more permissive than the community licenses Meta previously applied to its Llama models, placing no acceptable-use or monthly-active-user conditions on downstream deployment.
Meta did not publish training data documentation, and the benchmark figures accompanying the release were vendor-reported without independent replication at the time of publication.

## Why It Matters

The release is a partial reversal of the direction Meta signaled in July, when it launched Muse Spark 1.1 as a closed agentic model behind its first paid model API.
Publishing an open-weight sibling under Apache 2.0 six weeks later indicates a two-track posture rather than a wholesale return to open distribution: the frontier agentic model remains commercial and closed, while a smaller model sized for local execution is given away with minimal license restrictions.
Whether this is a durable strategy or a competitive response to open-weight releases from Chinese and independent laboratories is not established by the available evidence.

The hardware framing matters more than the parameter count.
A capable agentic model that runs within 24 GB of consumer VRAM shifts some agent workloads off metered API endpoints, which weakens the assumption that agentic capability implies a recurring inference bill and a provider able to log activity.
That has consequences for cost structures, for offline and privacy-sensitive deployments, and for enforcement mechanisms that depend on provider-side monitoring of agent behavior.

The claims remain company-reported.
The degradation figures for quantized configurations, the throughput measurements and the agentic capability claims were published by Meta without third-party verification, and the release included no training data disclosure.
The event's importance will depend on whether independent evaluations confirm that a 30-billion-parameter local model performs reliably on multi-step agentic tasks, and on whether Meta continues to release open weights at this tier as its commercial model line advances.
