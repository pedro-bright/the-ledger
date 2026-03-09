---
id: openai-o1-release
title: "OpenAI Releases o1, Its First 'Reasoning' Model"
date: 2024-09-12
category: models
significance: landmark
confidence: high
actors:
  - id: openai
    role: developer
regions: [US]
tags: [reasoning, chain-of-thought, frontier-model, test-time-compute]
threads: [scaling-laws-debate]
sources:
  - url: https://openai.com/index/learning-to-reason-with-llms/
    title: "Learning to Reason with LLMs"
    type: primary
  - url: https://openai.com/index/introducing-openai-o1-preview/
    title: "Introducing OpenAI o1-preview"
    type: primary
---

## Summary

OpenAI launched o1 (initially as o1-preview), a new class of AI model designed to "think" before responding by generating internal chains of reasoning. The model dramatically outperformed GPT-4o on complex math, coding, and scientific reasoning tasks, introducing "test-time compute scaling" as a new paradigm for AI capability improvement.

## What Happened

On September 12, 2024, OpenAI released o1-preview and o1-mini, the first models in a new family designed around explicit reasoning. Unlike traditional language models that generate responses token-by-token, o1 models were trained using reinforcement learning to produce extended internal chains of thought before delivering an answer. Users could see that the model was "thinking" but the detailed reasoning chain was hidden.

The results on reasoning-heavy benchmarks were dramatic: o1-preview scored 83.3% on the American Invitational Mathematics Examination (AIME) qualifier, compared to GPT-4o's 13.4%. On Codeforces competitive programming, o1 reached the 89th percentile. On PhD-level science questions (GPQA Diamond), it scored 78.0% vs. GPT-4o's 53.6%.

The improvement came from "test-time compute scaling" — using more computation during inference (answering) rather than only during training. This was conceptually different from simply making models bigger: instead of training a larger model, you allowed a smaller model to "think longer" about hard problems.

OpenAI described this as "a new paradigm for AI," suggesting that scaling compute at inference time could be a complementary (or alternative) path to capability improvement alongside traditional training-time scaling.

## Why It Matters

o1 introduced the most significant new paradigm in AI capability since the transformer architecture. The idea that models could get dramatically better at hard problems by "thinking more" — spending more inference compute on reasoning — opened a new dimension of scaling that didn't require building ever-larger models.

This was particularly significant for the scaling laws debate. Critics had argued that traditional scaling (more parameters, more training data, more compute) was hitting diminishing returns. o1 demonstrated that a different axis of scaling — inference-time computation — could yield dramatic capability improvements, potentially extending the frontier of AI capability well beyond what training-time scaling alone could achieve.

The model also raised new safety considerations. Extended reasoning capabilities made the model better at scientific reasoning, but also potentially better at planning, persuasion, and other capabilities that safety researchers had flagged as concerning. The hidden reasoning chain meant that users could see the model had "thought" about a problem but couldn't fully inspect its reasoning process, creating new opacity challenges.

The o1 paradigm would prove influential: within months, competing labs began developing their own reasoning-focused models, and the concept of test-time compute scaling became central to the AI capability conversation.
