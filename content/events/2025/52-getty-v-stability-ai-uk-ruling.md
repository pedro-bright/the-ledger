---
id: getty-v-stability-ai-uk-ruling
title: "UK High Court Rules Stability AI Weights Not Infringing Copies"
date: 2025-11-04
category: policy
significance: landmark
confidence: high
regions: [UK]
actors:
  - id: getty-images
    role: plaintiff
  - id: stability-ai
    role: defendant
tags: [copyright, litigation, model-weights, uk, training-data, database-rights]
threads: [ai-copyright-wars]
sources:
  - url: https://www.judiciary.uk/wp-content/uploads/2025/11/Getty-Images-v-Stability-AI.pdf
    title: "Getty Images (US), Inc. v. Stability AI Ltd [2025] EWHC 2863 (Ch)"
    type: primary_document
    publisher: UK Judiciary
    date: 2025-11-04
  - url: https://www.lw.com/en/insights/getty-images-v-stability-ai-english-high-court-rejects-secondary-copyright-claim
    title: "Getty Images v. Stability AI: English High Court Rejects Secondary Copyright Claim"
    type: expert_interpretation
    publisher: Latham & Watkins
    date: 2025-11-07
  - url: https://www.mayerbrown.com/en/insights/publications/2025/11/getty-images-v-stability-ai-what-the-high-courts-decision-means-for-rights-holders-and-ai-developers
    title: "Getty Images v. Stability AI: What the High Court's Decision Means for Rights Holders and AI Developers"
    type: expert_interpretation
    publisher: Mayer Brown
    date: 2025-11-10
  - url: https://newsroom.gettyimages.com/en/getty-images/getty-images-issues-statement-on-ruling-in-stability-ai-uk-litigation
    title: "Getty Images Issues Statement on Ruling in Stability AI UK Litigation"
    type: official
    publisher: Getty Images
    date: 2025-11-04
---

## Summary

The UK High Court issued the first high-court judgment anywhere in the world to directly address whether trained AI model weights constitute infringing copies of the works used to train them, ruling against Getty Images on this core question. The court found that while the training process involves temporary reproductions, the resulting weights are not themselves copies of Getty's images. Getty abandoned its primary copyright and database rights claims mid-trial; the court found limited trademark liability for watermark reproduction in outputs.

## What Happened

Getty Images had brought proceedings in England alleging that Stability AI infringed its copyright and EU-derived database rights by scraping and training on millions of Getty-licensed images. The case proceeded to trial before Mr Justice Mellor in the Chancery Division. During the trial itself, Getty's legal team narrowed the live claims, abandoning the primary copyright infringement and database rights arguments after encountering difficulties establishing that the weights stored the original image data in a recoverable form. The remaining secondary copyright claim — that the weights constituted infringing copies — proceeded to judgment.

The court's ruling on the weights question turned on the technical architecture of diffusion models. Justice Mellor accepted expert evidence that the floating-point parameters constituting Stable Diffusion's weights do not encode or store image data in any form recognizable as a copy of the originals. The inference process generates new images statistically informed by training patterns, but the weights themselves are not reproductions. On trademark, the court found that Stability AI's outputs occasionally reproduced Getty's distinctive watermark, creating a limited basis for trademark liability — but this was a much narrower finding than Getty's original claims.

## Why It Matters

The Getty v. Stability AI UK ruling is the most significant judicial statement yet on the technical and legal nature of trained model weights. Its conclusion that weights are not infringing copies of training data — if followed by other courts — would substantially reduce the copyright exposure of AI developers to claims based on what their models have learned rather than what they output. The ruling diverges from the analytical path US courts are pursuing, where the training process itself is the central focus rather than the stored parameters. The international divergence underscores the absence of a global framework for AI copyright and will force multinational AI companies to navigate fundamentally different legal regimes.
