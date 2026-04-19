---
id: rfdiffusion-antibody-design-nature
title: "Baker Lab: RFdiffusion Designs Atomically Accurate Antibodies"
date: 2025-11-05
category: research
significance: major
confidence: high
actors:
  - id: baker-lab
    role: subject
tags: [protein-design, antibody, RFdiffusion, cryo-EM, drug-discovery, open-source]
threads: [ai-for-science]
related: [rfdiffusion2-enzyme-design-nature]
sources:
  - url: https://www.nature.com/articles/s41586-025-09721-5
    title: "De novo design of proteins that bind specific epitopes on targets of interest"
    type: primary_document
    publisher: Nature
    date: 2025-11-05
  - url: https://www.ipd.uw.edu/2025/11/rfantibody-in-nature/
    title: "RFantibody: De Novo Antibody Design Published in Nature"
    type: official
    publisher: Institute for Protein Design
    date: 2025-11-05
---

## Summary

The Baker Lab at the University of Washington Institute for Protein Design published in Nature (volume 649, pp. 183–193, DOI 10.1038/s41586-025-09721-5) a demonstration that RFdiffusion could design antibody-like binders — including VHH nanobodies, single-chain variable fragments (scFv), and full IgG-format antibodies — targeting user-specified epitopes on pathogen proteins. Cryo-EM structures confirmed atomic-level precision on influenza hemagglutinin and Clostridium difficile toxin B. The companion RFantibody software was open-sourced at publication.

## What Happened

Antibody discovery has historically been a biological process: animals or human B-cell libraries are screened for naturally occurring antibodies that bind a target, and promising candidates are then optimized through further selection. This process is time-consuming, expensive, and fundamentally limited to the chemical space accessible by natural immune repertoires. The core promise of computational protein design — making the process programmable from a molecular blueprint — had long been unrealized for antibodies because of their structural complexity, the need to engage specific epitopes precisely, and the requirement for tight binding without off-target contacts.

RFdiffusion, the diffusion-based protein design model published by Baker Lab in 2023, had demonstrated strong performance on de novo binder design against structured protein targets. The Nature 2025 paper extended the approach specifically to antibody formats, with several technical additions: a fine-tuning stage on antibody structures from the SAbDab database, modified noise schedules to account for the hypervariable loop geometry of antibody CDR regions, and an epitope-conditioning interface that allowed users to specify the exact binding site they wanted to target.

The experimental validation was unusually rigorous. For both flu hemagglutinin and C. difficile toxin B, designed antibodies were expressed, purified, tested for binding by surface plasmon resonance, and subjected to cryo-electron microscopy structure determination. The cryo-EM structures matched the computational designs at near-atomic resolution — the gold standard for confirming that the model had correctly predicted not just whether a protein would bind but precisely how.

RFantibody, implementing the full design pipeline, was released under an open license on GitHub at the time of publication.

## Why It Matters

The ability to computationally design antibodies targeting specified epitopes changes the antibody discovery paradigm in several ways. Epitope targeting matters for both efficacy and safety: a neutralizing antibody must often bind a conserved, functionally critical site to avoid viral escape; an antibody targeting a tumor antigen must avoid epitopes shared with normal tissue. Traditional discovery methods cannot directly specify where on a target an antibody will bind; computational design can. The cryo-EM validation demonstrated that RFdiffusion's designs were not approximate — they bound with atomic-level geometric fidelity, suggesting that the design methodology could be applied to targets where precise epitope engagement is therapeutically critical. The open-source release extended these capabilities to academic groups globally, though the gap between a designed binder and a clinical antibody drug — requiring pharmacokinetic optimization, safety profiling, and manufacturing scale-up — remained substantial.
