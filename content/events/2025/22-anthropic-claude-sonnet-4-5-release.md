---
id: anthropic-claude-sonnet-4-5-release
title: "Anthropic Releases Claude Sonnet 4.5 with 30-Hour Autonomous Operation"
date: 2025-09-29
category: models
significance: major
confidence: high
actors:
  - id: anthropic
    role: subject
regions: [US]
tags: [agents, coding, frontier-models, autonomous-operation, swe-bench]
threads: [open-vs-closed-weights]
sources:
  - url: https://www.anthropic.com/news/claude-sonnet-4-5
    title: "Claude Sonnet 4.5"
    type: official
    date: 2025-09-29
  - url: https://fortune.com/2025/09/29/anthropic-releases-claude-sonnet-4-5-a-model-it-says-can-build-software-and-accomplish-business-tasks-autonomously/
    title: "Anthropic Releases Claude Sonnet 4.5, a Model It Says Can Build Software and Accomplish Business Tasks Autonomously"
    type: secondary_reporting
    date: 2025-09-29
---

## Summary

Anthropic released Claude Sonnet 4.5, a closed-source API model that achieved 77.2% on SWE-bench Verified and demonstrated stable autonomous operation across sessions lasting more than 30 hours — a fourfold increase over its predecessor Claude Opus 4. The model also led the OSWorld benchmark at 61.4% for computer-use tasks. Priced at $3 input / $15 output per million tokens, it positioned Anthropic's mid-tier model at the frontier of agent capability.

## What Happened

Released on September 29, 2025, Claude Sonnet 4.5 was Anthropic's primary mid-tier model for agentic coding and software engineering work. The 77.2% SWE-bench Verified score placed it among the highest-performing models on the software engineering benchmark, which evaluates the ability to resolve real GitHub issues in large codebases.

The most notable operational characteristic was sustained context coherence during long-running autonomous sessions. Anthropic reported that Sonnet 4.5 could maintain productive operation across 30+ hour tasks — substantially longer than the 7-hour effective window for Opus 4 — with reduced rates of context collapse or instruction drift. This expanded the practical range of tasks that could be delegated to the model without human checkpoints.

On OSWorld, the standard benchmark for GUI-based computer use (navigating desktop applications, filling forms, executing multi-step tasks through visual interfaces), Sonnet 4.5 achieved 61.4%, leading all models at the time of release. The model was available via the Anthropic API and integrated into Claude.ai for Pro and Team subscribers. Pricing was unchanged from prior tiers at $3/$15 per million tokens.

## Why It Matters

Sonnet 4.5 marked a phase shift in what closed-source API models offered as their defining differentiator: not raw benchmark performance, but reliability across extended autonomous tasks. As open-weight models like Qwen3 and DeepSeek V3-0324 had compressed the benchmark gap on static evaluations, Anthropic's response was to lead on agentic durability — a dimension harder to replicate through weight release alone.

The 30-hour autonomous operation window had direct commercial implications: it enabled delegation of software projects, multi-day research tasks, and complex business workflows to a single model session. For enterprises evaluating closed vs. open deployments, the question was no longer just capability parity but operational infrastructure — and Anthropic was betting that closed-model reliability would retain enterprise preference even as open weights caught up on raw scores.
