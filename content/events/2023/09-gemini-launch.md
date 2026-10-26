---
id: gemini-launch
title: "Google DeepMind Launches Gemini"
date: 2023-12-06
category: models
significance: landmark
confidence: high
actors:
  - id: google-deepmind
    role: developer
  - id: demis-hassabis
    role: executive
regions: [US]
tags: [multimodal, large-language-model, frontier-model, natively-multimodal]
threads: [scaling-laws-debate]
sources:
  - url: https://blog.google/technology/ai/google-gemini-ai/
    title: 'Introducing Gemini: our largest and most capable AI model'
    type: primary
  - url: https://arxiv.org/abs/2312.11805
    title: 'Gemini: A Family of Highly Capable Multimodal Models'
    type: primary
  - url: https://www.nytimes.com/2023/12/06/technology/google-ai-gemini.html
    title: Google Announces Gemini, Its Most Powerful AI Model
    type: secondary
  - url: https://blog.google/innovation-and-ai/technology/ai/google-gemini-ai/
    title: 'Introducing Gemini: our largest and most capable AI model'
    type: primary_document
    publisher: Google
    date: '2023-12-06'
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261016013712/https://blog.google/innovation-and-ai/technology/ai/google-gemini-ai/
revision:
  draft_assistance: ai-assisted
---

## Summary

Google DeepMind announced the Gemini model family on December 6, 2023 and began rolling out Gemini Pro in Bard that day.
The announcement scheduled developer and enterprise API access through Google AI Studio and Vertex AI for December 13.
Immediate Bard availability did not establish same-day API access.

## Editorial correction (2026-10-26)

The December 6 primary announcement explicitly dates developer API access to December 13.
The original body combined Bard and API availability; the corrected summary distinguishes the product rollout from the announced API schedule.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-gemini-launch-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

On December 6, 2023, Google DeepMind CEO Demis Hassabis announced Gemini, a new family of multimodal AI models in three sizes: Ultra (largest), Pro (mid-tier), and Nano (smallest, designed for on-device use). Google described Gemini as "natively multimodal" — trained from the ground up on text, images, audio, and video, rather than combining separate models for each modality.

Gemini Ultra was positioned as Google's GPT-4 competitor, and the accompanying technical report claimed it was the first model to exceed human-expert performance on the MMLU benchmark (scoring 90.0% vs. GPT-4's 86.4%). The model showed strong performance across text, code, image understanding, and reasoning benchmarks.

However, the launch was quickly overshadowed by controversy. A demo video titled "Hands-on with Gemini" appeared to show the model responding in real-time to voice and visual input, but was later revealed to have been produced using still images and text prompts rather than live interaction. Google acknowledged that the video was "illustrative" but faced significant criticism for misleading marketing.

Gemini Pro was immediately made available in Bard (Google's ChatGPT competitor) and through API. Gemini Ultra was delayed until February 2024, when it launched as part of the rebranded "Gemini Advanced" product.

## Why It Matters

Gemini was the clearest signal that the frontier model race was not a one-company affair. Google, with its vast compute resources, research talent (including the combined DeepMind and Google Brain teams), and distribution through its consumer products, represented the most formidable long-term competitor to OpenAI.

The demo controversy, however, revealed a recurring pattern in AI product launches: the temptation to oversell capabilities outpacing the reality of model performance. This dynamic would repeat throughout 2024 and became a significant trust issue for the industry.

Gemini's multi-size strategy — Ultra for frontier competition, Pro for everyday use, Nano for devices — established a template that other companies would follow. The recognition that different use cases required different model sizes, rather than a single monolithic model, represented a maturing of commercial AI strategy.
