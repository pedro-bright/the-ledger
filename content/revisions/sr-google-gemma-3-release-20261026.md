---
id: sr-google-gemma-3-release-20261026
target_summary_id: google-gemma-3-release
prior_version: >-
  Google DeepMind released Gemma 3, a family of four open-weight multimodal models spanning 1B to 27B parameters with vision capabilities, 128K context, and support for over 140 languages.
  The 27B variant outperformed Gemini 1.5 Pro on several benchmarks — a notable reversal where an open-weight model exceeded a commercially deployed proprietary predecessor from the same lab.
  The Gemma license's restriction on using the models to train competing products sparked renewed debate about what counts as genuinely "open."
new_version: |-
  Google DeepMind released Gemma 3 on March 12, 2025 in 1B, 4B, 12B, and 27B sizes.
  The 1B model accepted text only and had a 32K-token context window; the 4B, 12B, and 27B models accepted text and images with 128K context.
  The release used Google's Gemma terms rather than Apache 2.0 or MIT.
reason: >-
  The model card assigns 128K context to 4B/12B/27B and 32K to 1B, while Google's developer explanation identifies 1B as text-only.
  The original summary and body incorrectly generalized vision and 128K context to every launch variant.
  Later additions to the Gemma family are not backdated to this four-size launch.
changed_claim_ids:
  - google-gemma-3-release
author: codex-ai-assisted
created_at: "2026-10-26"
---

## Scope

The model card assigns 128K context to 4B/12B/27B and 32K to 1B, while Google's developer explanation identifies 1B as text-only.
The original summary and body incorrectly generalized vision and 128K context to every launch variant.
Later additions to the Gemma family are not backdated to this four-size launch.

This AI-assisted revision was prepared under Terry Tang's approval of the 22 editorial findings.
It records the correction and its evidence without claiming a new human review of the retained narrative.

## Event location and identity

Original file: `content/events/2025/19-google-gemma-3-release.md`.
Current file: [`content/events/2025/19-google-gemma-3-release.md`](https://github.com/pedro-bright/the-ledger/blob/main/content/events/2025/19-google-gemma-3-release.md).
The event ID remains `google-gemma-3-release`; its public URL is [unchanged](https://the-ledger.net/events/google-gemma-3-release/).

## Evidence

[Gemma 3 model card](https://ai.google.dev/gemma/docs/core/model_card_3).

```yaml
url: https://ai.google.dev/gemma/docs/core/model_card_3
title: Gemma 3 model card
type: primary_document
publisher: Google DeepMind
accessed: "2026-10-26"
archive_url: https://web.archive.org/web/20261024154051/https://ai.google.dev/gemma/docs/core/model_card_3
```

[Gemma explained: What’s new in Gemma 3](https://developers.googleblog.com/gemma-explained-whats-new-in-gemma-3/).

```yaml
url: https://developers.googleblog.com/gemma-explained-whats-new-in-gemma-3/
title: "Gemma explained: What’s new in Gemma 3"
type: primary_document
publisher: Google
accessed: "2026-10-26"
archive_url: https://web.archive.org/web/20260824065808/https://developers.googleblog.com/gemma-explained-whats-new-in-gemma-3/
```

## Original metadata

This snapshot preserves the title, date, source metadata, and review fields before this revision.
The original narrative from `## What Happened` onward remains verbatim in the event.

```yaml
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
```
