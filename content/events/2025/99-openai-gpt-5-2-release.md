---
id: openai-gpt-5-2-release
title: OpenAI Releases GPT-5.2
date: '2025-12-11'
category: models
significance: major
confidence: high
actors:
  - id: openai
    role: developer
tags: [reasoning, frontier-models, benchmarks]
threads: [scaling-laws-debate]
related: [openai-gpt-5-release, openai-o1-release]
sources:
  - url: https://openai.com/index/introducing-gpt-5-2/
    title: Introducing GPT-5.2
    type: primary_document
    date: '2025-12-11'
    publisher: OpenAI
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261016235949/https://openai.com/index/introducing-gpt-5-2/
  - url: https://platform.openai.com/docs/guides/latest-model
    title: 'OpenAI Platform: Latest Model Documentation'
    type: official
  - url: https://cdn.openai.com/pdf/3a4153c8-c748-4b71-8e31-aecbde944f8d/oai_5_2_system-card.pdf
    title: GPT-5.2 System Card
    type: primary_document
revision:
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

OpenAI announced GPT-5.2 on December 11, 2025, with Instant, Thinking, and Pro variants.
The models became available in the API that day, while rollout in ChatGPT began with paid plans.

## Editorial correction, October&nbsp;26,&nbsp;2026

The announcement establishes December 11, 2025, rather than February 1, 2026.
The event is relocated to the 2025 directory while retaining its ID and public event URL.
The announcement explicitly distinguishes Instant, Thinking, and Pro; the original summary's assertion that there were no separate thinking modes is withdrawn.
The old source dates and original metadata are preserved in this revision record; the mutable platform guide is not assigned an invented publication date.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-openai-gpt-5-2-release-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

GPT-5.2 arrived as a refinement of the GPT-5 line, with improved reasoning capabilities that rivaled the dedicated o-series models. Available through Azure AI Foundry and OpenAI's API, it used `max_completion_tokens` (spending reasoning tokens before visible output) rather than the traditional `max_tokens` parameter. The model did not support temperature=0, only default temperature of 1, reflecting its reasoning-native architecture.

## Why It Matters

GPT-5.2 further blurred the line between "reasoning models" and "general models," suggesting the industry was converging on reasoning as a default capability rather than a specialized mode. The competitive pressure from DeepSeek's open-source reasoning models and Anthropic's hybrid thinking approach in Claude 3.7 made reasoning a table-stakes feature rather than a differentiator.
