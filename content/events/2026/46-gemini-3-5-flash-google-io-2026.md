---
id: gemini-3-5-flash-google-io-2026
title: "Google Releases Gemini 3.5 Flash at Google I/O 2026, Surpassing Prior Pro Tier at Lower Cost"
date: 2026-05-19
category: models
significance: notable
confidence: high
sources:
  - url: https://deepmind.google/models/model-cards/gemini-3-5-flash/
    title: "Gemini 3.5 Flash Model Card"
    type: primary_document
    publisher: Google DeepMind
    date: 2026-05-19
    accessed: 2026-05-23
    archive_url: https://web.archive.org/web/*/https://deepmind.google/models/model-cards/gemini-3-5-flash/
  - url: https://techcrunch.com/2026/05/19/with-gemini-3-5-flash-google-bets-its-next-ai-wave-on-agents-not-chatbots/
    title: "With Gemini 3.5 Flash, Google Bets Its Next AI Wave on Agents, Not Chatbots"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-05-19
    accessed: 2026-05-23
actors:
  - id: google-deepmind
    role: subject
  - id: google
    role: subject
regions: []
tags: [model-release, google-io, agentic-ai, multimodal, coding, google-deepmind, benchmark]
threads: []
related: []
state: published
revision:
  created: 2026-05-23
  last_reviewed: 2026-05-23
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On May 19, 2026, Google released Gemini 3.5 Flash at its Google I/O developer conference in Mountain View. Despite the "Flash" designation — previously associated with Google's lighter, cost-optimized model tier — Gemini 3.5 Flash outperformed Gemini 3.1 Pro on coding and agentic benchmarks at launch, at pricing approximately 40 percent lower than its predecessor Pro model. Google deployed it simultaneously across the Gemini app, AI Mode in Google Search, and the newly announced Google Antigravity agent-first developer platform.

## What Happened

Google unveiled Gemini 3.5 Flash during the Google I/O 2026 keynote on May 19. The model accepts text, image, video, audio, and PDF inputs with a one-million-token context window and 64,000-token maximum output length. Google reported inference speed of approximately four times faster than other frontier models on output tokens per second — the speed advantage the company cited as central to the model's positioning for agentic workloads, where fast token generation compounds across multi-step task chains.

Benchmark scores at launch (vendor-reported): Terminal-Bench 2.1 at 76.2%, MCP Atlas at 83.6%, CharXiv Reasoning (multimodal) at 84.2%, and ARC-AGI-2 at 77.1%. Google stated the model surpasses Gemini 3.1 Pro on coding and agentic benchmarks — Gemini 3.1 Pro had been the company's highest-capability generally available model before the release.

Pricing was set at $1.50 per million input tokens and $9.00 per million output tokens, approximately 40 percent below Gemini 3.1 Pro's pricing. The combination of higher benchmarks and lower cost inverts the prior product-tier logic, where "Flash" had denoted a performance-for-cost tradeoff rather than a capability ceiling.

Google made the model available simultaneously across multiple distribution channels at launch: as the default model for Gemini AI Ultra subscribers in the Gemini application, in AI Mode in Google Search (expanding globally to nearly 200 countries and 98 languages without a subscription requirement), in the Google Antigravity agent-first developer platform, and via the Gemini API in Google AI Studio. Google reported it was processing over 3.2 quadrillion tokens per month across its surfaces at the time of the announcement.

The broader Google I/O 2026 context included the simultaneous announcement of Gemini Omni (a new multimodal model supporting video input and video output), Gemini Spark (a 24/7 personal AI agent running on dedicated Google Cloud virtual machines), and Google Antigravity (an agent-first development platform that provisions a remote Linux environment on a single API call). CEO Sundar Pichai described the AI Mode expansion in Search as "the biggest change in more than 25 years" to the search product.

## Why It Matters

Gemini 3.5 Flash disrupts Google's established model-tier hierarchy. Prior Gemini families organized capability into Pro (highest capability, highest cost), Flash (fast and cheap), and smaller variants. A Flash-designated model that surpasses the prior Pro tier at lower cost compresses that product hierarchy and signals that the capability-per-compute ratio has shifted enough for Google to reset tier definitions rather than preserve them for pricing coherence.

The simultaneous deployment across Search, the Gemini app, the developer API, and the Antigravity platform — rather than a staged rollout starting from developer access — is consistent with Google's stated intent to use AI Mode as the primary interface for its core search product rather than a supplemental feature. The practical effect of rolling Gemini 3.5 Flash into Search for nearly 200 countries at no subscription cost is potentially the largest single-event increase in frontier-model access by volume of users, though utilization per query and capability depth in that context differ substantially from API or chat-interface use.

The benchmark figures are vendor-reported. As of May 19, independent reproduction of Google's claimed scores had not been completed. Google and other frontier labs have faced cases where reported and independently reproduced benchmark results diverged; the reported figures should be treated as upper bounds pending external validation. The ARC-AGI-2 score of 77.1% in particular — a benchmark designed to probe general fluid reasoning rather than narrow task performance — will be subject to scrutiny given that frontier model scores on ARC-AGI-2 have historically been difficult to reproduce in full.

---
