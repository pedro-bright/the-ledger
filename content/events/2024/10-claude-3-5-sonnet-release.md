---
id: claude-3-5-sonnet-release
title: "Anthropic Releases Claude 3.5 Sonnet"
date: 2024-06-20
category: models
significance: major
confidence: high
actors:
  - id: anthropic
    role: developer
regions: [US]
tags: [large-language-model, frontier-model, cost-efficiency, coding]
threads: [scaling-laws-debate]
sources:
  - url: https://www.anthropic.com/news/claude-3-5-sonnet
    title: "Introducing Claude 3.5 Sonnet"
    type: primary
  - url: https://www.theverge.com/2024/6/20/24182396/anthropic-claude-3-5-sonnet-ai-model
    title: "Anthropic's new Claude 3.5 Sonnet outperforms GPT-4o and its own flagship model"
    type: secondary
---

## Summary

Anthropic released Claude 3.5 Sonnet, a mid-tier model that surpassed not only GPT-4o but also Anthropic's own most expensive model, Claude 3 Opus, across most benchmarks — while running at twice the speed and one-fifth the cost. The release challenged the assumption that the most capable model must also be the most expensive.

## What Happened

On June 20, 2024, Anthropic launched Claude 3.5 Sonnet, positioned as an update to the middle tier of its Claude 3 model family. Despite its mid-tier positioning, the model outperformed Claude 3 Opus — Anthropic's flagship — on the majority of evaluation benchmarks, including graduate-level reasoning (GPQA), undergraduate-level knowledge (MMLU), and especially coding tasks (HumanEval).

Claude 3.5 Sonnet scored 88.7% on MMLU (vs. Opus's 86.8%), 92.0% on HumanEval (vs. Opus's 84.9%), and showed particularly strong improvements in agentic coding — the ability to write, test, and iterate on code across multiple steps. It also surpassed GPT-4o on most of the same benchmarks.

The model operated at roughly twice the speed of Claude 3 Opus and was priced at $3 per million input tokens and $15 per million output tokens — one-fifth of Opus's pricing. Anthropic simultaneously launched Artifacts, a feature in claude.ai that allowed the model to generate interactive code, documents, and visualizations in a dedicated workspace alongside the conversation.

## Why It Matters

Claude 3.5 Sonnet was a data point that complicated the industry's simple narrative about model capability. The conventional assumption was that more capable models were necessarily larger, slower, and more expensive. Sonnet demonstrated that architectural and training improvements could produce a model that was simultaneously better, faster, and cheaper than its predecessor.

This had significant implications for the competitive landscape. If a mid-tier model could outperform the previous generation's flagship, then the value proposition of expensive frontier models became harder to justify — and the "capability moat" that frontier labs relied on for pricing power began to look shallower.

For developers and enterprises, Sonnet's performance-per-dollar made it the default choice for most applications, establishing a pattern where the mid-tier model, not the flagship, would drive the majority of commercial usage. This pattern would persist through subsequent model generations.
