---
id: sr-openai-gpt-5-5-release-20261026
target_summary_id: openai-gpt-5-5-release
prior_version: >-
  On April 23, 2026, OpenAI released GPT-5.5 — internally codenamed "Spud" — its first fully retrained base model since GPT-4.5.
  Unlike the intervening GPT-5.x variants, GPT-5.5 was rebuilt from scratch with a natively omnimodal architecture processing text, images, audio, and video through a single unified model.
  It is the first OpenAI API model to ship with a one-million-token context window as the baseline and posted new benchmark records at release on SWE-bench Verified (88.7%) and Terminal-Bench 2.0 (82.7%).
new_version: |-
  OpenAI announced GPT-5.5 on April 23, 2026, with API availability added on April 24.
  Its announced 1M-token API context was not OpenAI's first million-token offering: GPT-4.1 had supported up to 1M tokens in the API since April 14, 2025.
  GPT-5.3-Codex, mentioned in the original chronology, was released on February 5, 2026.
reason: >-
  The million-token first claim is contradicted by GPT-4.1's primary announcement.
  The source for GPT-5.3-Codex establishes February 5, not March 2026.
  GPT-5.5's own announcement distinguishes 1M API context from 400K in Codex and adds API availability in its April 24 update.
  The original summary is preserved in this revision record.
  Other architectural and benchmark assertions in the original body are retained as historical assertions and require a separate source review.
changed_claim_ids:
  - openai-gpt-5-5-release
author: codex-ai-assisted
created_at: "2026-10-26"
---

## Scope

The million-token first claim is contradicted by GPT-4.1's primary announcement.
The source for GPT-5.3-Codex establishes February 5, not March 2026.
GPT-5.5's own announcement distinguishes 1M API context from 400K in Codex and adds API availability in its April 24 update.
The original summary is preserved in this revision record.
Other architectural and benchmark assertions in the original body are retained as historical assertions and require a separate source review.

This AI-assisted revision was prepared under Terry Tang's approval of the 22 editorial findings.
It records the correction and its evidence without claiming a new human review of the retained narrative.

## Event location and identity

Original file: `content/events/2026/29-openai-gpt-5-5-release.md`.
Current file: [`content/events/2026/29-openai-gpt-5-5-release.md`](https://github.com/pedro-bright/the-ledger/blob/main/content/events/2026/29-openai-gpt-5-5-release.md).
The event ID remains `openai-gpt-5-5-release`; its public URL is [unchanged](https://the-ledger.net/events/openai-gpt-5-5-release/).

## Evidence

[Introducing GPT-4.1 in the API](https://openai.com/index/gpt-4-1/).

```yaml
url: https://openai.com/index/gpt-4-1/
title: Introducing GPT-4.1 in the API
type: primary_document
publisher: OpenAI
date: "2025-04-14"
accessed: "2026-10-26"
archive_url: https://web.archive.org/web/20261016135154/https://openai.com/index/gpt-4-1/
```

[Introducing GPT-5.3-Codex](https://openai.com/index/introducing-gpt-5-3-codex/).

```yaml
url: https://openai.com/index/introducing-gpt-5-3-codex/
title: Introducing GPT-5.3-Codex
type: primary_document
publisher: OpenAI
date: "2026-02-05"
accessed: "2026-10-26"
archive_url: https://web.archive.org/web/20261010022457/https://openai.com/index/introducing-gpt-5-3-codex/
```

## Original metadata

This snapshot preserves the title, date, source metadata, and review fields before this revision.
The original narrative from `## What Happened` onward remains verbatim in the event.

```yaml
id: openai-gpt-5-5-release
title: "OpenAI Releases GPT-5.5, First Fully Retrained Base Model Since GPT-4.5"
date: 2026-04-23
category: models
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/introducing-gpt-5-5/
    title: "Introducing GPT-5.5"
    type: primary_document
    publisher: OpenAI
    date: 2026-04-23
    accessed: 2026-04-26
    archive_url: https://web.archive.org/web/*/https://openai.com/index/introducing-gpt-5-5/
  - url: https://techcrunch.com/2026/04/23/openai-chatgpt-gpt-5-5-ai-model-superapp/
    title: "OpenAI Releases GPT-5.5, Moves Toward 'Super App' Vision"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-04-23
    accessed: 2026-04-26
  - url: https://www.cnbc.com/2026/04/23/openai-announces-latest-artificial-intelligence-model.html
    title: "OpenAI Announces Latest Artificial Intelligence Model"
    type: secondary_reporting
    publisher: CNBC
    date: 2026-04-23
    accessed: 2026-04-26
  - url: https://www.axios.com/2026/04/23/openai-releases-spud-gpt-model
    title: "OpenAI Releases 'Spud' GPT Model"
    type: secondary_reporting
    publisher: Axios
    date: 2026-04-23
    accessed: 2026-04-26
actors:
  - id: openai
    role: subject
regions: [US]
tags: [models, omnimodal, benchmarks, context-window, agentic, openai]
threads: [scaling-laws-debate]
related: []
state: published
revision:
  created: 2026-04-26
  last_reviewed: 2026-04-26
  draft_assistance: ai-assisted
  final_author: terry-tang
```
