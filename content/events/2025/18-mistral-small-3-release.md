---
id: mistral-small-3-release
title: "Mistral AI Releases Small 3 — 24B Apache-2.0 Open-Weight Model"
date: 2025-01-30
category: open-source
significance: notable
confidence: high
actors:
  - id: mistral
    role: subject
regions: [EU]
tags: [open-weights, small-models, function-calling, local-deployment]
threads: [open-vs-closed-weights]
sources:
  - url: https://mistral.ai/news/mistral-small-3
    title: "Mistral Small 3"
    type: official
    date: 2025-01-30
  - url: https://huggingface.co/mistralai/Mistral-Small-24B-Instruct-2501
    title: "Mistral-Small-24B-Instruct-2501 Model Card"
    type: primary_document
    date: 2025-01-30
---

## Summary

Mistral AI released Mistral Small 3, a 24-billion parameter dense language model under the Apache 2.0 license. Scoring above 81% on MMLU with a 32K token context window and native function calling, it was designed to be fast and efficient enough for local deployment while matching mid-tier API models in capability.

## What Happened

Released on January 30, 2025, Mistral Small 3 is a 24B dense transformer with a 32K token context window and integrated support for structured function calling. The model achieved over 81% on the MMLU benchmark and demonstrated strong performance on coding and instruction-following tasks relative to its parameter count. Mistral positioned it explicitly as a deployment-optimized model for developers running inference locally or on constrained cloud infrastructure.

The Apache 2.0 license — one of the most permissive available — allowed unrestricted commercial use, modification, and redistribution without attribution requirements. This distinguished it from models using custom licenses with carve-outs for distillation or commercial scale. Model weights were published on Hugging Face.

The 24B scale sits in a practical range for single-GPU or two-GPU inference on consumer hardware, making it accessible for teams building latency-sensitive applications or working in regulated environments where data cannot leave local infrastructure.

## Why It Matters

Mistral Small 3 reinforced Mistral's strategic positioning as a European open-source counterweight to US frontier labs. By pairing genuine functional capability with a fully permissive license, it offered a credible alternative to closed API products for developers who prioritized cost control and data sovereignty.

The release also contributed to a growing body of evidence that the 20-30B parameter range could serve most enterprise use cases at a fraction of the cost of 100B+ models. As the open-weight ecosystem matured, Mistral Small 3 exemplified the "good enough open" tier — models that didn't claim frontier performance but were freely deployable and practically capable.
