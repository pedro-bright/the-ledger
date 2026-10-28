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
    title: Mistral Small 3
    type: official
    date: '2025-01-30'
  - url: https://huggingface.co/mistralai/Mistral-Small-24B-Instruct-2501
    title: Mistral-Small-24B-Instruct-2501 Model Card
    type: primary_document
    date: '2025-01-30'
  - url: https://www.apache.org/licenses/LICENSE-2.0
    title: 'Apache License, Version 2.0 (section 4: Redistribution)'
    type: primary_document
    publisher: Apache Software Foundation
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261019140747/https://www.apache.org/licenses/LICENSE-2.0
revision:
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

Mistral AI released Mistral Small 3, a 24B-parameter language model, under Apache 2.0 on January 30, 2025.
Apache 2.0 permits commercial use, modification, and redistribution subject to its conditions, including preservation of relevant notices; it does not provide a blanket exemption from attribution requirements.

## Editorial correction, October&nbsp;26,&nbsp;2026

Apache 2.0 section 4 requires a copy of the license for recipients, notices of modified files, retention of relevant source notices, and applicable NOTICE attribution in redistributed derivative works.
The original body's unconditional no-attribution wording is withdrawn.
This describes the license text rather than promising that any particular distribution satisfies it.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-mistral-small-3-release-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

Released on January 30, 2025, Mistral Small 3 is a 24B dense transformer with a 32K token context window and integrated support for structured function calling. The model achieved over 81% on the MMLU benchmark and demonstrated strong performance on coding and instruction-following tasks relative to its parameter count. Mistral positioned it explicitly as a deployment-optimized model for developers running inference locally or on constrained cloud infrastructure.

The Apache 2.0 license — one of the most permissive available — allowed unrestricted commercial use, modification, and redistribution without attribution requirements. This distinguished it from models using custom licenses with carve-outs for distillation or commercial scale. Model weights were published on Hugging Face.

The 24B scale sits in a practical range for single-GPU or two-GPU inference on consumer hardware, making it accessible for teams building latency-sensitive applications or working in regulated environments where data cannot leave local infrastructure.

## Why It Matters

Mistral Small 3 reinforced Mistral's strategic positioning as a European open-source counterweight to US frontier labs. By pairing genuine functional capability with a fully permissive license, it offered a credible alternative to closed API products for developers who prioritized cost control and data sovereignty.

The release also contributed to a growing body of evidence that the 20-30B parameter range could serve most enterprise use cases at a fraction of the cost of 100B+ models. As the open-weight ecosystem matured, Mistral Small 3 exemplified the "good enough open" tier — models that didn't claim frontier performance but were freely deployable and practically capable.
