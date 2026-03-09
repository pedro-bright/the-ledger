---
id: xai-grok-open-source
title: "xAI Open-Sources Grok-1 Model Weights"
date: 2024-03-17
category: open-source
significance: notable
confidence: high
actors:
  - id: xai
    role: developer
regions: [US]
tags: [open-weights, mixture-of-experts, elon-musk]
threads: [open-vs-closed-weights]
sources:
  - url: https://x.ai/blog/grok-os
    title: "Open Release of Grok-1"
    type: primary
  - url: https://github.com/xai-org/grok-1
    title: "Grok-1 GitHub Repository"
    type: primary
---

## Summary

Elon Musk's xAI released the weights and architecture of Grok-1, a 314-billion parameter Mixture-of-Experts model, under the Apache 2.0 license. The release came amid Musk's lawsuit against OpenAI for abandoning its open-source roots, lending credence to his positioning as a champion of AI openness.

## What Happened

On March 17, 2024, xAI released Grok-1, the model powering the Grok chatbot on X (formerly Twitter). At 314 billion parameters with a Mixture-of-Experts architecture, it was one of the largest models ever open-sourced at the time of release. The model was released under the Apache 2.0 license with no restrictions on use.

The release included the raw model weights and network architecture but not training code or data. The model was a base pretrained model without fine-tuning, meaning it was less immediately useful than fine-tuned alternatives but provided a powerful foundation for the open-source community.

The timing was widely interpreted as strategic: Musk had filed a lawsuit against OpenAI just weeks earlier (in February 2024), alleging that the company had broken its founding agreement to develop AI openly. Open-sourcing Grok-1 bolstered Musk's positioning as an advocate for open AI development.

## Why It Matters

Grok-1's release added another data point to the open-weights landscape and demonstrated that even well-funded commercial AI efforts could choose to open-source their models. However, the practical impact was limited compared to Meta's Llama releases because xAI did not provide the fine-tuning or instruction-tuning that made models immediately deployable.

The release was arguably more significant as a strategic and political move than as a technical contribution. It positioned Musk and xAI on the "open" side of the AI debate at a moment when the open-vs-closed-weights question was intensifying, and it provided tactical support for Musk's legal action against OpenAI.
