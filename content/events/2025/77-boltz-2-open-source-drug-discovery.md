---
id: boltz-2-open-source-drug-discovery
title: "MIT and Recursion Release Boltz-2 — Open-Source Binding Affinity Model"
date: 2025-06-06
category: research
significance: major
confidence: high
actors:
  - id: mit-csail
    role: subject
  - id: recursion
    role: partner
  - id: nvidia
    role: partner
tags: [drug-discovery, binding-affinity, open-source, CASP16, biomolecular-modeling]
threads: [ai-for-science]
sources:
  - url: https://www.biorxiv.org/content/10.1101/2025.06.14.659707v1
    title: "Boltz-2: Towards Accurate and Efficient Binding Affinity Prediction"
    type: primary_document
    publisher: bioRxiv
    date: 2025-06-14
  - url: https://www.globenewswire.com/news-release/2025/06/06/3095179/0/en/MIT-and-Recursion-Release-Boltz-2-Next-Generation-AI-Model-to-Predict-Binding-Affinity-at-Unprecedented-Speed-Scale-and-Accuracy.html
    title: "MIT and Recursion Release Boltz-2, Next-Generation AI Model to Predict Binding Affinity"
    type: official
    publisher: GlobeNewswire
    date: 2025-06-06
  - url: https://www.csail.mit.edu/news/mit-releases-breakthrough-protein-binding-affinity-model-expanding-role-ai-drug-discovery
    title: "MIT Releases Breakthrough Protein Binding Affinity Model"
    type: official
    publisher: MIT CSAIL
    date: 2025-06-06
---

## Summary

MIT CSAIL and Recursion released Boltz-2, an open-source biomolecular co-folding model that predicts drug-protein binding affinity with near-free-energy-perturbation accuracy at roughly 1,000 times the speed. Trained on approximately 5 million binding affinity measurements augmented with molecular dynamics simulations, Boltz-2 outperformed all entrants to the CASP16 binding affinity challenge and was released under MIT license — including weights and inference pipeline.

## What Happened

Binding affinity prediction — estimating how tightly a drug candidate binds to its protein target — is among the most computationally expensive steps in drug discovery. The physics-based gold standard, free energy perturbation (FEP), requires quantum mechanical calculations that can take days per compound on specialized hardware. Virtual screening campaigns evaluating millions of candidates against a target were therefore forced to use cruder approximations that sacrificed accuracy for throughput.

Boltz-2 attacked this bottleneck from a different angle. Building on the co-folding architecture of its predecessor (Boltz-1, released late 2024), the MIT team integrated a binding affinity prediction head trained on a large curated dataset of measured binding constants, enriched with molecular dynamics simulations that captured the conformational flexibility of protein-ligand complexes. The result matched FEP accuracy — measured by correlation with experimental IC50 and Kd values — at a fraction of the computational cost.

The CASP16 evaluation provided independent validation. CASP (Critical Assessment of Structure Prediction) had recently added a binding affinity track; Boltz-2 submitted results that exceeded every other participating group's accuracy. The MIT license release of model weights, training code, and inference pipeline distinguished it from commercially-gated alternatives: academic groups could fine-tune on proprietary assay data without paying per-query API fees.

A companion commercial venture, Boltz PBC, was co-founded alongside the release with $28 million in seed funding, establishing the typical academic-spinout pattern that had characterized the protein structure prediction ecosystem since RoseTTAFold.

## Why It Matters

The combination of open weights and near-FEP accuracy at FEP-beating speed fundamentally changed the economic calculus of virtual screening. Drug discovery campaigns that previously required expensive compute clusters or vendor contracts for high-accuracy docking could run on academic hardware. More structurally, Boltz-2's architecture — learning binding affinity from experimental data rather than from physical first principles — suggested that the FEP bottleneck might be an artifact of the physics-based paradigm rather than an intrinsic limitation of binding prediction. If an ML model trained on assay data generalizes reliably across chemical series, it may make FEP computation mostly unnecessary for early-stage screening. Whether that generalization holds outside the training distribution — the eternal question for ML in drug discovery — remained the central open issue.
