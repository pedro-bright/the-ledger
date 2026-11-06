---
id: reflection-beam-open-weights
title: "Reflection AI Releases Beam, a 501B-Parameter Open-Weight Model Under Apache 2.0"
date: 2026-10-16
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/reflection/Beam-1.0-501B-A23B
    title: "Beam-1.0-501B-A23B Model Card"
    type: primary_document
    publisher: Reflection AI
    date: 2026-10-16
    accessed: 2026-10-20
    archive_url: https://web.archive.org/web/20261016141048/https://huggingface.co/reflection/Beam-1.0-501B-A23B
  - url: https://reflection.ai/blog/beam-is-available
    title: "Beam is now available"
    type: official
    publisher: Reflection AI
    date: 2026-10-16
    accessed: 2026-10-20
    archive_url: https://web.archive.org/web/20261016133609/https://reflection.ai/blog/beam-is-available
  - url: https://reflection.ai/blog/introducing-beam
    title: "Introducing Beam: Reflection's 501B open-weight model"
    type: official
    publisher: Reflection AI
    date: 2026-10-05
    accessed: 2026-10-20
    archive_url: https://web.archive.org/web/20261005194517/https://reflection.ai/blog/introducing-beam
  - url: https://huggingface.co/blog/reflection-beam
    title: "Welcome Beam: a 501B open model you can own, customize, and scale"
    type: official
    publisher: Hugging Face
    date: 2026-10-16
    accessed: 2026-10-20
    archive_url: https://web.archive.org/web/20261016140645/https://huggingface.co/blog/reflection-beam
  - url: https://techcrunch.com/2026/10/05/reflection-debuts-beam-a-open-weight-ai-model-to-rival-chinese-models-at-lower-compute-cost/
    title: "Reflection debuts Beam, an open-weight AI model to rival Chinese models at lower compute cost"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-05
    accessed: 2026-10-20
  - url: https://www.semafor.com/article/10/05/2026/reflection-ai-unveils-an-open-source-answer-to-chinese-labs
    title: "Reflection AI unveils an open-source Western answer to Chinese labs"
    type: secondary_reporting
    publisher: Semafor
    date: 2026-10-05
    accessed: 2026-10-20
actors:
  - id: reflection
    role: subject
  - id: hugging-face
    role: distribution-partner
  - id: nvidia
    role: investor
regions: [US]
tags: [open-weights, mixture-of-experts, apache-2-0, reinforcement-learning, coding-agents]
threads: []
related: [meta-muse-spark-open-weights, thinking-machines-inkling-open-weights, qwen3-8-max-open-weights, meta-muse-glimmer-open-weights]
state: published
revision:
  created: 2026-10-20
  last_reviewed: 2026-10-20
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 16, 2026, Reflection AI published the weights of Beam, its first open-weight model, on Hugging Face under the Apache 2.0 license. Beam is a text-only mixture-of-experts model with 501.3 billion total parameters, 23.4 billion active per token and a 1 million token context window, trained with a focus on coding and agentic tasks. Reflection had announced the model on October 5 with a waitlist for early access and a promise to release the weights later in the month.

## What Happened

Reflection, founded in 2024 by former Google DeepMind researchers Misha Laskin and Ioannis Antonoglou, announced Beam on October 5 after an Axios report the previous day that a launch was close. Its announcement said the model was pretrained on 23.8 trillion tokens and that its reinforcement learning run used 10.5 thousand NVIDIA GB300 GPUs for four weeks, generating more than 100 million rollouts across about one million coding, agentic and STEM environments. Reflection said Beam was competitive with Z.ai's GLM 5.2 and approaching Alibaba's Qwen 3.8-Max on coding and agentic tasks, while Moonshot's Kimi K3 "remain[s] ahead on raw capability," and that Beam matched GLM-5.2 on advanced reasoning benchmarks with three to four times less inference compute. TechCrunch noted that these claims had not been independently verified.

On October 16, Reflection released the weights in BF16, FP8 and NVFP4 formats, together with a speculative decoding drafter model, a model card and a safety technical report. The model card lists a knowledge cutoff of June 30, 2026, and, for the BF16 weights, 81.6% on SWE-bench Verified and 80.1% on Terminal-Bench 2.1. Hugging Face published a companion post describing Beam as "the first model from the new US lab, Reflection," with 52 layers and 256 experts per mixture-of-experts layer, 8 of them routed per token, and day-zero support in Transformers, vLLM and SGLang. Reflection said the release came with over 40 partners and integrations, which it described as "an open operating system for agents." By October 20 the main repository showed 2,930 downloads.

TechCrunch reported that Reflection had raised roughly $4.7 billion from investors including Nvidia, Sequoia Capital and Lightspeed Venture Partners, according to PitchBook, with its last round at a $25 billion pre-money valuation, and that it had signed compute deals worth more than $7 billion with SpaceX and Nebius for access to Nvidia GB300 chips through 2029. Laskin told Semafor that Reflection was aiming Beam at businesses and governments building sovereign AI systems that do not use Chinese models, and that the company was working with US and UK government evaluators to assess the model's capabilities.

## Why It Matters

Beam's weights arrived one day after Meta's Muse Spark Open, making it the second large US open-weight release in two days, and three months after Thinking Machines Lab's Inkling, which TechCrunch described as Beam's most direct US rival. Unlike Meta's gated release under a custom license, Beam is ungated and uses Apache 2.0, which permits commercial use and modification. Reflection's own comparisons place Kimi K3 ahead of Beam and Beam short of Qwen 3.8-Max, so by the company's account the release narrows the gap between US and Chinese open-weight models without closing it.

The benchmark results are Reflection's own and had not been reproduced by independent evaluators at the time of release. The October 5 post and the October 16 model card also report slightly different scores for some of the same tests, after Reflection updated its October 5 table. Whether the US and UK government assessments Laskin described will be published, and how widely developers adopt the model, were not known when the weights were released.
