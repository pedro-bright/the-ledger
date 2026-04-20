---
id: openai-gpt-5-3-codex-release
title: "OpenAI Releases GPT-5.3-Codex Unified Coding Model"
date: 2026-02-05
category: models
significance: major
confidence: high
actors:
  - id: openai
    role: subject
  - id: microsoft
    role: partner
regions: [global]
tags: [gpt-5, codex, coding-agents, github-copilot, swe-bench, unified-model]
threads: [ai-agents-era]
sources:
  - url: https://openai.com/index/introducing-gpt-5-3-codex/
    title: "Introducing GPT-5.3-Codex"
    type: official
    date: 2026-02-05
  - url: https://cdn.openai.com/pdf/23eca107-a9b1-4d2c-b156-7deb4fbc697c/GPT-5-3-Codex-System-Card-02.pdf
    title: "GPT-5.3-Codex System Card"
    type: primary_document
    date: 2026-02-05
  - url: https://github.blog/changelog/2026-02-09-gpt-5-3-codex-is-now-generally-available-for-github-copilot/
    title: "GPT-5.3-Codex Is Now Generally Available for GitHub Copilot"
    type: official
    date: 2026-02-09
---

## Summary

OpenAI released GPT-5.3-Codex on February 5, 2026, merging the previously separate GPT-5.2-Codex and GPT-5.2 general models into a single unified system with 25% improved speed. A real-time companion variant, GPT-5.3-Codex-Spark, followed on February 12, and GitHub Copilot integration launched on February 9.

## What Happened

GPT-5.3-Codex represented a consolidation in OpenAI's model lineup. The prior architecture had maintained separate model tracks for general reasoning (GPT-5.2) and code (GPT-5.2-Codex), requiring developers to choose between them based on workload type. GPT-5.3-Codex merged those capabilities into a single model that performed at or above the best of its predecessors on both general and coding benchmarks, while running 25% faster.

The February 9 GitHub Copilot integration, developed with Microsoft, brought GPT-5.3-Codex to GitHub's developer base — the largest distribution channel for any AI coding tool. GitHub Copilot's agent mode, which had launched in late 2025, received GPT-5.3-Codex as its default model on the same day.

On February 12, OpenAI launched GPT-5.3-Codex-Spark, a variant optimized for low-latency real-time coding scenarios such as inline completion and interactive debugging. The system card published alongside the main launch documented evaluations on standard coding benchmarks and detailed the safety evaluations conducted for agentic code execution scenarios.

## Why It Matters

The unification of general and coding model tracks reflected a broader trend: the distinction between "good at reasoning" and "good at code" was collapsing as frontier models trained on increasingly large code datasets. Developers no longer needed to route requests to specialized coding models; a single model could handle the full range from complex reasoning to detailed implementation.

The speed improvement was practically significant for coding agents that made many sequential model calls per task. A 25% latency reduction at the model level compounded across multi-step agentic workflows, meaningfully reducing the wall-clock time for complex coding tasks. Combined with the GitHub Copilot distribution, GPT-5.3-Codex reached more developers in its first week than any previous OpenAI coding model.
