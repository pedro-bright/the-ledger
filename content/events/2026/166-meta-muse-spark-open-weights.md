---
id: meta-muse-spark-open-weights
title: "Meta Releases Muse Spark Open, an 816B-Parameter Open-Weight Model"
date: 2026-10-15
category: open-source
significance: notable
confidence: high
sources:
  - url: https://research.meta.ai/blog/muse-spark-open
    title: "Introducing Muse Spark Open, The Most Capable US Open-Weight Model to Date"
    type: official
    publisher: Meta
    date: 2026-10-15
    accessed: 2026-10-19
    archive_url: https://web.archive.org/web/20261015165925/https://research.meta.ai/blog/muse-spark-open
  - url: https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B
    title: "Muse-Spark-Open-816B-A42B Model Card"
    type: primary_document
    publisher: Meta
    date: 2026-10-15
    accessed: 2026-10-19
    archive_url: https://web.archive.org/web/20261015170519/https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B
  - url: https://huggingface.co/blog/meta-muse-spark-open
    title: "Welcome Muse Spark Open: open-weight frontier multimodal mixture-of-experts model from Meta"
    type: official
    publisher: Hugging Face
    date: 2026-10-15
    accessed: 2026-10-19
    archive_url: https://web.archive.org/web/20261016054122/https://huggingface.co/blog/meta-muse-spark-open
  - url: https://techcrunch.com/2026/10/15/meta-launches-an-open-weight-model-that-runs-on-macs/
    title: "Meta launches an open-weight AI model that runs on Macs"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-15
    accessed: 2026-10-19
  - url: https://www.bloomberg.com/news/articles/2026-10-15/meta-releases-open-ai-model-while-keeping-its-best-tech-closed
    title: "Meta Releases Open AI Model While Keeping Its Best Tech Closed"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-10-15
    accessed: 2026-10-19
  - url: https://www.axios.com/2026/10/15/apple-and-meta-bury-the-hatchet-for-ai
    title: "\"Mommy and daddy\" play nice: Apple and Meta team up to bring open-source Muse to Macs"
    type: secondary_reporting
    publisher: Axios
    date: 2026-10-15
    accessed: 2026-10-19
actors:
  - id: meta
    role: subject
  - id: hugging-face
    role: distribution-partner
  - id: apple
    role: partner
regions: [US]
tags: [open-weights, mixture-of-experts, agentic-coding, local-inference, model-licensing, meta-superintelligence-labs]
threads: []
related: [meta-muse-glimmer-open-weights, meta-muse-wonder-first-frontier-model, meta-muse-spark-1-1, thinking-machines-inkling-open-weights, moonshot-kimi-k3-open-weights, qwen3-8-max-open-weights, glm-5-3-safety-delayed-open-weights]
state: published
revision:
  created: 2026-10-19
  last_reviewed: 2026-10-19
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 15, 2026, Meta released the weights of Muse Spark Open, a mixture-of-experts model with about 816 billion total parameters and 42 billion active per token, which Meta called "the most capable US open-weight model to date."
The model accepts text, image, video and audio input, has a context window of 1 million tokens and is published on Hugging Face under a new Muse Model License rather than an open-source license.
The release came three days after Meta launched its closed Muse Wonder models and two months after it published the much smaller Muse Glimmer as open weights.

## What Happened

Meta's research blog announced the release on October 15, describing Muse Spark Open as a natively multimodal model "built for coding and agentic work."
Meta's developer blog called it "the open weights version of Muse Spark," the model Meta has sold through its paid Meta Model API since July 2026, and the model card says this version "has additional safety post-training to make it more robust against misuse as a standalone model without system guardrails."
Hugging Face's launch post describes 62 layers with 256 experts per mixture-of-experts layer and 8 routed per token, and calls Muse Spark Open "the full-size model of the Muse series," with Muse Glimmer as the small dense model of the same series.
Weights were published in BF16 and NVFP4 formats, and Meta listed Baseten, Fireworks AI, Groq, Modal, Nebius, OpenRouter and Together AI as hosted inference providers at launch.

Meta said the model is the first in its class to run on a desktop setup, using two Mac Studios with Apple's M5 Ultra chip and 512 GB of unified memory each, linked through Apple's MLX framework.
Meta's developer blog said it worked with Apple, Nvidia, Hugging Face and the companies behind SGLang and vLLM so those runtimes supported the model at launch.
The model card states a requirement of at least 700 GB of GPU memory for the NVFP4 checkpoint and 2 TB for BF16.
TechCrunch reported the release on October 15 under the headline that the model "runs on Macs," and Axios reported the collaboration as Apple and Meta teaming up to bring the model to Macs.

The Muse Model License permits use, modification, fine-tuning, distillation and redistribution, but requires products built on the model or its derivatives to display "Built with Muse Spark Open."
A company offering the model or a derivative to third parties as an API service, with more than $20 million in gross revenue over any 12-month period, must notify Meta and sign a separate agreement first; internal use and use inside a company's own non-API products are excluded from that condition.
The model card states that the model is not intended to be downloaded or used by anyone under 18.

The model card compares Muse Spark Open with seven other open-weight models.
On the Artificial Analysis Intelligence Index column it scores 39, above Thinking Machines' Inkling (26), Nvidia's Nemotron 3 Ultra (23) and Mistral Large 4 (38), and below Qwen3.8-2.4T (40), Kimi K3 (44) and GLM 5.3 (45).
It trails all three Chinese models on Terminal-Bench 2.1 (76.4 against 82.0 to 85.0) and leads them on JobBench and MCP-Atlas.
On safety, the card reports a score of 0.5 on the adaptive StrongREJECT v2 test, where lower is better, against 62.9 to 86.4 for the other models measured, and a higher over-refusal score than any of them on the FORTRESS benchmark.
Meta said the model met the release thresholds of its Superintelligence Scaling Framework for chemical and biological, cyber and loss-of-control risks, with "a full evaluation report available soon."

## Why It Matters

Muse Spark Open is the largest model Meta has released as open weights since it restructured its AI work in 2025 and began selling Muse Spark through a paid API.
Bloomberg's headline described the release as Meta opening a model "while keeping its best tech closed," a reference to the Muse Wonder models introduced on October 12, which are available only through Meta's API or subscriptions.
Meta now runs a split strategy, with open weights at the small and middle tiers and closed access at the top, after the Llama period in which its largest models were also released openly.

By Meta's own comparison table, the "most capable US open-weight model" label is a claim about US developers: on the aggregate index Meta chose to report, three Chinese open-weight models score higher.
The benchmark and safety figures are Meta's own, the full evaluation report was not published with the weights, and the model card notes that downstream modifications could degrade the safety results it reports.
