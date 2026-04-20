---
id: qwen2-5-vl-release
title: "Alibaba Releases Qwen2.5-VL as Open-Weight Visual Agent Model"
date: 2025-01-26
category: open-source
significance: major
confidence: high
actors:
  - id: alibaba
    role: subject
regions: [CN]
tags: [open-weights, multimodal, agents, computer-use, vision]
threads: [open-vs-closed-weights]
sources:
  - url: https://qwenlm.github.io/blog/qwen2.5-vl/
    title: "Qwen2.5-VL: See the World, Think, Act"
    type: official
    date: 2025-01-26
  - url: https://arxiv.org/abs/2502.13923
    title: "Qwen2.5-VL Technical Report"
    type: primary_document
    date: 2025-02-19
  - url: https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct
    title: "Qwen2.5-VL-72B-Instruct Model Card"
    type: primary_document
    date: 2025-01-26
---

## Summary

Alibaba released Qwen2.5-VL, a family of open-weight vision-language models in three sizes — 3B, 7B, and 72B — with the flagship 72B variant matching GPT-4o on document and diagram understanding benchmarks. The release marked the first time an open-weight model offered direct agentic computer-use and phone-use capabilities, enabling autonomous GUI control without specialized scaffolding.

## What Happened

On January 26, 2025, Alibaba's Qwen team published Qwen2.5-VL across three sizes. The 72B model demonstrated performance on par with GPT-4o on structured document analysis, chart interpretation, and complex visual question answering. Unlike prior multimodal releases, Qwen2.5-VL included native support for agentic operation: the model could interpret screenshots, execute GUI actions on desktops and mobile phones, and complete multi-step software tasks without requiring a separate agent framework.

The 3B and 7B variants were released under the Apache 2.0 license, making them fully permissive for commercial use. The 72B model used a custom Qwen license that permitted commercial deployment with attribution requirements. All model weights were distributed through Hugging Face.

The technical report, published in February, detailed the architectural innovations: the models used a dynamic resolution training approach and an updated vision encoder tuned to handle both natural images and dense documents at high resolution. On OCRBench and DocVQA, the 72B model achieved scores within a few percentage points of GPT-4o and Claude 3.5 Sonnet.

## Why It Matters

Qwen2.5-VL extended the open-weight frontier into agentic territory that had previously been the exclusive domain of closed API models. The ability to perform computer use — clicking buttons, reading screens, filling forms — directly from an open-weight model lowered the barrier for building autonomous software agents without API dependency or usage restrictions.

The release continued a pattern of Chinese open-source labs releasing models that compressed months of proprietary progress into freely available weights. For the open-vs-closed debate, it demonstrated that visual agent capabilities, once considered cutting-edge and commercially sensitive, could be commoditized through open distribution within a competitive release cycle.
