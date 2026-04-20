---
id: anthropic-claude-sonnet-4-6-release
title: "Anthropic Releases Claude Sonnet 4.6 with 1M-Token Context in Beta"
date: 2026-02-17
category: models
significance: major
confidence: high
actors:
  - id: anthropic
    role: subject
regions: [US]
tags: [frontier-models, long-context, agents, coding, computer-use]
threads: [open-vs-closed-weights]
sources:
  - url: https://www.anthropic.com/news/claude-sonnet-4-6
    title: "Claude Sonnet 4.6"
    type: official
    date: 2026-02-17
  - url: https://www.cnbc.com/2026/02/17/anthropic-ai-claude-sonnet-4-6-default-free-pro.html
    title: "Anthropic Rolls Out Claude Sonnet 4.6 as Default for Free and Pro Users"
    type: secondary_reporting
    date: 2026-02-17
---

## Summary

Anthropic released Claude Sonnet 4.6 on February 17, 2026, making it the default model for Claude.ai Free and Pro users. The release introduced a one-million token context window in beta — with general availability following on March 13 — alongside improvements to coding, computer use, and multi-step agent planning. Users preferred Sonnet 4.6 over its predecessor in 70% of direct comparisons and over the prior-generation Opus 4.5 in 59% of comparisons. Pricing remained unchanged at $3 input / $15 output per million tokens.

## What Happened

On February 17, 2026, Anthropic deployed Claude Sonnet 4.6 as the default model across all Claude.ai tiers. The update centered on three capability areas: a one-million token context window released in beta for API users (with full general availability on March 13, 2026), improvements to agentic coding workflows including better multi-step plan adherence, and enhanced computer use performance for GUI-based automation tasks.

The 1M context window represented a major expansion from the prior 200K limit available on Sonnet 4.5. At beta launch, access was gated to API users with a waitlist for high-volume applications; the March GA release removed the restriction. Human preference evaluations run internally by Anthropic showed that users preferred Sonnet 4.6 responses over Sonnet 4.5 in 70% of head-to-head comparisons across a diverse sample of prompts, and preferred it over the prior-generation Opus 4.5 in 59% of comparisons.

Pricing was held flat at $3/$15 per million tokens input/output, matching Sonnet 4.5 — a decision Anthropic indicated reflected their goal of keeping frontier capability accessible at the mid-tier price point. The model became the default for new Claude.ai conversations on the Free plan, replacing Sonnet 4.5.

## Why It Matters

The one-million token context window was the headline differentiator for Sonnet 4.6 in the context of the open-vs-closed debate. At this context length, a model can process entire large codebases, multi-volume document collections, or long-running agent conversation histories in a single inference call — a capability with no direct equivalent in open-weight models available at the time of release.

Context length had become a dimension where closed-source labs retained a meaningful lead. The infrastructure required to serve million-token contexts reliably at production scale — memory bandwidth, KV cache management, batching efficiency — favored well-resourced labs with proprietary serving infrastructure. While open-weight models had closed the benchmark gap on standard evaluation tasks, the operational gap in long-context serving remained a concrete differentiator for enterprise use cases.

By making Sonnet 4.6 the default for free-tier users while holding prices flat, Anthropic also demonstrated a deliberate strategy of expanding access at pace with capability — maintaining the proposition that closed-source API models offered not just better performance but better infrastructure than equivalent self-hosted alternatives.
