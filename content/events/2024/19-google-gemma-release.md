---
id: google-gemma-release
title: "Google Releases Gemma Open-Weight Models"
date: 2024-02-21
category: open-source
significance: notable
confidence: high
actors:
  - id: google-deepmind
    role: developer
regions: [US]
tags: [open-weights, small-model, on-device, google]
threads: [open-vs-closed-weights]
sources:
  - url: https://blog.google/technology/developers/gemma-open-models/
    title: "Gemma: Introducing new state-of-the-art open models"
    type: primary
  - url: https://ai.google.dev/gemma
    title: "Gemma - Google AI for Developers"
    type: primary
---

## Summary

Google DeepMind released Gemma, a family of lightweight open-weight models (2B and 7B parameters) built from the same research as the Gemini models. The release marked Google's first significant entry into the open-weight model space.

## What Happened

On February 21, 2024, Google released Gemma in 2B and 7B parameter sizes, describing them as "open models" built from the same research and technology used to create the Gemini model family. The models were available for both research and commercial use under a permissive terms-of-use agreement.

Gemma models outperformed comparably-sized open models including Llama 2 7B and Mistral 7B on several benchmarks. Google released both pretrained base models and instruction-tuned variants, along with a responsible AI toolkit for developers.

The release was accompanied by technical documentation and was available through multiple distribution channels including Hugging Face, Kaggle, and Google's own Vertex AI platform.

## Why It Matters

Gemma represented Google's acknowledgment that the open-weight model ecosystem was too strategically important to cede entirely to Meta and smaller startups. While Google's primary competitive strategy remained its proprietary Gemini models, releasing Gemma allowed Google to participate in the open ecosystem, build community goodwill, and establish its models as options for developers building on open foundations.

The release also demonstrated the "trickle-down" dynamic in AI development: research techniques developed for frontier models (Gemini) could be distilled into smaller, open models that democratized access to state-of-the-art approaches — even if the full capability of the parent model remained proprietary.
