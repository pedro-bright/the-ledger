---
id: glm-5-3-flash-stealth-launch-open-weights
title: "Z.ai Reveals That the Anonymous Top-Ranked OpenRouter Model Was GLM-5.3-Flash, Then Publishes Its Weights"
date: 2026-08-26
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/zai-org/GLM-5.3-Flash
    title: "GLM-5.3-Flash Model Card"
    type: primary_document
    publisher: Z.ai
    date: 2026-08-26
    accessed: 2026-08-29
    archive_url: https://web.archive.org/web/*/https://huggingface.co/zai-org/GLM-5.3-Flash
  - url: https://www.bloomberg.com/news/articles/2026-08-26/china-s-z-ai-made-ox-alpha-stealth-model-that-rivals-deepseek
    title: "Z.ai's Shares Soar After Claiming Surprise AI Hit Ox Alpha"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-08-26
    accessed: 2026-08-29
actors:
  - id: z-ai
    role: subject
  - id: hugging-face
    role: distribution-partner
regions: [CN]
tags: [open-weights, mixture-of-experts, model-release, chinese-ai, model-evaluation, model-licensing]
threads: [open-vs-closed-weights]
related: [qwen3-8-max-open-weights, meta-muse-glimmer-open-weights]
state: published
revision:
  created: 2026-08-29
  last_reviewed: 2026-08-29
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 20, 2026, a model identified only as "Ox Alpha" appeared on the inference marketplace OpenRouter with no disclosed developer and no charge to users, and within days rose to the top of the platform's usage rankings.
On August 26, Z.ai — the Beijing company formerly known as Zhipu — confirmed to Bloomberg that Ox Alpha was an unreleased model in its GLM series, named it GLM-5.3-Flash, and published the weights on Hugging Face under the MIT license.
The checkpoint is a 320-billion-parameter sparse mixture-of-experts model that activates approximately 18 billion parameters per token, accepts text, images and video, and declares a context length of 1,048,576 tokens.
Bloomberg reported that the confirmation pushed Z.ai's Hong Kong-listed shares up as much as 12 percent.

## What Happened

Ox Alpha was deployed publicly on August 20 without attribution.
It carried no vendor name, no model card and no price, and it was routed to users alongside identified commercial models.
Bloomberg reported that it climbed to the top spot on OpenRouter's usage leaderboard, drawing more than twice the traffic of DeepSeek's models, and that the anonymity itself became the subject of speculation about which laboratory had produced it.
Z.ai ended that speculation on August 26 by identifying the model as its own and stating that it intended to release the weights.

The `zai-org/GLM-5.3-Flash` repository was created on Hugging Face on August 25 and the weights were published the following day under the MIT license, with no field-of-use restrictions, no revenue-triggered separate-license clause and no acceptable-use annex.
The model card describes GLM-5.3-Flash as the first natively multimodal model in the GLM-5 series, trained from a newly initialized base model on what Z.ai describes as a 30-trillion-token multimodal pre-training corpus.
The configuration lists 45 layers, 288 routed experts plus one shared expert with eight routed experts activated per token, a 154,880-token vocabulary, and a vision tower operating at 448-pixel input and patch size 14.
It combines linear attention with sparse attention in a hybrid arrangement — full attention appears at only eleven of the 45 layers — which the model card credits with reducing long-context serving cost, and it applies a technique the card calls Manifold-Constrained Hyper-Connections.
An FP8 quantization configuration ships in the released checkpoint, and a `reasoning_effort` parameter accepts `low`, `high` and `max`, defaulting to `max`.

The benchmark table on the model card is vendor-run and was not independently replicated at the time of publication.
Z.ai reports 84.3 on Terminal-Bench 2.1, 63.4 on DeepSWE v1.1, 78.4 on Toolathlon Verified, 55.3 on Humanity's Last Exam with tools, and 26.3 on Agents' Last Exam, and states that the model "outperforms GLM-5.2 across benchmarks and real-world workloads at one-tenth the price, while approaching Claude Opus 4.8 on coding and agentic benchmarks."
The card discloses eval harnesses and sampling settings for each figure, including a six-hour timeout and 400,000-token context for DeepSWE and the use of GPT-5.6-luna as the judge model for Humanity's Last Exam.
On the multimodal side it reports 53.4 on BabyVision against 70.9 for Gemini 3.7 Flash, the one benchmark on which the card shows a substantial deficit.

Bloomberg reported API pricing of $0.15 per million input tokens and $0.50 per million output tokens.
The model card documents day-of-release serving recipes for SGLang, vLLM, TokenSpeed, Transformers, KTransformers and Unsloth.
By August 29 the Hugging Face repository recorded roughly 189,800 downloads and 1,560 likes.

## Why It Matters

The sequence here is the part worth recording.
Model launches are normally announced, benchmarked by the vendor, and then adopted; Z.ai inverted that order by putting an unlabeled frontier-adjacent model into a competitive routing marketplace, letting usage accumulate without brand attribution, and only then attaching a name, a price and a license.
OpenRouter and similar routers make this possible because they abstract models behind a common interface, so a checkpoint can acquire real production traffic before anyone knows who built it.
That produces an adoption signal insulated from vendor reputation, and it also produces a marketing event on reveal — Bloomberg tied the share-price move directly to the confirmation.
Whether other laboratories copy the pattern is not yet clear, but the mechanism is now demonstrated and the infrastructure to repeat it is generally available.

The licensing choice runs against the direction set by the other large open-weight releases of the same month.
Alibaba published its Max-class Qwen3.8 checkpoint on August 12 under a custom license requiring a separate commercial agreement from inference providers and coding-assistant vendors above a revenue threshold.
Z.ai released a model of comparable ambition under MIT, which imposes no such conditions.
The two decisions were made two weeks apart by companies competing for the same developer population, and they indicate that the terms attached to frontier-scale open weights remain contested rather than settled.

Several things are not established.
The benchmark figures are self-reported and self-scored, and the anonymous OpenRouter deployment — during which the model was free — is not a controlled comparison against paid competitors, so leaderboard position measures traffic under an unusual price condition rather than capability.
Z.ai has also made public claims about the hardware used to serve the anonymous preview that neither the model card nor the reporting cited here substantiates, and the company has not published throughput, power or vendor details that would allow those claims to be checked.
The weights are inspectable; the operational claims surrounding them are not.
