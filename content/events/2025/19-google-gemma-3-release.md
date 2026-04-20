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
    title: "Introducing Gemma 3"
    type: official
    date: 2025-03-12
  - url: https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf
    title: "Gemma 3 Technical Report"
    type: primary_document
    date: 2025-03-12
---

## Summary

Google DeepMind released Gemma 3, a family of four open-weight multimodal models spanning 1B to 27B parameters with vision capabilities, 128K context, and support for over 140 languages. The 27B variant outperformed Gemini 1.5 Pro on several benchmarks — a notable reversal where an open-weight model exceeded a commercially deployed proprietary predecessor from the same lab. The Gemma license's restriction on using the models to train competing products sparked renewed debate about what counts as genuinely "open."

## What Happened

On March 12, 2025, Google DeepMind published Gemma 3 in four sizes: 1B, 4B, 12B, and 27B parameters. All variants incorporated multimodal vision through a frozen SigLIP encoder, allowing image understanding without the full cost of end-to-end vision training. Context length extended to 128K tokens, and the models supported over 140 languages — a substantial improvement in multilingual coverage over earlier Gemma generations.

Benchmark results for the 27B model showed performance surpassing Gemini 1.5 Pro on multiple standard evaluations, positioning Gemma 3 as competitive with models that Google itself had previously charged commercial API rates for. The 1B model was designed specifically for on-device deployment on mobile hardware.

The release used the Gemma Terms of Use rather than a conventional open-source license. Notably, the terms prohibited using Gemma outputs to train models that compete with Google products — a restriction absent from Apache 2.0 and MIT licenses. This clause triggered criticism from open-source advocates and reignited a broader argument about whether models with commercial restriction carve-outs deserve the "open" label.

## Why It Matters

Gemma 3 demonstrated that a lab releasing an open-weight model that exceeds its own prior-generation commercial product — while imposing distillation restrictions — occupies an ambiguous position in the open-vs-closed spectrum. The release sharpened the conceptual distinction between "weights available for download" and "fully open" in the tradition of open-source software.

It also raised a recurring structural question: when a proprietary lab releases open weights with usage restrictions, is this genuinely contributing to the open ecosystem, or is it a controlled release designed to capture goodwill while preserving competitive moats? The Gemma 3 license debate became a reference point in subsequent discussions of AI openness standards.
