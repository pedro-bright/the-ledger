---
id: openai-gpt-5-4-release
title: "OpenAI Releases GPT-5.4 with Built-in Computer Use"
date: 2026-03-05
category: models
significance: major
confidence: high
actors:
  - id: openai
    role: subject
regions: [US]
tags: [frontier-models, agents, computer-use, benchmarks]
threads: [scaling-laws-debate]
sources:
  - url: https://openai.com/index/introducing-gpt-5-4/
    title: "Introducing GPT-5.4"
    type: official
    date: 2026-03-05
  - url: https://help.openai.com/en/articles/11909943-gpt-53-and-gpt-54-in-chatgpt
    title: "GPT-5.3 and GPT-5.4 in ChatGPT"
    type: official
    date: 2026-03-05
---

## Summary

OpenAI released GPT-5.4 on March 5, 2026, a model that merged GPT-5.3-Codex — a coding specialist — into the mainline GPT-5 architecture and added native computer-use capabilities. The release achieved 75.0% on OSWorld, exceeding the 72.4% human baseline on that benchmark, and posted 57.7% on SWE-bench Pro; OpenAI also reported a 33% reduction in factual errors relative to GPT-5.2.

## What Happened

GPT-5.4 unified previously separate coding and general-purpose model lines by incorporating the Codex specialist directly into the base model weights. Computer use — the ability to operate a desktop environment by observing screenshots and issuing keyboard and mouse actions — was integrated natively rather than exposed as a separate API layer. Pricing was set at $2.50 per million input tokens. GPT-5.4 Thinking and Pro variants launched on March 5, with GPT-5.4 mini and nano following on March 17. OSWorld performance surpassing the human baseline was disputed by several academic groups who argued that the benchmark's human baseline measurement methodology underestimates typical human performance; OpenAI maintained its evaluation protocol was sound. The factual error reduction figure was based on OpenAI's internal red-team evaluation rather than an independent audit.

## Why It Matters

GPT-5.4 arriving with human-baseline-exceeding computer-use performance added a new dimension to the scaling-laws debate: the question was no longer only whether scaling improves scores on text benchmarks, but whether it can produce systems that surpass humans on tasks requiring perception, planning, and physical-world interaction mediated through a computer interface. Proponents of continued scaling argued OSWorld represented a meaningful threshold crossed; skeptics pointed to the contested baseline methodology and noted that real-world deployment of computer-use agents at scale had yet to demonstrate comparable reliability. The consolidation of specialist and generalist model lines also suggested OpenAI was betting that a single large model trained on diverse tasks can match or exceed narrow specialists — a testable claim with direct implications for how labs allocate training compute going forward.
