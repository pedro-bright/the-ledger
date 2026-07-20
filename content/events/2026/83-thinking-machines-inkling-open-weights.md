---
id: thinking-machines-inkling-open-weights
title: "Thinking Machines Lab Releases Inkling, Its First Open-Weights Model"
date: 2026-07-15
category: open-source
significance: notable
confidence: high
sources:
  - url: https://thinkingmachines.ai/news/introducing-inkling/
    title: "Inkling: Our open-weights model"
    type: official
    publisher: Thinking Machines Lab
    date: 2026-07-15
    accessed: 2026-07-20
    archive_url: https://web.archive.org/web/*/https://thinkingmachines.ai/news/introducing-inkling/
  - url: https://thinkingmachines.ai/model-card/inkling/
    title: "Inkling Model Card"
    type: primary_document
    publisher: Thinking Machines Lab
    date: 2026-07-15
    accessed: 2026-07-20
    archive_url: https://web.archive.org/web/*/https://thinkingmachines.ai/model-card/inkling/
  - url: https://techcrunch.com/2026/07/15/thinking-machines-amps-up-its-bet-against-one-size-fits-all-ai-with-its-first-open-model-inkling/
    title: "Thinking Machines amps up its bet against one-size-fits-all AI with its first open model, Inkling"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-07-15
    accessed: 2026-07-20
actors:
  - id: thinking-machines
    role: subject
regions: [US]
tags: [open-weights, multimodal, mixture-of-experts, model-release, customization, frontier-models]
threads: [open-vs-closed-weights]
related: [thinking-machines-2b-seed]
state: published
revision:
  created: 2026-07-20
  last_reviewed: 2026-07-20
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On July 15, 2026, Thinking Machines Lab released Inkling, its first model trained from scratch and its first publicly downloadable model weights.
Inkling is a multimodal mixture-of-experts transformer with 975 billion total parameters, 41 billion active parameters per token, and a context window of up to one million tokens.
The company released BF16 and NVFP4 checkpoints under the Apache 2.0 license while stating that Inkling was intended as a customizable base rather than the strongest model available.

## What Happened

Thinking Machines Lab announced Inkling after approximately a year and a half of operating primarily through research publications and its Tinker model-customization service.
The release was the laboratory's first public foundation model and the first direct evidence of the model-training program established by former OpenAI chief technology officer Mira Murati and other former frontier-lab researchers.

Inkling uses a 66-layer decoder-only architecture with 256 routed experts and two shared experts.
Each token activates six routed experts plus the shared experts, producing 41 billion active parameters from a model containing 975 billion total parameters.
The model accepts text, images, and audio, produces text output, and supports up to one million tokens of context.
Thinking Machines reported that it pretrained the model on 45 trillion tokens drawn from text, image, audio, and video data.

The weights were released under Apache 2.0 in two formats.
The BF16 checkpoint requires at least two terabytes of aggregate GPU memory, while the NVFP4 checkpoint requires at least 600 gigabytes.
Thinking Machines also made the model available through Tinker and third-party inference providers and published launch integrations for Hugging Face, SGLang, vLLM, llama.cpp, and other serving frameworks.
A preview of Inkling-Small, with 12 billion active parameters, accompanied the full release but was not presented as the principal model.

The company stated that Inkling was not the strongest open or closed model available at launch.
Its model card reported internal performance across reasoning, coding, tool-use, multimodal, and safety evaluations, but those results had not been independently replicated.
Thinking Machines also disclosed that open-weight models, including Moonshot AI's Kimi K2.5, contributed to some early post-training data before the company shifted to large-scale reinforcement learning.

## Why It Matters

Inkling marked Thinking Machines Lab's transition from a heavily financed research startup to a laboratory with a publicly inspectable model artifact.
The release also added a permissively licensed, natively multimodal model at a scale previously available mainly through proprietary APIs, giving researchers and organizations the ability to fine-tune and modify the weights without relying on a single hosted provider.

The hardware requirements limit what open access means in practice.
Running the full checkpoint requires a multi-GPU server or cluster beyond the reach of most individuals, so access to the weights does not imply broad local usability.
The likely near-term users are research institutions, infrastructure providers, and enterprises able to operate or rent large inference systems.

The release tests Thinking Machines' argument that customization can be a primary competitive axis rather than an auxiliary feature of a centrally operated model.
What remains unknown is whether independently reproduced evaluations will support the company's performance claims, whether organizations will adopt the model at a scale that sustains the Tinker business, and how safety controls will vary once downstream operators modify the weights.
