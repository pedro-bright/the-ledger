---
id: anthropic-claude-opus-4-5-release
title: "Anthropic Releases Claude Opus 4.5 — First Model Past 80% on SWE-Bench"
date: 2025-11-24
category: models
significance: landmark
confidence: high
actors:
  - id: anthropic
    role: subject
regions: [global]
tags: [claude-opus, swe-bench, coding-agents, hybrid-reasoning, extended-thinking, benchmarks]
threads: [ai-agents-era]
sources:
  - url: https://www.anthropic.com/news/claude-opus-4-5
    title: "Claude Opus 4.5"
    type: official
    date: 2025-11-24
  - url: https://www.macrumors.com/2025/11/24/anthropic-claude-opus-4-5/
    title: "Anthropic Releases Claude Opus 4.5"
    type: secondary_reporting
    date: 2025-11-24
---

## Summary

Anthropic released Claude Opus 4.5 on November 24, 2025 — the first AI model to break the 80% threshold on SWE-bench Verified, achieving 80.9%. Priced 67% below its predecessor at $5/$25 per million tokens and featuring hybrid fast/extended reasoning with a 200K context window and 64K output limit, Opus 4.5 set a new capability floor for agentic coding work.

## What Happened

Claude Opus 4.5 launched with a headline result of 80.9% on SWE-bench Verified, a benchmark that tests AI models on real GitHub issues requiring code edits across real repositories. No prior model had crossed the 80% mark. The result represented a step-change from Opus 4's performance and established a new reference point for agentic coding capability.

Beyond benchmarks, the model introduced several architectural features designed for agent deployments. Hybrid reasoning allowed the model to switch between fast response mode and extended thinking mode within a single session, letting agents apply deeper deliberation to hard subproblems without paying the latency cost on routine steps. The 200K context window accommodated entire large codebases, and the 64K output limit enabled generation of complete, multi-file implementations in a single response.

The pricing was a significant change from prior Opus models: at $5 per million input tokens and $25 per million output tokens, Opus 4.5 was 67% cheaper than Opus 4 while surpassing it on every benchmark. Anthropic framed this as reflecting the continued efficiency improvements in model training rather than a capability tradeoff.

## Why It Matters

The 80% SWE-bench barrier had become a symbolic threshold in the coding agent field. Breaking it with a model that was also substantially cheaper than predecessors reset expectations about what capability required in terms of compute cost. Coding agents built on Opus 4.5 could solve a meaningfully larger fraction of real software engineering tasks autonomously, shifting the question from "can an agent attempt this?" to "at what cost per task does it make economic sense?"

The hybrid reasoning feature also pointed toward a new design pattern for long-horizon agents: variable reasoning intensity within a session, allowing the agent to allocate computation strategically rather than uniformly. That pattern would influence subsequent model releases across the industry.
