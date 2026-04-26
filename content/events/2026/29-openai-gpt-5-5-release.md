---
id: openai-gpt-5-5-release
title: "OpenAI Releases GPT-5.5, First Fully Retrained Base Model Since GPT-4.5"
date: 2026-04-23
category: models
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/introducing-gpt-5-5/
    title: "Introducing GPT-5.5"
    type: primary_document
    publisher: OpenAI
    date: 2026-04-23
    accessed: 2026-04-26
    archive_url: https://web.archive.org/web/*/https://openai.com/index/introducing-gpt-5-5/
  - url: https://techcrunch.com/2026/04/23/openai-chatgpt-gpt-5-5-ai-model-superapp/
    title: "OpenAI Releases GPT-5.5, Moves Toward 'Super App' Vision"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-04-23
    accessed: 2026-04-26
  - url: https://www.cnbc.com/2026/04/23/openai-announces-latest-artificial-intelligence-model.html
    title: "OpenAI Announces Latest Artificial Intelligence Model"
    type: secondary_reporting
    publisher: CNBC
    date: 2026-04-23
    accessed: 2026-04-26
  - url: https://www.axios.com/2026/04/23/openai-releases-spud-gpt-model
    title: "OpenAI Releases 'Spud' GPT Model"
    type: secondary_reporting
    publisher: Axios
    date: 2026-04-23
    accessed: 2026-04-26
actors:
  - id: openai
    role: subject
regions: [US]
tags: [models, omnimodal, benchmarks, context-window, agentic, openai]
threads: [scaling-laws-debate]
related: []
state: published
revision:
  created: 2026-04-26
  last_reviewed: 2026-04-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

On April 23, 2026, OpenAI released GPT-5.5 — internally codenamed "Spud" — its first fully retrained base model since GPT-4.5. Unlike the intervening GPT-5.x variants, GPT-5.5 was rebuilt from scratch with a natively omnimodal architecture processing text, images, audio, and video through a single unified model. It is the first OpenAI API model to ship with a one-million-token context window as the baseline and posted new benchmark records at release on SWE-bench Verified (88.7%) and Terminal-Bench 2.0 (82.7%).

## What Happened

OpenAI's GPT-5 series had previously comprised incremental variants built atop a shared base: GPT-5.0, GPT-5.3 Codex (March 2026), and GPT-5.4 each introduced targeted capability improvements without a full rebuild of the underlying learned representations. GPT-5.5 broke from this pattern. OpenAI described it as a model retrained from a new data mixture and architecture designed explicitly for agentic and long-context workloads, and as its "smartest and most intuitive model yet."

The distinguishing architectural feature of GPT-5.5 is native omnimodality. Prior OpenAI models handling multiple modalities — including GPT-4o — processed each modality through semi-independent pathways or separate endpoints. GPT-5.5's architecture processes text, images, audio, and video inputs through a single unified model. Audio and video generation capabilities were also made available in the API, rather than requiring distinct endpoints or product tiers. The one-million-token context window ships as the baseline for all GPT-5.5 users; prior models offered extended-context windows as optional variants with separate pricing.

OpenAI published benchmark results placing GPT-5.5 at 88.7% on SWE-bench Verified — the primary benchmark measuring a model's ability to autonomously resolve real GitHub issues — against Claude Opus 4.7's 87.6% and GPT-5.4's lower scores. On Terminal-Bench 2.0, which measures autonomous computer-use task completion, GPT-5.5 scored 82.7%, ahead of Claude Opus 4.7 at 69.4% and Gemini 3.1 Pro at 68.5%. On FrontierMath Tier 4, a benchmark of research-level mathematical problem-solving, GPT-5.5 reached 35.4% against Claude Opus 4.7's 22.9%.

Access rolled out on April 24, 2026 to ChatGPT Plus, Pro, Business, and Enterprise subscribers, and through the OpenAI API. API pricing was set at $5 per million input tokens and $30 per million output tokens for the standard variant; a GPT-5.5 Pro variant was priced at $30 per million input tokens and $180 per million output tokens. GPT-5.5 simultaneously became the unified Codex model — the previously separate Codex coding variant was collapsed into GPT-5.5 rather than maintained as a distinct product.

At the time of the release, OpenAI disclosed Workspace Agents — team-level AI helpers configurable without code, aimed at enterprise customers building account research and deal-briefing workflows — and articulated a product vision for a unified "Super App" combining ChatGPT, Codex, and an AI browser. GPT-5.5 was described internally as the technical foundation for this product direction.

## Why It Matters

GPT-5.5's status as the first fully retrained base model since GPT-4.5 marks when OpenAI completed the first full-generation architectural reset within the GPT-5 lineage. The prior 5.x models demonstrated rapid incremental iteration; GPT-5.5 documents the point at which OpenAI determined that a new data mixture, learned representations, and unified architecture were required to advance the frontier. Whether the natively omnimodal approach — integrating text, images, audio, and video into a single model rather than a modular system — proves to be a durable architectural choice, or whether future generations revert to modality-specific pipelines for efficiency reasons, was an open question at release.

GPT-5.5's benchmark leadership at release on SWE-bench Verified and Terminal-Bench 2.0 documents the capability frontier as of late April 2026 on the two benchmarks most directly correlated with agentic commercial deployment. The 88.7% SWE-bench Verified result marked the first time any model exceeded 88% on the benchmark at release; the Terminal-Bench 2.0 gap over nearest competitors — 13 percentage points above Claude Opus 4.7 — was the largest benchmark-at-release lead any model had held on autonomous computer-use tasks in the preceding twelve months. The standard caveat applies: benchmark performance and production engineering task resolution are not equivalent; independent verification of real-world GPT-5.5 coding performance on representative enterprise workloads was not available at release.

Establishing one million tokens as the baseline context window — rather than a premium optional tier — changes the pricing and application architecture calculus for builders using the OpenAI API. Retrieval-augmented generation pipelines, context compression layers, and chunking strategies built to work around shorter windows were designed as necessary accommodations; with 1M context as the baseline, the marginal cost justification for those accommodations shifts. What portion of production applications rebuilt their context handling strategies following the GPT-5.5 baseline change, and at what economic tradeoff, was not characterized at release.
