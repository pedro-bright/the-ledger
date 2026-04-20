---
id: google-gemini-3-pro-release
title: "Google Launches Gemini 3 with Cross-Product Rollout and Deep Think"
date: 2025-11-18
category: models
significance: landmark
confidence: high
actors:
  - id: google-deepmind
    role: subject
regions: [US]
tags: [frontier-models, reasoning, multimodal, arc-agi]
threads: [scaling-laws-debate]
sources:
  - url: https://blog.google/products/gemini/gemini-3/
    title: "Gemini 3: Introducing the latest Gemini AI model"
    type: official
    date: 2025-11-18
  - url: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/
    title: "Gemini 3 Deep Think"
    type: official
    date: 2025-11-18
  - url: https://www.infoq.com/news/2025/11/google-gemini-3/
    title: "Google Launches Gemini 3 with Deep Think Reasoning Mode"
    type: secondary_reporting
    date: 2025-11-18
---

## Summary

Google launched Gemini 3 in November 2025 with a simultaneous rollout across Search, the Gemini app, AI Studio, and Vertex AI. The model topped LMArena at 1501 Elo and posted frontier-leading scores on GPQA Diamond (91.9%) and SWE-bench Verified (76.2%); its optional Deep Think mode extended reasoning depth at inference time and achieved 45.1% on ARC-AGI-2 and 41.0% on Humanity's Last Exam without external tools.

## What Happened

Gemini 3 was released in two operational modes: a standard inference path and Deep Think, which allocates substantially more reasoning compute per query. On ARC-AGI-2 — a benchmark explicitly designed to resist pattern memorization and require novel reasoning — the Deep Think variant scored 45.1%, a significant jump from prior state-of-the-art results. The SWE-bench Verified score of 76.2% set a new high for autonomous software engineering tasks. Unlike previous major Google model releases, Gemini 3 was pushed into production across all major consumer and developer surfaces on launch day, rather than staged through a preview or waitlist period. Google's internal evaluations were corroborated on several benchmarks by independent third-party testing, lending the claims higher credibility than some prior frontier releases.

## Why It Matters

Gemini 3's performance on ARC-AGI-2 attracted particular attention in the scaling-laws debate because ARC-AGI was specifically designed to be immune to the kind of test-set memorization that critics argue inflates benchmark scores. A Deep Think score above 45% without tools was read by many researchers as evidence that extended inference-time reasoning — scaling test-time compute rather than just training compute — can unlock qualitatively new reasoning behaviors. Critics acknowledged the results while arguing that 45% still represents a substantial gap from human performance and that the capability gains required proportionally larger inference budgets, raising questions about whether the scaling trajectory is economically sustainable.
