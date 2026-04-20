---
id: xai-grok-4-release
title: "xAI Releases Grok 4 and Grok 4 Heavy"
date: 2025-07-09
category: models
significance: major
confidence: high
actors:
  - id: xai
    role: subject
regions: [US]
tags: [frontier-models, reasoning, multi-agent, colossus]
threads: [scaling-laws-debate]
sources:
  - url: https://x.ai/news/grok-4
    title: "Grok 4"
    type: official
    date: 2025-07-09
  - url: https://smythos.com/developers/ai-models/whats-new-in-grok-4-release-facts-benchmarks-and-value/
    title: "What's New in Grok 4: Release Facts, Benchmarks, and Value"
    type: secondary_reporting
    date: 2025-07-09
---

## Summary

xAI released Grok 4 and Grok 4 Heavy in July 2025, trained on an estimated 100 times the compute used for Grok 2 across Colossus, xAI's 200,000-H100 supercluster. Grok 4 Heavy introduced a multi-agent collaborative architecture in which multiple model instances deliberate jointly before producing a final response.

## What Happened

xAI characterized Grok 4 as approximately 1.7 trillion parameters, though the company did not independently verify this figure through third-party audit. Training ran on Colossus, which xAI had expanded to 200,000 H100 GPUs — one of the largest single training clusters deployed by any lab to that point. The flagship benchmark claims were striking: 87% on GPQA (graduate-level science reasoning), 44.4% on Humanity's Last Exam with tool access, and 95% on AIME 2025. Grok 4 Heavy, which uses an ensemble of model instances working in parallel before reaching consensus, posted the highest HLE score. Independent evaluators noted meaningful gaps between xAI's internal evaluation methodology and results on standardized third-party reproductions, casting doubt on the precise figures without negating a substantial improvement over prior Grok versions.

## Why It Matters

Grok 4's release contributed a high-compute data point to the scaling-laws debate at a moment when several researchers had begun arguing that returns from scale were flattening. The fact that a 100x compute increase over Grok 2 produced measurable benchmark gains — even if contested — gave scaling optimists a concrete counterexample to stagnation narratives. The disputed benchmark methodology also highlighted a structural problem: as labs pursue competitive advantage, self-reported evaluations increasingly diverge from externally reproducible results, making it harder to assess whether aggregate scaling progress is real or performative.
