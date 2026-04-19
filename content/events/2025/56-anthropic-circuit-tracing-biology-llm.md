---
id: anthropic-circuit-tracing-biology-llm
title: "Anthropic Publishes Circuit Tracing and 'Biology of a Large Language Model'"
date: 2025-03-27
category: research
significance: landmark
confidence: high
actors:
  - id: anthropic
    role: subject
tags: [interpretability, mechanistic-interpretability, circuit-tracing, attribution-graphs, neuronpedia]
threads: [frontier-safety-policies]
sources:
  - url: https://transformer-circuits.pub/2025/attribution-graphs/methods.html
    title: "Attribution Graphs: Methods"
    type: primary_document
    publisher: Transformer Circuits Thread
    date: 2025-03-27
  - url: https://transformer-circuits.pub/2025/attribution-graphs/biology.html
    title: "On the Biology of a Large Language Model"
    type: primary_document
    publisher: Transformer Circuits Thread
    date: 2025-03-27
  - url: https://www.anthropic.com/research/tracing-thoughts-language-model
    title: "Tracing the Thoughts of a Large Language Model"
    type: official
    publisher: Anthropic
    date: 2025-03-27
  - url: https://www.anthropic.com/research/open-source-circuit-tracing
    title: "Open-Source Circuit Tracing Tools"
    type: official
    publisher: Anthropic
    date: 2025-03-27
---

## Summary

Anthropic released two substantial papers — a methods paper on attribution graphs and a companion "biology" paper analyzing Claude 3.5 Haiku — alongside open-source circuit tracing tooling integrated with Neuronpedia, marking the most detailed public anatomy of a commercial frontier model's internal computation to date.

## What Happened

The attribution graph methodology provides a framework for tracing which internal circuits drive specific model behaviors, creating maps of computational pathways analogous in spirit to functional anatomy. The companion biology paper applied this approach to Claude 3.5 Haiku, examining behaviors including multilingual reasoning, multi-step planning, hallucination dynamics, and refusal activations.

A headline finding was the existence of a language-agnostic conceptual space: when Claude processes equivalent concepts in different languages, representations converge in a shared internal geometry before diverging again at the output stage. The refusal analysis traced the circuitry behind Claude's resistance to harmful requests, while the hallucination analysis identified failure modes in how models fill gaps in factual recall.

The tools were released open-source and integrated with Neuronpedia, a community platform for mechanistic interpretability research, allowing external researchers to explore the same attribution infrastructure.

## Why It Matters

The release set a new benchmark for interpretability transparency at a major frontier lab. Prior mechanistic interpretability work had focused primarily on toy models or early, smaller transformers; applying the methodology at the scale of a deployed commercial model and releasing the tools externally represented a significant step. The biology framing also shifted language in the field — treating the model as a subject of empirical study rather than an engineered artifact whose behavior can be fully specified in advance — with implications for how researchers think about the gap between training objectives and learned behavior.
