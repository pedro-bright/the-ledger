---
id: moonshot-kimi-k3-open-weights
title: "Moonshot AI Publishes Full Kimi K3 Model Weights"
date: 2026-07-27
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/moonshotai/Kimi-K3
    title: "Kimi K3: Open Frontier Intelligence"
    type: primary_document
    publisher: Moonshot AI
    date: 2026-07-27
    accessed: 2026-07-31
    archive_url: https://web.archive.org/web/*/https://huggingface.co/moonshotai/Kimi-K3
  - url: https://www.bloomberg.com/news/articles/2026-07-27/china-s-moonshot-to-release-breakthrough-ai-model-for-download
    title: "China's Moonshot Releases Breakthrough AI Model for Download"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-07-27
    accessed: 2026-07-31
actors:
  - id: moonshot-ai
    role: subject
regions: [CN]
tags: [open-weights, mixture-of-experts, multimodal-models, model-release, long-context, chinese-ai]
threads: []
related: [thinking-machines-inkling-open-weights]
state: published
revision:
  created: 2026-07-31
  last_reviewed: 2026-07-31
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On July 27, 2026, Moonshot AI published the full downloadable weights for Kimi K3, a sparse mixture-of-experts model with approximately 2.8 trillion total parameters and 104 billion activated parameters per token.
The release included 96 weight shards, architecture and inference files, and a custom license permitting modification and deployment while imposing conditions on some large commercial services and products.
Although the weights were publicly downloadable, the approximately 1.56-terabyte distribution placed full-scale independent deployment beyond ordinary consumer hardware.

## What Happened

Moonshot introduced Kimi K3 through its products and API on July 17 and said the full model weights would follow by July 27.
On that date, the company published the files required to download and serve the model through its Hugging Face repository, converting the earlier commitment into a completed weights publication.
The repository contained 96 SafeTensors weight shards, configuration and tokenizer files, vision-processing code, generation settings, and deployment documentation.

Kimi K3 contains approximately 2.8 trillion total parameters but does not activate the full model for every token.
Its sparse architecture routes each token through 16 of 896 experts, together with shared components, for approximately 104 billion active parameters per token.
The model combines Kimi Delta Attention and gated latent-attention layers, supports text and image inputs, and advertises a context limit of 1,048,576 tokens.

Moonshot distributed the released model using MXFP4 weights with MXFP8 activations.
The hosted artifacts occupied approximately 1.56 terabytes.
Sparse activation reduced the computation required for each token, but operators still needed to store and route across the complete expert pool.

The weights were released under the custom Kimi K3 License rather than a standard permissive software license.
The license permits use, modification, distribution, fine-tuning, deployment, and derivative works, but requires a separate agreement for model-as-a-service businesses exceeding $20 million in aggregate revenue over a consecutive 12-month period.
It also requires prominent Kimi K3 attribution in commercial products exceeding either 100 million monthly active users or $20 million in monthly revenue, subject to stated exemptions.

Moonshot reported benchmark results and an approximately 2.5-times improvement in scaling efficiency over Kimi K2.
Those comparisons had not been independently reproduced at release, and the published checkpoint used MXFP4 quantized weights.

## Why It Matters

Kimi K3 expanded the scale at which a frontier-oriented model could be downloaded and independently hosted rather than accessed only through a vendor API.
The release gave outside organizations access to the model's weights, architecture files, model code, and deployment documentation, allowing inspection and modification that are unavailable for closed API models.

The event also showed the practical limits of open-weight access at very large scale.
A downloadable 2.8-trillion-parameter model remained dependent on datacenter-class storage, networking, accelerators, and inference software, while the custom license constrained some high-revenue commercial uses.
The release therefore widened access to the underlying artifact without making deployment inexpensive, unrestricted, or broadly local.
