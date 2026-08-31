---
id: tencent-hy4-preview-open-weights
title: "Tencent Publishes 770-Billion-Parameter Hy4 Preview Weights Under Apache 2.0"
date: 2026-08-27
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/tencent/Hy4-preview
    title: "Hy4-preview Model Card"
    type: primary_document
    publisher: Tencent
    date: 2026-08-27
    accessed: 2026-08-31
    archive_url: https://web.archive.org/web/*/https://huggingface.co/tencent/Hy4-preview
  - url: https://www.bloomberg.com/news/articles/2026-08-28/tencent-touts-new-ai-model-it-claims-outperforms-z-ai-moonshot
    title: "Tencent Touts New AI Model It Claims Outperforms Z.AI, Moonshot"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-08-28
    accessed: 2026-08-31
actors:
  - id: tencent
    role: subject
  - id: hugging-face
    role: distribution-partner
regions: [CN]
tags: [open-weights, mixture-of-experts, model-release, chinese-ai, model-licensing, sparse-attention]
threads: [open-vs-closed-weights]
related: [glm-5-3-flash-stealth-launch-open-weights, qwen3-8-max-open-weights, meta-muse-glimmer-open-weights]
state: published
revision:
  created: 2026-08-31
  last_reviewed: 2026-08-31
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 27, 2026, Tencent published the weights for Hy4 preview, a 770-billion-parameter sparse mixture-of-experts model that activates 49 billion parameters per token, releasing it on Hugging Face under the Apache 2.0 license.
The model card states that the architecture was "inspired by DeepSeek and GLM" and cites both laboratories' published papers for its attention and index-caching mechanisms.
Tencent reported a blind internal evaluation in which Hy4 preview finished in a near-tie with Z.ai's GLM 5.3 and Moonshot's Kimi K3, winning fewer than half of the paired comparisons in each case.
Bloomberg reported the release on August 28.

## What Happened

The `tencent/Hy4-preview` repository was created on Hugging Face on August 27, 2026 and last modified on August 28.
The published artifacts total approximately 1,560 gigabytes across 170 files in bfloat16, with an FP8-quantized variant released in parallel at `tencent/Hy4-preview-FP8`.
Tencent mirrored both checkpoints to ModelScope, GitCode and CNB.
The license field on the repository is `apache-2.0`, a permissive license with no field-of-use restrictions, no revenue-triggered separate-license clause and no acceptable-use annex.

The model card describes a backbone of 78 layers, of which the first uses a standard dense feed-forward network and the remaining 77 are mixture-of-experts layers containing 256 routed experts and one shared expert, with the top eight routed experts activated per token alongside the shared expert.
Hidden size is 6,144, vocabulary size is 120,832, and the declared context length is 1,048,576 tokens.
A separate native multi-token-prediction layer of 10 billion total parameters, 0.7 billion activated, is built in for speculative decoding and is excluded from the 770-billion-parameter backbone figure.

The architecture section is unusually explicit about its provenance.
The attention module uses what Tencent calls Gated DSA, a gated variant of DeepSeek Sparse Attention, citing arXiv:2512.02556, combined with IndexCache for cross-layer sparse index reuse, citing arXiv:2603.12201.
The residual pathway uses identity Hyper-Connections with four residual streams, credited to a Zhihu article rather than a peer-reviewed paper.
The configuration file shows the index-reuse pattern concretely: roughly one layer in four computes a fresh sparse index and the intervening layers reuse it.

Tencent reported a blind side-by-side evaluation in which 163 internal experts rated model outputs on 203 engineering tasks.
Against GLM 5.3, Hy4 preview averaged 2.99 to 2.92 on a four-point scale, with 46.8 percent wins, 12.8 percent ties and 40.4 percent losses.
Against Kimi K3, it averaged 2.99 to 2.94, with 51.2 percent wins, 7.9 percent ties and 40.9 percent losses.
The model card also lists known defects, stating that the model spends "longer than necessary reasoning through complex tasks" and shows "a tendency to over-verify its own work," and framing the release as deliberate: "we would rather ship early and hear what breaks."

The benchmark tables referenced in the model card are published only as JPEG images, and the machine-readable `model-index` field on the repository is null.
Numerical benchmark claims circulating in secondary coverage, including a reported Terminal-Bench 2.1 score, therefore cannot be read from the primary artifact.

## Why It Matters

Apache 2.0 at this scale is the notable term of the release.
The two largest preceding Chinese open-weights events in this archive used different instruments: Alibaba attached a custom license with a revenue-triggered clause to Qwen3.8-Max in August, and Z.ai used MIT for GLM-5.3-Flash the week before this release.
Tencent's choice of a standard permissive license for a 770-billion-parameter checkpoint removes the licensing friction that has distinguished many Chinese releases from unrestricted open source, though it does not by itself make the model practically accessible: the bfloat16 artifacts alone exceed 1.5 terabytes, so redistribution rights and deployment capacity are separate questions.

The citation pattern is the second durable fact.
Hy4's model card documents one Chinese laboratory building directly on architectural work published by two others, naming DeepSeek's sparse attention and GLM's design lineage in its own release material rather than obscuring the derivation.
That is a visible instance of compounding within the open-weights ecosystem, and it is the mechanism by which published architectures propagate faster than proprietary ones.
Whether this convergence produces genuine capability gains or merely correlated designs is not resolved by a single release.

Tencent's own evidence is more equivocal than the framing around it.
A blind expert evaluation showing roughly 40 percent losses against both comparators describes near-parity, not separation, and publishing those loss rates is a more informative disclosure than the benchmark images that accompany them.
The absence of machine-readable benchmark results, combined with vendor-run evaluation, means that independent replication had not occurred at the time of publication and that the model's standing relative to GLM 5.3 and Kimi K3 rests on Tencent's own measurements.
