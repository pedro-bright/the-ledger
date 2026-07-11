---
id: openai-gpt-live-1-full-duplex-voice
title: "OpenAI Deploys GPT-Live-1, First Consumer-Scale Full-Duplex AI Voice Model"
date: 2026-07-08
category: models
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/introducing-gpt-live/
    title: "Introducing GPT-Live"
    type: official
    publisher: OpenAI
    date: 2026-07-08
    accessed: 2026-07-11
    archive_url: https://web.archive.org/web/*/https://openai.com/index/introducing-gpt-live/
  - url: https://deploymentsafety.openai.com/gpt-live
    title: "GPT-Live System Card"
    type: primary_document
    publisher: OpenAI
    date: 2026-07-08
    accessed: 2026-07-11
    archive_url: https://web.archive.org/web/*/https://deploymentsafety.openai.com/gpt-live
  - url: https://techcrunch.com/2026/07/08/openai-releases-new-voice-models-for-more-natural-live-conversations/
    title: "OpenAI releases new voice models for more natural live conversations"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-07-08
    accessed: 2026-07-11
actors:
  - id: openai
    role: subject
regions: [US]
tags: [voice-ai, full-duplex, conversational-ai, audio-models, chatgpt, real-time]
threads: []
related: []
state: published
revision:
  created: 2026-07-11
  last_reviewed: 2026-07-11
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On July 8, 2026, OpenAI released GPT-Live-1 and GPT-Live-1 mini, deploying them globally as the default voice models in ChatGPT. Both models use a full-duplex architecture that continuously processes audio input while simultaneously generating speech output, allowing users to interrupt, interject, and speak naturally without waiting for the model to finish a turn. GPT-Live-1 replaces ChatGPT's Advanced Voice Mode for paid subscribers; GPT-Live-1 mini is the default for free-tier users. The release is accompanied by a system card published at OpenAI's Deployment Safety Hub.

## What Happened

OpenAI announced GPT-Live-1 and GPT-Live-1 mini on July 8, 2026, and began a global rollout to ChatGPT users the same day. The models represent a departure from the turn-based voice architecture that ChatGPT had used since the introduction of Advanced Voice Mode in late 2024. Where previous voice mode required each speaker to complete a turn before the model could respond, GPT-Live operates on a full-duplex architecture: a continuous interaction model processes incoming audio in real time and makes interaction decisions — whether to speak, listen, pause, interrupt, or delegate to a tool — at a rate described by OpenAI as multiple times per second.

The architecture consists of two functional layers. An outer model handles continuous conversational management: detecting turn boundaries, deciding when to respond, and producing immediate verbal signals of engagement such as "mhmm" or brief acknowledgments. An inner layer — delegating to a version of GPT-5.5 — handles complex reasoning, tool invocation, and tasks requiring more extended computation, including web search and code execution. The outer model can maintain a live conversational thread while the inner model processes a delegated request in the background, returning results to the conversation without interrupting it.

Performance figures disclosed in the system card show substantial gains over prior voice models on standard benchmarks. On GPQA Diamond, GPT-Live-1 achieves 84.2 percent, compared to 45.3 percent for the preceding voice model. On BrowseComp, GPT-Live-1 achieves 75.2 percent, compared to 0.7 percent for the predecessor — a benchmark category that tests the model's ability to find specific information through multi-step web navigation. The BrowseComp figure reflects the inner-layer delegation architecture, which enables the voice interface to invoke browsing and research tasks that were not accessible through prior voice modes.

GPT-Live-1 also supports real-time spoken translation and can present information in visual formats within the ChatGPT interface during a voice conversation. The system card identifies several limitations: the model occasionally generates responses before a user has finished speaking; it has reduced capability in non-English languages compared to GPT-5.5 in text mode; and the continuous interaction model can, in some circumstances, be prompted to produce misleading verbal signals of attentiveness without tracking the underlying content accurately.

## Why It Matters

Prior consumer AI voice interfaces — including Google Assistant, Amazon Alexa, Apple Siri, and OpenAI's own Advanced Voice Mode — operated on a push-to-talk or turn-detection model. The user spoke, the model detected silence or an explicit signal, and then the model responded. Full-duplex voice, in which both parties can speak simultaneously and the model processes incoming audio continuously regardless of whether it is also producing output, changes the interaction model in ways that are difficult to replicate in turn-based systems: natural interruption, back-channel signals, parallel task execution during a spoken conversation.

GPT-Live-1 is the first deployment of a full-duplex architecture at consumer scale — across all ChatGPT paid tiers and, via the mini variant, at the free tier as well. Prior demonstrations of full-duplex AI voice, including OpenAI's own GPT-4o demo in May 2024, were announced before the capability was broadly deployed; GPT-Live-1 represents the production deployment rather than a research preview. The BrowseComp jump from 0.7 percent to 75.2 percent in the voice interface, enabled by the inner-layer delegation to GPT-5.5, is directly attributable to the two-layer architecture: the outer model's ability to hand off to a capable reasoning model while maintaining a live conversation thread, rather than blocking the conversation until computation completes.

What is not addressed in the public system card: the cost per conversation-minute for GPT-Live-1 at OpenAI's inference cost structure; how the two-layer architecture handles privacy and logging at the inner delegation layer differently from the outer layer; and what the latency distribution looks like in practice for the inner-layer delegation path under load. The system card's identification of limitations in non-English languages also points to an uneven deployment: the largest share of non-English ChatGPT users will receive a weaker voice experience than the benchmarks suggest, without a clear public disclosure of which languages are materially degraded.
