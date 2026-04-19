---
id: deepmind-alphagenome-release
title: "DeepMind Releases AlphaGenome — Unified DNA Sequence Model"
date: 2025-06-25
category: research
significance: major
confidence: high
actors:
  - id: google-deepmind
    role: subject
tags: [genomics, regulatory-genomics, DNA, gene-expression, chromatin, AlphaGenome]
threads: [ai-for-science]
related: [arc-institute-evo-2-dna-foundation-model]
sources:
  - url: https://www.biorxiv.org/content/10.1101/2025.06.25.661532v1
    title: "AlphaGenome: Advancing Regulatory Genomics with a Unified DNA Sequence Model"
    type: primary_document
    publisher: bioRxiv
    date: 2025-06-25
  - url: https://www.nature.com/articles/s41586-025-10014-0
    title: "AlphaGenome: Advancing Regulatory Genomics with a Unified DNA Sequence Model"
    type: primary_document
    publisher: Nature
    date: 2025-12-01
  - url: https://deepmind.google/blog/alphagenome-ai-for-better-understanding-the-genome/
    title: "AlphaGenome: AI for better understanding the genome"
    type: official
    publisher: Google DeepMind
    date: 2025-06-25
---

## Summary

Google DeepMind released AlphaGenome, a unified model that accepts up to one megabase of DNA sequence and jointly predicts gene expression, chromatin accessibility, transcription factor binding, splicing patterns, and 3D chromatin contact maps at single-base-pair resolution. Evaluated on 24 regulatory genomics benchmarks, AlphaGenome outperformed all prior specialized models on 22, with a public API opened for non-commercial research use at launch and open code released in January 2026.

## What Happened

Regulatory genomics — understanding which DNA sequences control when and where genes are active — had been fragmented across dozens of specialized models, each trained to predict one phenotype from sequence. Enformer (DeepMind, 2021) had been the state of the art for gene expression prediction; separate architectures handled splicing, chromatin structure, and transcription factor binding. AlphaGenome was designed to replace this patchwork with a single model trained jointly on all tasks simultaneously.

The architecture took a megabase window of DNA — long enough to include most regulatory elements affecting a gene — and processed it through a transformer backbone trained on thousands of ENCODE and Roadmap Epigenomics tracks across dozens of cell types. The joint training setup proved critical: by learning the relationships between regulatory phenotypes (e.g., how transcription factor binding influences chromatin accessibility influences expression), the model achieved better performance on each individual task than models trained on that task alone.

The single-base-pair resolution output was a notable technical achievement. Prior models operated at coarser genomic resolution, limiting their ability to predict the precise location of regulatory elements or the exact exon-intron boundaries required for splicing prediction. AlphaGenome's fine-grained predictions enabled direct comparison with saturation genome editing experiments — massively parallel assays that measure the effect of every possible single-nucleotide variant in a regulatory region.

The API launch gave non-commercial researchers access to predictions across all supported cell types without needing to run the model locally. Open-source code followed in January 2026 alongside the Nature publication.

## Why It Matters

The shift from single-task regulatory models to a unified architecture mirrored the transformation that large language models had brought to NLP: a generalist trained jointly on many tasks routinely exceeded specialists. For regulatory genomics, the implications were significant because the diseases most resistant to treatment — including most cancers and complex common diseases — involve regulatory dysfunction rather than protein-coding mutations. Most human genetic variation identified in genome-wide association studies falls in non-coding regulatory regions whose functional consequences are poorly understood. A model that accurately predicts regulatory phenotypes from sequence could, in principle, translate statistical genetic associations into mechanistic understanding and therapeutic hypotheses at scale.
