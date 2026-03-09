---
id: anthropic-claude-37-sonnet
title: "Anthropic Releases Claude 3.7 Sonnet with Extended Thinking"
date: 2025-02-24
category: models
significance: major
confidence: high
actors:
  - id: anthropic
    role: developer
regions: [US]
tags: [reasoning, extended-thinking, frontier-model, hybrid-model]
threads: [scaling-laws-debate]
sources:
  - url: https://www.anthropic.com/news/claude-3-7-sonnet
    title: "Claude 3.7 Sonnet and Claude Code"
    type: primary
  - url: https://www.theverge.com/news/616429/anthropic-claude-3-7-sonnet-extended-thinking
    title: "Anthropic releases Claude 3.7 Sonnet with extended thinking"
    type: secondary
---

## Summary

Anthropic released Claude 3.7 Sonnet, the first "hybrid reasoning" model that could operate as both a standard language model and a reasoning model with extended thinking in a single architecture. The release represented Anthropic's answer to OpenAI's o1 paradigm while maintaining Claude's general-purpose versatility.

## What Happened

On February 24, 2025, Anthropic launched Claude 3.7 Sonnet alongside Claude Code, a command-line coding agent. The model's defining feature was "extended thinking" — the ability to spend additional inference compute reasoning through complex problems before responding, similar in concept to OpenAI's o1 but implemented differently.

Unlike o1, which was exclusively a reasoning model, Claude 3.7 Sonnet could operate in either standard mode (fast, direct responses) or extended thinking mode (longer reasoning chains for complex problems). Users and developers could toggle between modes and even set compute budgets for how long the model should "think."

The model showed strong performance on reasoning benchmarks while maintaining Claude's general conversational abilities. On SWE-bench, it achieved a new state-of-the-art score, demonstrating particular strength in agentic coding tasks.

Claude Code, released alongside the model, was a terminal-based coding agent that could autonomously navigate codebases, write and run tests, and make multi-file changes — representing Anthropic's entry into the agentic coding tools space.

## Why It Matters

Claude 3.7 Sonnet's hybrid approach offered a pragmatic alternative to OpenAI's dedicated reasoning models. Rather than requiring users to choose between a standard model and a reasoning model, it combined both capabilities in a single system. This reflected a different architectural philosophy: where OpenAI separated reasoning into distinct model families (GPT vs. o-series), Anthropic integrated reasoning as a mode within existing models.

The release also signaled that test-time compute scaling — the paradigm introduced by o1 — was becoming a standard feature of frontier models rather than a proprietary innovation of a single company. Within months of o1's release, both DeepSeek (R1) and Anthropic (3.7 Sonnet) had released competitive reasoning models, suggesting that the technique was replicable and would quickly be commoditized.
