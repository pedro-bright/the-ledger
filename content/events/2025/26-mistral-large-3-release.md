---
id: mistral-large-3-release
title: "Mistral AI Releases Large 3 — 675B Open-Weight MoE"
date: 2025-12-02
category: open-source
significance: major
confidence: high
actors:
  - id: mistral
    role: subject
regions: [EU]
tags: [open-weights, moe, vision, multilingual, apache-2]
threads: [open-vs-closed-weights]
sources:
  - url: https://mistral.ai/news/mistral-3
    title: "Mistral 3"
    type: official
    date: 2025-12-02
  - url: https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512
    title: "Mistral-Large-3-675B-Instruct-2512 Model Card"
    type: primary_document
    date: 2025-12-02
  - url: https://techcrunch.com/2025/12/02/mistral-closes-in-on-big-ai-rivals-with-mistral-3-open-weight-frontier-and-small-models/
    title: "Mistral Closes In on Big AI Rivals with Mistral 3 Open-Weight Frontier and Small Models"
    type: secondary_reporting
    date: 2025-12-02
---

## Summary

Mistral AI released Mistral Large 3, a 675-billion parameter mixture-of-experts model activating 41 billion parameters per forward pass, under Apache 2.0 — making it one of the largest fully permissive open-weight models available. With native vision capabilities, 256K context, multilingual support, and an LMSYS Arena Elo of 1418, it positioned the French startup as a serious competitor at the MoE frontier. The model was trained on 3,000 H100 GPUs.

## What Happened

Released on December 2, 2025 — one day after DeepSeek V3.2 — Mistral Large 3 entered a dense competitive window for open-weight frontier releases. The 675B total / 41B active MoE architecture incorporated a native vision pathway for image understanding alongside text, a 256K token context window, and multilingual instruction following across European and Asian languages.

Mistral used Apache 2.0, with no distillation restrictions or commercial use carve-outs — the most permissive license available for a model at this scale. On the LMSYS Chatbot Arena, the model achieved an Elo rating of 1418, placing it among the top-ranked publicly accessible models. Mistral reported a training infrastructure of 3,000 Nvidia H200 GPUs, a detail notable for transparency into the compute investment underlying a major open release.

The simultaneous announcement included a revised set of smaller Mistral models, reinforcing the company's strategy of maintaining both edge-deployable and frontier-class open offerings.

## Why It Matters

Mistral Large 3 was significant both for its scale and its timing. Released the day after DeepSeek V3.2, it contributed to a concentrated December 2025 moment where open-weight frontier models were being released at a pace that matched or exceeded proprietary API product cycles. Two frontier MoE models with hundreds of billions of parameters, both MIT or Apache licensed, released in consecutive days from labs in China and France.

For the open-vs-closed debate, Mistral Large 3 illustrated that fully permissive open-weight release was now viable at frontier scale from a commercially funded European lab. The Apache 2.0 license — with no restrictions on derivative works, distillation, or commercial deployment — represented a commitment to genuine openness that distinguished Mistral from larger labs releasing weights with usage restrictions. The LMSYS Elo placement confirmed competitive capability alongside the licensing transparency.
