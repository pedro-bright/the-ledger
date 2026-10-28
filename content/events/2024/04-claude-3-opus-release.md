---
id: claude-3-opus-release
title: Anthropic Announces Claude 3 Family and Releases Opus and Sonnet
date: 2024-03-04
category: models
significance: landmark
confidence: high
actors:
  - id: anthropic
    role: developer
regions: [US]
tags: [large-language-model, frontier-model, multimodal, model-family]
threads: [scaling-laws-debate, open-vs-closed-weights]
sources:
  - url: https://www.anthropic.com/news/claude-3-family
    title: Introducing the next generation of Claude
    type: primary_document
    publisher: Anthropic
    date: '2024-03-04'
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261022214738/https://www.anthropic.com/news/claude-3-family
  - url: https://www-cdn.anthropic.com/de8ba9b01c9ab7cbabf5c33b80b7bbc618857627/Model_Card_Claude_3.pdf
    title: 'The Claude 3 Model Family: Opus, Sonnet, and Haiku'
    type: primary
  - url: https://www.anthropic.com/news/claude-3-haiku
    title: 'Claude 3 Haiku: our fastest model yet'
    type: primary_document
    publisher: Anthropic
    date: '2024-03-13'
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261012091321/https://www.anthropic.com/news/claude-3-haiku
revision:
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

Anthropic announced the Claude 3 family on March 4, 2024 and made Opus and Sonnet available that day.
Haiku was announced as forthcoming and became available on March 13.
Anthropic reported that Opus surpassed competing models on several evaluations.

## Editorial correction (2026-10-26)

The March 4 family announcement explicitly separates available Opus/Sonnet models from forthcoming Haiku.
The March 13 Haiku announcement establishes its later release.
The original body's simultaneous-launch assertion is retained as the historical assertion, not the current account.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-claude-3-opus-release-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

On March 4, 2024, Anthropic launched three new models simultaneously: Claude 3 Opus (the most capable), Claude 3 Sonnet (balanced performance and speed), and Claude 3 Haiku (fastest and most cost-effective). All three models supported vision capabilities, processing both text and images.

Claude 3 Opus achieved new benchmarks in AI capability: it scored 86.8% on MMLU (comparable to GPT-4's reported scores), 95.0% on GSM8K (math), and showed particularly strong performance on graduate-level reasoning benchmarks. Anthropic stated it "sets new industry benchmarks across a wide range of cognitive tasks."

The three-tier release strategy was strategically significant: it acknowledged that different use cases required different capability-cost trade-offs, and gave customers flexibility to choose the right model for each application. Haiku, in particular, was priced aggressively for high-volume applications, while Opus competed directly with GPT-4 at the frontier.

Anthropic also emphasized improvements in safety and reduced harmful outputs, consistent with its Constitutional AI methodology. The models showed improved capability in following nuanced instructions and reduced tendencies toward both over-refusal and harmful compliance.

## Why It Matters

Claude 3 Opus was the first model to credibly challenge GPT-4's claim to being the world's most capable AI model. This was significant not just as a competitive milestone but as validation that the frontier was not a single-company affair — that the combination of safety research, constitutional AI training, and sufficient scale could produce world-class results.

The three-tier model family (a naming convention that evoked luxury branding) established a pattern that would become industry standard. Rather than releasing a single model and competing solely on capability, companies could compete across a capability-cost spectrum, serving everything from real-time consumer applications (Haiku) to complex professional workloads (Opus).

For the scaling debate, Claude 3's performance suggested that Anthropic's safety-focused training approach — which some had predicted would come at a capability cost — was not in fact limiting the company's ability to compete at the frontier. This was an important empirical data point in the argument that safety and capability were not fundamentally in tension.
