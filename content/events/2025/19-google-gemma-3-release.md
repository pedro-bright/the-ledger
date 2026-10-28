---
id: google-gemma-3-release
title: "Google Releases Gemma 3 Open-Weight Multimodal Family"
date: 2025-03-12
category: open-source
significance: major
confidence: high
actors:
  - id: google-deepmind
    role: subject
regions: [US]
tags: [open-weights, multimodal, vision, license-debate, distillation]
threads: [open-vs-closed-weights]
sources:
  - url: https://developers.googleblog.com/en/introducing-gemma3/
    title: Introducing Gemma 3
    type: official
    date: '2025-03-12'
  - url: https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf
    title: Gemma 3 Technical Report
    type: primary_document
    date: '2025-03-12'
  - url: https://ai.google.dev/gemma/docs/core/model_card_3
    title: Gemma 3 model card
    type: primary_document
    publisher: Google DeepMind
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261024154051/https://ai.google.dev/gemma/docs/core/model_card_3
  - url: https://developers.googleblog.com/gemma-explained-whats-new-in-gemma-3/
    title: 'Gemma explained: What’s new in Gemma 3'
    type: primary_document
    publisher: Google
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20260824065808/https://developers.googleblog.com/gemma-explained-whats-new-in-gemma-3/
revision:
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

Google DeepMind released Gemma 3 on March 12, 2025 in 1B, 4B, 12B, and 27B sizes.
The 1B model accepted text only and had a 32K-token context window; the 4B, 12B, and 27B models accepted text and images with 128K context.
The release used Google's Gemma terms rather than Apache 2.0 or MIT.

## Editorial correction (2026-10-26)

The model card assigns 128K context to 4B/12B/27B and 32K to 1B, while Google's developer explanation identifies 1B as text-only.
The original summary and body incorrectly generalized vision and 128K context to every launch variant.
Later additions to the Gemma family are not backdated to this four-size launch.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-google-gemma-3-release-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

On March 12, 2025, Google DeepMind published Gemma 3 in four sizes: 1B, 4B, 12B, and 27B parameters. All variants incorporated multimodal vision through a frozen SigLIP encoder, allowing image understanding without the full cost of end-to-end vision training. Context length extended to 128K tokens, and the models supported over 140 languages — a substantial improvement in multilingual coverage over earlier Gemma generations.

Benchmark results for the 27B model showed performance surpassing Gemini 1.5 Pro on multiple standard evaluations, positioning Gemma 3 as competitive with models that Google itself had previously charged commercial API rates for. The 1B model was designed specifically for on-device deployment on mobile hardware.

The release used the Gemma Terms of Use rather than a conventional open-source license. Notably, the terms prohibited using Gemma outputs to train models that compete with Google products — a restriction absent from Apache 2.0 and MIT licenses. This clause triggered criticism from open-source advocates and reignited a broader argument about whether models with commercial restriction carve-outs deserve the "open" label.

## Why It Matters

Gemma 3 demonstrated that a lab releasing an open-weight model that exceeds its own prior-generation commercial product — while imposing distillation restrictions — occupies an ambiguous position in the open-vs-closed spectrum. The release sharpened the conceptual distinction between "weights available for download" and "fully open" in the tradition of open-source software.

It also raised a recurring structural question: when a proprietary lab releases open weights with usage restrictions, is this genuinely contributing to the open ecosystem, or is it a controlled release designed to capture goodwill while preserving competitive moats? The Gemma 3 license debate became a reference point in subsequent discussions of AI openness standards.
