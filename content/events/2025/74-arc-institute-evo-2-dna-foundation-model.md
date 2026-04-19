---
id: arc-institute-evo-2-dna-foundation-model
title: "Arc Institute Releases Evo 2 — 40B DNA Foundation Model Across All Life"
date: 2025-02-19
category: research
significance: landmark
confidence: high
actors:
  - id: arc-institute
    role: subject
  - id: nvidia
    role: partner
tags: [genomics, foundation-model, DNA, synthetic-biology, open-source, zero-shot]
threads: [ai-for-science]
sources:
  - url: https://www.biorxiv.org/content/10.1101/2025.02.18.638918v1
    title: "Sequence modeling and design from molecular to genome scale with Evo 2"
    type: primary_document
    publisher: bioRxiv
    date: 2025-02-19
  - url: https://www.nature.com/articles/s41586-026-10176-5
    title: "Evo 2: Sequence modeling and design from molecular to genome scale"
    type: primary_document
    publisher: Nature
    date: 2026-01-15
  - url: https://arcinstitute.org/news/evo2
    title: "Evo 2: A Foundation Model for Biology"
    type: official
    publisher: Arc Institute
    date: 2025-02-19
  - url: https://blogs.nvidia.com/blog/evo-2-biomolecular-ai/
    title: "Evo 2: NVIDIA BioNeMo Powers Breakthrough DNA Foundation Model"
    type: secondary_reporting
    publisher: NVIDIA
    date: 2025-02-19
---

## Summary

Arc Institute released Evo 2, a 40-billion-parameter foundation model trained on 9.3 trillion nucleotides from over 100,000 species — the largest and most broadly trained DNA model to date. The open-source release, enabled by 2,000+ NVIDIA H100 GPUs via BioNeMo, demonstrated zero-shot prediction of disease-causing mutations and the ability to design bacterial-length synthetic genomes.

## What Happened

Evo 2 extended the single-sequence-to-genome paradigm to a scale and taxonomic breadth previously unseen in biological foundation modeling. The model's training corpus spanned the three domains of life — bacteria, archaea, and eukaryotes — plus viruses, covering more genomic diversity than any prior biological language model. At 40 billion parameters, it dwarfed predecessor protein models and prior DNA architectures by an order of magnitude.

The technical results were striking in their breadth. In zero-shot evaluations, Evo 2 correctly predicted the pathogenicity of BRCA1 variants — mutations implicated in hereditary breast and ovarian cancer — without any task-specific fine-tuning, matching the accuracy of specialized models trained explicitly for variant effect prediction. On the generative side, the model successfully synthesized bacterial-scale genomic sequences (up to several megabases) that displayed coherent structural features, a capability beyond prior work constrained to gene- or protein-length designs.

The training infrastructure required roughly 2,000 H100 GPUs provided through NVIDIA's BioNeMo platform. Weights and inference pipeline were open-sourced via GitHub and the BioNeMo framework, making the model accessible to academic laboratories and biotech companies without frontier compute budgets.

## Why It Matters

Evo 2 shifted the question in biological AI from "can a model capture protein structure?" to "can a model learn the grammar of entire genomes?" That shift has significant implications. A model that operates at genome scale can potentially reason about the relationship between regulatory elements, non-coding regions, and coding sequences — biological information that is invisible to protein-centric models. The zero-shot BRCA1 result suggested that genome-scale training imparts functional knowledge not derivable from smaller training distributions.

The open-source release was a deliberate counter to the growing trend of API-gated biological AI. By publishing weights under a permissive license, Arc Institute enabled academic labs — which cannot afford to pay per-query for proprietary foundation model access — to fine-tune and deploy Evo 2 for their specific organisms and research questions. The trade-off is biosecurity: an open model capable of designing synthetic genomes raises dual-use concerns that API-gated approaches nominally mitigate. How the field manages this tension will shape norms for biological AI access for years.
