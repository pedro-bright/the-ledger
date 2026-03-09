---
id: google-gemini-1-5
title: "Google Announces Gemini 1.5 with Million-Token Context Window"
date: 2024-02-15
category: models
significance: major
confidence: high
actors:
  - id: google-deepmind
    role: developer
regions: [US]
tags: [context-window, mixture-of-experts, frontier-model, long-context]
threads: [scaling-laws-debate]
sources:
  - url: https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/
    title: "Our next-generation model: Gemini 1.5"
    type: primary
  - url: https://arxiv.org/abs/2403.05530
    title: "Gemini 1.5: Unlocking multimodal understanding across millions of tokens of context"
    type: primary
---

## Summary

Google DeepMind announced Gemini 1.5, featuring a 1 million-token context window — approximately 10x larger than any commercially available model — built on a Mixture-of-Experts architecture. The model demonstrated the ability to process entire books, codebases, and hours of video within a single prompt.

## What Happened

On February 15, 2024, Google unveiled Gemini 1.5 Pro, the successor to its Gemini model family. The headline feature was an unprecedented context window of up to 1 million tokens in the research version — with Google reporting successful testing at up to 10 million tokens. This dwarfed the 128K context windows offered by competitors.

Gemini 1.5 Pro was built on a Mixture-of-Experts (MoE) architecture, meaning that while the full model contained many parameters, only a subset were activated for any given input — making it more computationally efficient than traditional dense models. Google reported that 1.5 Pro matched or exceeded the performance of the much larger Gemini 1.0 Ultra across most benchmarks.

At the million-token scale, the model demonstrated genuinely novel capabilities: it could process 11 hours of audio, 1 hour of video, codebases exceeding 30,000 lines, or more than 700,000 words of text within a single context. Google showed that the model maintained high retrieval accuracy even at extreme context lengths, successfully finding specific information across massive inputs.

## Why It Matters

The million-token context window was a genuine architectural breakthrough that opened up use cases that were simply impossible with shorter-context models. Rather than requiring complex retrieval-augmented generation (RAG) setups to handle large documents, users could simply load entire libraries of content into a single prompt.

This contributed to the scaling laws debate from a different angle: rather than just scaling model size (parameters) or training data, Google demonstrated that scaling context length was itself a productive axis of improvement. It suggested that model capability wasn't a single dimension but a multi-axis space where different companies might lead on different fronts.

The MoE architecture's efficient inference also suggested that the "bigger is better" narrative was more nuanced than it appeared — computational efficiency could substitute for raw scale in certain dimensions, reinforcing the lesson from Mistral 7B about the importance of architectural innovation alongside brute-force scaling.
