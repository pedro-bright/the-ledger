---
id: openai-o3-release
title: "OpenAI Releases o3 and o3-mini Reasoning Models"
date: 2025-01-31
category: models
significance: major
confidence: high
actors:
  - id: openai
    role: developer
regions: [US]
tags: [reasoning, test-time-compute, frontier-model, benchmarks]
threads: [scaling-laws-debate]
sources:
  - url: https://openai.com/index/openai-o3-mini/
    title: "OpenAI o3-mini"
    type: primary
  - url: https://www.theverge.com/2025/1/31/24356705/openai-o3-mini-available-chatgpt
    title: "OpenAI's o3-mini is now available to all ChatGPT users"
    type: secondary
---

## Summary

OpenAI released o3-mini, a faster and cheaper version of its reasoning model line, providing configurable thinking effort levels. The release came amid intense competition from DeepSeek R1 and represented OpenAI's effort to maintain its lead in the reasoning model paradigm it had pioneered.

## What Happened

On January 31, 2025, OpenAI released o3-mini to all ChatGPT users and API customers. The model featured three configurable "reasoning effort" levels — low, medium, and high — allowing users and developers to trade off between response speed/cost and reasoning depth.

o3-mini showed strong performance on math, science, and coding benchmarks, particularly at the high-effort setting. On AIME 2024, o3-mini (high) scored comparably to o1 while being significantly cheaper and faster. The model was made available to free-tier ChatGPT users, dramatically expanding access to reasoning capabilities.

The full o3 model had been previewed in December 2024, with OpenAI announcing scores on the ARC-AGI benchmark that exceeded all prior models. However, the general release of o3 was delayed, with o3-mini serving as the initial public offering from the o3 family.

## Why It Matters

The o3-mini release demonstrated that reasoning capabilities were being rapidly commoditized. Just months after o1 had introduced the paradigm, OpenAI was already releasing a cheaper, faster version — driven in part by competitive pressure from DeepSeek R1, which offered comparable reasoning capabilities as an open-source model.

The configurable reasoning effort was a novel approach that gave users explicit control over the cost-performance trade-off — a feature that acknowledged the economic reality that not every query needs deep reasoning, and that most applications would prefer fast, cheap responses with the option to "think harder" when needed.
