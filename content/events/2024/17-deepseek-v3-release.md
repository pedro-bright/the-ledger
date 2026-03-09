---
id: deepseek-v3-release
title: "DeepSeek Releases DeepSeek-V3, High-Performance Open-Weight Model"
date: 2024-12-25
category: open-source
significance: major
confidence: high
actors:
  - id: chinese-government
    role: regulatory-context
regions: [CN, US]
tags: [open-weights, chinese-ai, efficiency, mixture-of-experts, cost-efficiency]
threads: [open-vs-closed-weights, scaling-laws-debate]
sources:
  - url: https://github.com/deepseek-ai/DeepSeek-V3
    title: "DeepSeek-V3 GitHub Repository"
    type: primary
  - url: https://arxiv.org/abs/2412.19437
    title: "DeepSeek-V3 Technical Report"
    type: primary
---

## Summary

Chinese AI lab DeepSeek released DeepSeek-V3, a 671-billion parameter Mixture-of-Experts model trained for approximately $5.6 million that performed competitively with GPT-4o and Claude 3.5 Sonnet. The release challenged Western assumptions about the compute requirements for frontier AI development and the effectiveness of US export controls on advanced AI chips.

## What Happened

On December 25, 2024, DeepSeek released DeepSeek-V3, a large open-weight model using a Mixture-of-Experts architecture with 671 billion total parameters (37 billion active per token). The model was trained on 14.8 trillion tokens using 2,048 NVIDIA H800 GPUs — a version of the H100 modified to comply with US export restrictions on advanced AI chips to China.

The most striking aspect of the release was the reported training cost: approximately $5.6 million, a fraction of the estimated hundreds of millions spent on comparable Western models. DeepSeek attributed this efficiency to architectural innovations including Multi-head Latent Attention (MLA) for efficient inference and DeepSeekMoE for efficient training.

DeepSeek-V3 performed competitively with leading proprietary models on standard benchmarks, particularly excelling in math and coding tasks. It was released under an MIT-derivative license, making it one of the most capable fully open models available.

## Why It Matters

DeepSeek-V3 sent shockwaves through the Western AI industry for two reasons. First, it demonstrated that frontier-competitive AI models could be developed at a fraction of the cost that Western labs were spending — raising uncomfortable questions about whether the billions being invested in Western AI development were efficiently allocated.

Second, it challenged the premise of US export controls on advanced AI chips. The US government had restricted exports of NVIDIA's most advanced GPUs to China precisely to slow Chinese AI development. DeepSeek's ability to train a competitive model using the less powerful H800s, through architectural efficiency, suggested that export controls were a less effective bottleneck than policymakers had assumed.

The release previewed the seismic impact that DeepSeek-R1 would have just weeks later, and began reshaping assumptions about the relationship between compute spending and AI capability — a central question in the scaling laws debate.
