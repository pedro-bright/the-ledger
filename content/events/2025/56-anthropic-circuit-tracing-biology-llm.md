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
    title: 'Attribution Graphs: Methods'
    type: primary_document
    publisher: Transformer Circuits Thread
    date: '2025-03-27'
  - url: https://transformer-circuits.pub/2025/attribution-graphs/biology.html
    title: On the Biology of a Large Language Model
    type: primary_document
    publisher: Transformer Circuits Thread
    date: '2025-03-27'
  - url: https://www.anthropic.com/research/tracing-thoughts-language-model
    title: Tracing the Thoughts of a Large Language Model
    type: official
    publisher: Anthropic
    date: '2025-03-27'
  - url: https://www.anthropic.com/research/open-source-circuit-tracing
    title: Open-sourcing circuit tracing tools
    type: primary_document
    publisher: Anthropic
    date: '2025-05-29'
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261011231801/https://www.anthropic.com/research/open-source-circuit-tracing
revision:
  draft_assistance: ai-assisted
---

## Summary

Anthropic published its attribution-graph methods paper and companion study of Claude 3.5 Haiku on March 27, 2025.
The open-source circuit-tracing library and Neuronpedia interface followed on May 29, a separate release that enabled researchers to generate and explore attribution graphs on supported open-weight models.

## Editorial correction (2026-10-26)

The March 27 papers and May 29 tooling announcement are distinct publications.
The tooling citation's original March 27 publication date is corrected to May 29.
The original body's simultaneous-tool-release wording is preserved below as the earlier assertion.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-anthropic-circuit-tracing-biology-llm-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

The attribution graph methodology provides a framework for tracing which internal circuits drive specific model behaviors, creating maps of computational pathways analogous in spirit to functional anatomy. The companion biology paper applied this approach to Claude 3.5 Haiku, examining behaviors including multilingual reasoning, multi-step planning, hallucination dynamics, and refusal activations.

A headline finding was the existence of a language-agnostic conceptual space: when Claude processes equivalent concepts in different languages, representations converge in a shared internal geometry before diverging again at the output stage. The refusal analysis traced the circuitry behind Claude's resistance to harmful requests, while the hallucination analysis identified failure modes in how models fill gaps in factual recall.

The tools were released open-source and integrated with Neuronpedia, a community platform for mechanistic interpretability research, allowing external researchers to explore the same attribution infrastructure.

## Why It Matters

The release set a new benchmark for interpretability transparency at a major frontier lab. Prior mechanistic interpretability work had focused primarily on toy models or early, smaller transformers; applying the methodology at the scale of a deployed commercial model and releasing the tools externally represented a significant step. The biology framing also shifted language in the field — treating the model as a subject of empirical study rather than an engineered artifact whose behavior can be fully specified in advance — with implications for how researchers think about the gap between training objectives and learned behavior.
