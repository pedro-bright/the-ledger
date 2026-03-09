---
id: meta-llama-3-1-405b
title: "Meta Releases Llama 3.1 405B, Largest Open-Weight Model"
date: 2024-07-23
category: open-source
significance: landmark
confidence: high
actors:
  - id: meta-ai
    role: developer
  - id: yann-lecun
    role: advocate
regions: [US]
tags: [open-weights, large-language-model, frontier-model, 405-billion]
threads: [open-vs-closed-weights, scaling-laws-debate]
sources:
  - url: https://ai.meta.com/blog/meta-llama-3-1/
    title: "Introducing Llama 3.1: Our most capable models to date"
    type: primary
  - url: https://arxiv.org/abs/2407.21783
    title: "The Llama 3 Herd of Models"
    type: primary
---

## Summary

Meta released Llama 3.1, including a 405-billion parameter model that was the largest open-weight language model ever released. The 405B model performed competitively with GPT-4o and Claude 3.5 Sonnet on major benchmarks, marking the first time an openly available model matched proprietary frontier models across a broad range of capabilities.

## What Happened

On July 23, 2024, Meta released Llama 3.1 in three sizes: 8B, 70B, and 405B parameters. The 405B model was the headline: trained on over 15 trillion tokens using more than 16,000 H100 GPUs, it represented the largest and most capable open-weight language model ever released.

Llama 3.1 405B performed competitively with the leading proprietary models of the time — GPT-4o and Claude 3.5 Sonnet — on benchmarks including MMLU (88.6%), HumanEval (89.0%), and GSM8K (96.8%). It supported a 128K token context window, multilingual capabilities, and improved tool use.

Meta updated its licensing to be more permissive, explicitly allowing the use of Llama outputs to train other models — a provision that had been absent from previous Llama licenses. This was significant because it allowed the open-source community to use Llama 3.1 405B as a teacher model for distillation and synthetic data generation.

The release was accompanied by a detailed 92-page research paper describing the training methodology, including comprehensive safety evaluations and red-teaming results.

## Why It Matters

Llama 3.1 405B was a watershed moment for the open-weight AI movement. For the first time, an openly available model could genuinely compete with the best proprietary models on most tasks. This meant that organizations, researchers, and governments could deploy frontier-class AI capabilities without depending on API access from OpenAI, Anthropic, or Google.

The permission to use Llama outputs for model training was strategically significant. It enabled a cascade of derivative development: smaller, specialized models could be distilled from 405B, creating an entire ecosystem of capable models that traced their lineage to Meta's open release. This further commoditized the model layer.

The release also changed the debate about open-weight safety. At 405 billion parameters, Llama 3.1 was capable enough that its open release raised genuine proliferation concerns — the same model that could power legitimate applications could also be fine-tuned to remove safety guardrails. Meta's decision to release it anyway, with safety documentation but no technical restrictions on use, was both a bold bet on the benefits of openness and a challenge to those who argued that sufficiently capable models should be restricted.
