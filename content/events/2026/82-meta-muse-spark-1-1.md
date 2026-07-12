---
id: meta-muse-spark-1-1
title: "Meta Launches Muse Spark 1.1 and First Paid Model API"
date: 2026-07-09
category: models
significance: notable
confidence: high
sources:
  - url: https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
    title: "Introducing Muse Spark: The Meta Model API"
    type: official
    publisher: Meta AI
    date: 2026-07-09
    accessed: 2026-07-12
    archive_url: https://web.archive.org/web/*/https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
  - url: https://ai.meta.com/blog/introducing-muse-spark-msl/
    title: "Muse Spark 1.1: Meta Superintelligence Labs' Agentic Model"
    type: official
    publisher: Meta AI
    date: 2026-07-09
    accessed: 2026-07-12
    archive_url: https://web.archive.org/web/*/https://ai.meta.com/blog/introducing-muse-spark-msl/
  - url: https://techcrunch.com/2026/07/09/meta-enters-the-crowded-ai-coding-battle-with-muse-spark-1-1/
    title: "Meta enters the crowded AI coding battle with Muse Spark 1.1"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-07-09
    accessed: 2026-07-12
  - url: https://www.bloomberg.com/news/articles/2026-07-09/meta-starts-charging-for-ai-with-muse-spark-1-1-agentic-model
    title: "Meta Starts Charging for AI With Muse Spark 1.1 Agentic Model"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-07-09
    accessed: 2026-07-12
actors:
  - id: meta
    role: subject
  - id: mark-zuckerberg
    role: commentator
regions: [US]
tags: [model-release, paid-api, agentic-coding, meta-superintelligence-labs, multimodal, pricing]
threads: []
related: []
state: published
revision:
  created: 2026-07-12
  last_reviewed: 2026-07-12
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On July 9, 2026, Meta released Muse Spark 1.1, a natively multimodal agentic model developed by Meta Superintelligence Labs, and simultaneously launched the Meta Model API — the first time Meta has charged developers for access to a frontier model.
Priced at $1.25 per million input tokens and $4.25 per million output tokens, Muse Spark 1.1 is positioned at approximately one-quarter the cost of comparable models from Anthropic and OpenAI.
The release marks a structural break from Meta's prior AI commercial posture, under which the company distributed models as open weights at no cost or offered inference free of charge through its consumer applications.

## What Happened

Meta Superintelligence Labs announced Muse Spark 1.1 on July 9, 2026.
Meta Superintelligence Labs is a research and development unit established within Meta in 2025 under Alexandr Wang, formerly founder and CEO of Scale AI.
The announcement was made across two official blog posts: one describing the model's technical specifications and the other announcing the Meta Model API and its pricing.

Muse Spark 1.1 accepts text, image, video, PDF, and audio as input and produces text output.
The model supports a one-million-token context window, parallel tool calling, structured output, and built-in web search with inline citations.
At launch, access was restricted to U.S. developers in a public preview; Meta offered $20 in free inference credits to qualifying accounts.
Pricing is $1.25 per million input tokens and $4.25 per million output tokens, which Meta positioned as substantially below competitors: at the time of release, Anthropic's Claude Opus 4.8 and OpenAI's GPT-5.6 Sol both had output pricing in the range of $30 to $50 per million tokens.

Meta disclosed benchmark performance on several commonly used evaluations.
On SWE-bench Pro, which measures agentic completion of real GitHub software issues, Muse Spark 1.1 scored 61.5 percent, behind Claude Fable 5 at approximately 80.3 percent and Claude Opus 4.8 at 69.2 percent, but ahead of GPT-5.5 at 58.6 percent.
On Terminal-Bench 2.1, measuring command-line workflow completion, the model scored 80.0 percent.
On MCP Atlas, a benchmark evaluating tool use across 36 real Model Context Protocol servers and 220 individual tools, Meta reported 88.1 percent — ahead of both GPT-5.5 and Claude Opus 4.8 in its own evaluation.
Independent verification of the MCP Atlas figure was not available at launch.

Mark Zuckerberg announced the release on the platform X, the first time he had posted on X in approximately three years.
He described the model as providing "strong agentic and coding performance at a very low price."
Meta's internal reporting cited Zuckerberg's earlier communications to staff acknowledging that AI agent capabilities had not progressed as quickly as anticipated; Muse Spark 1.1 was publicly positioned as a response to that gap.

## Why It Matters

Meta's prior commercial posture in AI distinguished it structurally from OpenAI and Anthropic.
Through the Llama model series and derivative releases, Meta distributed model weights under open licenses without charge, establishing a supply of capable open-weight models used widely in research and commercial deployment.
Meta did not operate a paid inference API — consumers could access Meta AI applications at no cost, and developers could download weights to self-host.
Muse Spark 1.1 and the Meta Model API represent a departure from that position: Meta now participates in the commercial frontier model market alongside the companies it had previously provided a free-weight alternative to.

The pricing decision carries a strategic logic.
At $1.25 per million input tokens and $4.25 output, Muse Spark 1.1 undercuts Claude Sonnet 5 (then priced at $2/$10 introductory) on input and matches it on output, while dramatically undercutting Opus-class and Sol-class models.
If adopted at scale, this pricing transfers developer spend away from competitors without requiring Meta to match them on benchmark performance at the top of the capability range — a position consistent with Meta's continued publication of open-weight models under Llama that compete with smaller tiers.

The commercial implications of Meta entering the paid API market extend to the broader ecosystem.
Developers who previously relied on Llama self-hosting to avoid per-token costs now have a Meta-hosted option with a managed API surface, citations, and tool use built in — features that self-hosted open-weight deployments require additional engineering to replicate.
The degree to which this accelerates or displaces adoption of open-weight Llama models in developer pipelines is not determinable at launch.

What is not disclosed: the compute cost structure underlying the pricing; how the MCP Atlas evaluation methodology compares to independent replication, given the self-reported nature of the benchmark result; and the planned timeline for availability outside the United States, where the public preview was restricted at launch.
