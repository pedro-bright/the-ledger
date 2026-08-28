---
id: openai-jalapeno-first-silicon-benchmarks
title: "OpenAI Publishes First Working-Silicon Benchmarks for Its Jalapeño Inference Processor"
date: 2026-08-25
category: industry
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/jalapeno-first-results
    title: "Jalapeño's first results show industry-leading speed and efficiency in AI inference"
    type: official
    publisher: OpenAI
    date: 2026-08-25
    accessed: 2026-08-28
    archive_url: https://web.archive.org/web/*/https://openai.com/index/jalapeno-first-results
  - url: https://techcrunch.com/2026/08/25/openais-jalapeno-chip-is-built-for-fast-inference-at-scale-benchmarks-show/
    title: "OpenAI's Jalapeño chip is built for fast inference at scale, benchmarks show"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-08-25
    accessed: 2026-08-28
actors:
  - id: openai
    role: subject
  - id: broadcom
    role: counterparty
  - id: nvidia
    role: context
regions: [US]
tags: [custom-silicon, inference, asic, benchmarks, hardware-independence, nvidia-alternatives]
threads: []
related: [openai-broadcom-jalapeno-chip]
state: published
revision:
  created: 2026-08-28
  last_reviewed: 2026-08-28
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 25, 2026, at the Hot Chips 2026 conference, OpenAI published the first benchmark results from working silicon of Jalapeño, the custom inference ASIC it co-designed with Broadcom and announced in June 2026. The company reported 1.5x to 1.9x more AI work per watt at peak throughput and 1.7x to 3.6x lower end-to-end latency than the best Nvidia Blackwell-generation results available at test time. The measurements were run on SemiAnalysis's InferenceX suite. All figures are vendor-reported, the comparison baseline is a hardware generation that Nvidia is currently superseding, and the chip is not yet deployed at volume.

## What Happened

OpenAI released the results in a post titled "Jalapeño's first results show industry-leading speed and efficiency in AI inference," published at 07:00 GMT on August 25, 2026, timed to the Hot Chips 2026 conference. It was the first public performance data from working Jalapeño silicon. The June 24, 2026 announcement of the chip had included only a general claim of "performance per watt substantially better than current state-of-the-art," with no published measurements.

The benchmarks were run on InferenceX, an open-source agentic inference benchmark maintained by the research firm SemiAnalysis, across three open-weight models: GPT-OSS 120B, DeepSeek R1, and Kimi K2.5. OpenAI reported three headline comparisons against the best available Nvidia GB200 and GB300 results at the time of testing: 1.5x to 1.9x more AI work per watt at peak throughput, 1.7x to 3.6x lower end-to-end latency, and a widening advantage of 2.1x to 4.1x on workloads characterized as highly interactive. The chip is rated at 700 watts but sustained 550 watts or less across the tested workloads.

Richard Ho, OpenAI's head of hardware, said on a press call: "The bottom line is that the results show a very, very significant performance advance over state of the art. Jalapeño can serve more AI work per unit of power, while also returning responses more quickly. It's very efficient to serve a lot of customers, but it can also be very low latency." In the post itself, OpenAI attributed the results to data-locality choices: "We designed Jalapeño to minimize data movement and communication delays. This means that model state, including the KV cache used while generating a response, can be explicitly placed and kept local while the system activates the right combination of compute, memory, and networking for each inference phase."

Ho put initial deployment at the end of 2026 "in very small volumes," with meaningful ramp during 2027. The division of labor announced in June remains: OpenAI owns architecture and design, Broadcom owns silicon implementation and networking, and Celestica handles board, rack, and system integration. The chip is fabricated by TSMC.

OpenAI published a second post five minutes later, "The full stack behind abundant intelligence," by CFO Sarah Friar, arguing that cost per token is the wrong efficiency metric because a cheaper model may require more attempts to reach a usable result. The pairing of an engineering disclosure with a CFO framing of unit economics on the same morning was deliberate.

Reporting on the results noted a limitation OpenAI's post did not address. TechCrunch's Russell Brandom observed that the comparison baseline is a Blackwell-generation system, and that by the time Jalapeño reaches full volume in 2027 Nvidia will have shipped its Vera Rubin generation — which entered full production in the quarter ending July 2026. The published figures therefore describe an advantage over hardware that is already being replaced, not over what Jalapeño will actually compete against.

## Why It Matters

The June announcement established that OpenAI intended to build its own inference silicon. This event is the first evidence about whether the chip works. That distinction matters for the record: custom-accelerator programs are announced far more often than they produce competitive parts, and the gap between tape-out and useful deployment is where most of them fail. Publishing measured results on a third-party benchmark, roughly nine months after tape-out, is a materially stronger claim than the one made in June — though it remains a claim made by the chip's designer about its own product.

The caveats are structural rather than incidental. OpenAI selected the benchmark, ran the tests, and chose the comparison points; no independent party has published a full replication. The baseline is a prior Nvidia generation. The chip has not been deployed at scale, where thermal behavior, yield, software maturity, and cluster-level networking typically erode single-part advantages. Perf-per-watt on inference benchmarks is also not the same as total cost of ownership, which depends on fab capacity, HBM supply, and integration cost — none of which OpenAI disclosed.

What the event does establish is a directional fact about market structure. If a frontier lab can field an inference part that is at least in the same performance class as the incumbent's flagship, the assumption that frontier-scale inference must run on Nvidia hardware weakens. Google, Amazon, and Apple each reached that position over multi-year programs; OpenAI is claiming it in roughly two years, using a partner for silicon implementation rather than building the capability in-house. Whether that compression is real will be visible in 2027 deployment volumes, not in these numbers.
