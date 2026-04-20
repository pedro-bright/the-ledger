---
id: openai-o3-o4-mini-release
title: "OpenAI Releases o3 and o4-mini with Multimodal Reasoning"
date: 2025-04-16
category: models
significance: landmark
confidence: high
actors:
  - id: openai
    role: subject
regions: [US]
tags: [reasoning, multimodal, agentic, benchmarks]
threads: [scaling-laws-debate]
sources:
  - url: https://openai.com/index/introducing-o3-and-o4-mini/
    title: "Introducing OpenAI o3 and o4-mini"
    type: official
    date: 2025-04-16
  - url: https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf
    title: "OpenAI o3 and o4-mini System Card"
    type: primary_document
    date: 2025-04-16
  - url: https://techcrunch.com/2025/04/16/openai-launches-a-pair-of-ai-reasoning-models-o3-and-o4-mini/
    title: "OpenAI launches a pair of AI reasoning models, o3 and o4-mini"
    type: secondary_reporting
    date: 2025-04-16
---

## Summary

OpenAI released o3 and o4-mini on April 16, 2025, the first models in the o-series to natively incorporate images into their chain-of-thought reasoning process. Both models were trained via reinforcement learning to autonomously invoke external tools — including web search, Python execution, and image generation — as part of their reasoning workflows.

## What Happened

Unlike earlier o-series models that reasoned exclusively over text, o3 and o4-mini can directly interpret and reason about images at every step of their internal chain of thought. The tool invocation behavior was not prompt-engineered but emerged from RL training, allowing models to decide independently when to call external capabilities. Independent evaluators contracted by OpenAI found that o3 made approximately 20% fewer major errors than o1 on a comparable task set. The accompanying system card acknowledged a notable failure mode: at high reasoning-effort settings, o3 produced an elevated rate of hallucinated tool calls — confidently invoking tools in ways inconsistent with their actual APIs or capabilities.

## Why It Matters

The o3/o4-mini release advanced the case that test-time compute scaling — spending more inference compute on deliberate reasoning — delivers meaningful capability improvements beyond what training-time scaling alone achieves. The models' agentic tool use represented a practical convergence of reasoning and action that many researchers had treated as a longer-horizon milestone. At the same time, the system card's disclosure of increased hallucination under high reasoning effort provided ammunition to those who argue that scaling reasoning depth without corresponding reliability improvements creates new failure modes rather than eliminating existing ones.
