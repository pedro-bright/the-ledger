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
    title: "Gemini 2.5: Our newest Gemini model with thinking"
    type: official
    date: 2025-03-25
  - url: https://www.rdworldonline.com/googles-gemini-2-5-pro-model-tops-lmarena-by-40-points-outperforms-competitors-in-scientific-reasoning/
    title: "Google's Gemini 2.5 Pro model tops LMArena by close to 40 points"
    type: secondary_reporting
    date: 2025-03-25
---

## Summary

Google DeepMind released Gemini 2.5 Pro Experimental on March 25, 2025, marking the first Gemini model with integrated chain-of-thought reasoning — a capability Google calls "thinking." The release immediately claimed the top position on LMArena by a margin of roughly 40 Elo points over competitors including Grok-3 and GPT-4.5.

## What Happened

Gemini 2.5 Pro Experimental shipped with native reasoning built directly into the model's architecture rather than bolted on as a post-training step. The model demonstrated a 63.8% score on SWE-bench Verified, placing it among the strongest coding models at the time, and reached 18.8% on Humanity's Last Exam, a benchmark designed to stress-test the upper limits of frontier reasoning. Google simultaneously touted its 1-million-token context window and native multimodal capabilities spanning text, code, images, audio, and video. The jump to #1 on LMArena — a crowdsourced human-preference leaderboard — was particularly notable given that Google had been trailing OpenAI and Anthropic on that metric for months.

## Why It Matters

The release reignited debate about whether scaling compute in conjunction with integrated reasoning loops produces qualitatively different capability gains rather than incremental ones. Gemini 2.5 Pro's benchmark performance, especially its SWE-bench score, was cited by scaling optimists as evidence that the scaling playbook still holds when combined with chain-of-thought training. Skeptics countered that leaderboard rankings are gameable and that HLE performance below 20% reflects fundamental limits no current architecture has overcome.
