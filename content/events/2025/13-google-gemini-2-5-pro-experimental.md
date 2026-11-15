---
id: google-gemini-2-5-pro-experimental
title: "Google Launches Gemini 2.5 Pro Experimental with Native Thinking"
date: 2025-03-25
category: models
significance: landmark
confidence: high
actors:
  - id: google-deepmind
    role: subject
regions: [US]
tags: [reasoning, benchmarks, frontier-models, lmarena]
threads: [scaling-laws-debate]
sources:
  - url: https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-model-thinking-updates-march-2025/
    title: 'Gemini 2.5: Our most intelligent AI model'
    type: primary_document
    date: '2025-03-25'
    publisher: Google
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261015010938/https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-model-thinking-updates-march-2025/
  - url: https://www.rdworldonline.com/googles-gemini-2-5-pro-model-tops-lmarena-by-40-points-outperforms-competitors-in-scientific-reasoning/
    title: Google's Gemini 2.5 Pro model tops LMArena by close to 40 points
    type: secondary_reporting
    date: '2025-03-25'
revision:
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

Google DeepMind released Gemini 2.5 Pro Experimental on March 25, 2025 as the first release in its Gemini 2.5 family.
Google described it as a thinking model and reported leading benchmark and LMArena results.
It followed the earlier Gemini 2.0 Flash Thinking, so it was not the first Gemini thinking model.

## Editorial correction, October&nbsp;26,&nbsp;2026

The same March 25 primary announcement identifies Gemini 2.0 Flash Thinking as Google's earlier thinking model.
The first-Gemini implication is removed; being the first 2.5 release is distinct from originating thinking across the Gemini family.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-google-gemini-2-5-pro-experimental-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

Gemini 2.5 Pro Experimental shipped with native reasoning built directly into the model's architecture rather than bolted on as a post-training step. The model demonstrated a 63.8% score on SWE-bench Verified, placing it among the strongest coding models at the time, and reached 18.8% on Humanity's Last Exam, a benchmark designed to stress-test the upper limits of frontier reasoning. Google simultaneously touted its 1-million-token context window and native multimodal capabilities spanning text, code, images, audio, and video. The jump to #1 on LMArena — a crowdsourced human-preference leaderboard — was particularly notable given that Google had been trailing OpenAI and Anthropic on that metric for months.

## Why It Matters

The release reignited debate about whether scaling compute in conjunction with integrated reasoning loops produces qualitatively different capability gains rather than incremental ones. Gemini 2.5 Pro's benchmark performance, especially its SWE-bench score, was cited by scaling optimists as evidence that the scaling playbook still holds when combined with chain-of-thought training. Skeptics countered that leaderboard rankings are gameable and that HLE performance below 20% reflects fundamental limits no current architecture has overcome.
