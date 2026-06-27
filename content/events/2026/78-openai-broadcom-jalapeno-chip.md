---
id: openai-broadcom-jalapeno-chip
title: "OpenAI and Broadcom Unveil Jalapeño, OpenAI's First Custom Inference Chip"
date: 2026-06-24
category: industry
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/openai-broadcom-jalapeno-inference-chip/
    title: "OpenAI and Broadcom unveil the LLM-Optimized Intelligence Processor, Jalapeño"
    type: official
    publisher: OpenAI
    date: 2026-06-24
    accessed: 2026-06-27
    archive_url: https://web.archive.org/web/*/https://openai.com/index/openai-broadcom-jalapeno-inference-chip/
  - url: https://techcrunch.com/2026/06/24/openai-unveils-its-first-custom-chip-built-by-broadcom/
    title: "OpenAI unveils its first custom chip, built by Broadcom"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-06-24
    accessed: 2026-06-27
actors:
  - id: openai
    role: subject
  - id: broadcom
    role: counterparty
regions: [US]
tags: [custom-silicon, inference, asic, hardware-independence, chip-design, nvidia-alternatives]
threads: []
related: []
state: published
revision:
  created: 2026-06-27
  last_reviewed: 2026-06-27
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On June 24, 2026, OpenAI and Broadcom announced Jalapeño, an LLM-Optimized Intelligence Processor and OpenAI's first custom silicon. Designed exclusively for inference — serving model outputs at scale rather than training — the chip was developed in approximately nine months, a pace described by the companies as among the fastest for an ASIC at this capability tier. OpenAI stated the chip is intended for deployment by end of 2026 and is the first step in a multi-generation compute platform.

## What Happened

OpenAI and Broadcom jointly announced Jalapeño on June 24, 2026. The chip is a reticle-sized application-specific integrated circuit (ASIC) built by Broadcom under a co-development agreement with OpenAI. The development cycle ran approximately nine months from initial design specifications to tape-out — a compressed timeline relative to typical large-scale ASIC projects, which commonly run three or more years.

Jalapeño is purpose-built for inference: the computational process of running a trained AI model to generate responses for users. It is not designed for the training phase, where models learn from data. OpenAI's stated rationale is that inference workloads have fundamentally different hardware demands than training — emphasizing memory bandwidth, inter-chip networking efficiency, and throughput per watt over the raw FLOP throughput that training-optimized accelerators prioritize. The chip's architecture is organized around LLM-specific operations: memory movement patterns, attention computation, and the network fabric required to distribute serving across large clusters.

OpenAI disclosed that its own models contributed to aspects of the chip's design and optimization process, a detail the company cited as evidence that AI-assisted engineering can compress hardware development timelines. The announcement did not specify which OpenAI models were used in the design workflow or what fraction of design tasks they handled.

Early performance claims, which have not been independently verified, indicate "performance per watt substantially better than current state-of-the-art" — a reference implicitly comparing Jalapeño against Nvidia's H100, H200, and Blackwell-generation accelerators currently deployed at hyperscale. OpenAI stated the chip would be targeted for production deployment by the end of 2026 and represents the first generation in a planned multi-generation custom compute platform.

Broadcom's role is that of ASIC design partner and manufacturer. Broadcom has positioned its XPU (custom accelerator) business as a primary development route for frontier AI labs seeking inference silicon independent of Nvidia, alongside partnerships with Alphabet (for TPUs, historically) and other hyperscalers building custom accelerators.

## Why It Matters

Jalapeño marks OpenAI entering a club previously limited to a small number of companies with the engineering scale and capital to develop custom inference silicon. Google has operated its Tensor Processing Units since 2015. Amazon has deployed Trainium (training) and Inferentia (inference) since 2019 and 2018, respectively. Apple's Neural Engine has been embedded in iPhone chips since the A11 Bionic in 2017. Each of these custom silicon programs reduced the company's dependence on third-party processors for their most compute-intensive workloads, and each generated sustained per-unit cost advantages that compounded over years of production.

For OpenAI, the primary near-term driver is inference cost. The company currently serves ChatGPT to hundreds of millions of users weekly and operates the API underlying a large fraction of commercial AI applications. At the pricing tiers announced for GPT-5.6 — Sol at $30 per million output tokens, Terra at $15, Luna at $6 — the margin between serving cost and revenue is a central business constraint. A chip that reduces inference cost per token, even modestly, at OpenAI's operating scale translates directly into operating margin. The company has not disclosed projected cost reductions from Jalapeño.

The Jalapeño announcement also extends an industry-wide pattern of major AI spenders seeking to reduce concentration of supply in Nvidia. Nvidia's data center compute revenue for the quarter ending in April 2026 was $60.4 billion — up 77% year over year — and the company guided $91 billion in total revenue for the following quarter. Custom silicon programs do not eliminate Nvidia dependency in the near term; they create an alternative lane that grows over years. The Jalapeño program, combined with similar programs from Amazon, Google, and Apple, represents a long-term structural shift in the AI hardware market that Nvidia has acknowledged in investor communications without quantifying as a near-term revenue risk.
