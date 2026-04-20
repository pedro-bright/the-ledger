---
id: anthropic-claude-haiku-4-5-release
title: "Anthropic Releases Claude Haiku 4.5 at Sonnet-4-Tier Coding Performance"
date: 2025-10-15
category: models
significance: notable
confidence: high
actors:
  - id: anthropic
    role: subject
regions: [US]
tags: [frontier-models, coding, cost-efficiency, swe-bench, speed]
threads: [open-vs-closed-weights]
sources:
  - url: https://www.anthropic.com/news/claude-haiku-4-5
    title: "Claude Haiku 4.5"
    type: official
    date: 2025-10-15
  - url: https://www.marktechpost.com/2025/10/15/anthropic-launches-claude-haiku-4-5-small-ai-model-that-delivers-sonnet-4-level-coding-performance-at-one-third-the-cost-and-more-than-twice-the-speed/
    title: "Anthropic Launches Claude Haiku 4.5: Small AI Model That Delivers Sonnet 4-Level Coding Performance at One-Third the Cost"
    type: secondary_reporting
    date: 2025-10-15
---

## Summary

Anthropic released Claude Haiku 4.5, the small-tier member of the Claude 4.5 generation, priced at $1 input / $5 output per million tokens. The model achieved 73.3% on SWE-bench Verified — matching the performance of Claude Sonnet 4, Anthropic's mid-tier model from five months prior — while running four to five times faster. Anthropic classified it as ASL-2 under its Responsible Scaling Policy.

## What Happened

Claude Haiku 4.5 was released on October 15, 2025, completing the three-tier Claude 4.5 lineup alongside Sonnet 4.5 and the previously released Opus 4. The model's 73.3% SWE-bench Verified score equaled the benchmark result for Sonnet 4, illustrating the rapid performance diffusion within Anthropic's own product line: within a single model generation, the small-tier model had absorbed the coding capability of the prior mid-tier.

At $1/$5 per million tokens — one-third the price of Sonnet 4.5 — and with throughput four to five times higher, Haiku 4.5 targeted high-volume production use cases where latency and cost were primary constraints. Typical applications included code completion, automated review pipelines, customer-facing chat, and document processing at scale.

The ASL-2 classification under Anthropic's Responsible Scaling Policy indicated that the model did not exhibit capabilities triggering the more stringent ASL-3 evaluation requirements — specifically, no evidence of meaningful uplift for weapons of mass destruction development or autonomous cyberattack capabilities.

## Why It Matters

Claude Haiku 4.5's parity with prior-generation Sonnet illustrated a consistent pattern in the Claude product line: capability trickles down from leading tier to efficient tier within roughly two to three model generations. For users whose workloads fit Sonnet 4's performance envelope, Haiku 4.5 offered equivalent results at a third the cost and significantly higher throughput.

In the context of open-vs-closed dynamics, the Haiku tier occupied a strategically important position: it directly competed on cost and speed with self-hosted open-weight models. At $1 input, closed-model API access was approaching the total cost of ownership of running equivalent open-weight models on leased GPU infrastructure, eroding one of the primary economic arguments for self-hosting.
