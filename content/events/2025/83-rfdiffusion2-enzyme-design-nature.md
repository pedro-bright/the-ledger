---
id: rfdiffusion2-enzyme-design-nature
title: "Baker Lab: RFdiffusion2 Designs Metallohydrolases Near Natural Catalytic Efficiency"
date: 2025-12-03
category: research
significance: major
confidence: high
actors:
  - id: baker-lab
    role: subject
tags: [protein-design, enzyme-design, RFdiffusion2, catalysis, metalloenzymes, Nature]
threads: [ai-for-science]
related: [rfdiffusion-antibody-design-nature]
sources:
  - url: https://www.nature.com/articles/s41586-025-09746-w
    title: "Accurate computational design of metallohydrolase enzymes"
    type: primary_document
    publisher: Nature
    date: 2025-12-03
  - url: https://www.nature.com/articles/s41592-025-02975-x
    title: "RFdiffusion2: improved protein structure generation by learning from experimental structures"
    type: primary_document
    publisher: Nature Methods
    date: 2025-12-03
  - url: https://www.ipd.uw.edu/2025/12/rfdiffusion2-efficient-enzymes-from-prompts/
    title: "RFdiffusion2: Designing Efficient Enzymes from Prompts"
    type: official
    publisher: Institute for Protein Design
    date: 2025-12-03
---

## Summary

The Baker Lab published in Nature (DOI 10.1038/s41586-025-09746-w) the design of metallohydrolase enzymes — proteins that use bound metal ions to catalyze the hydrolysis of chemical bonds — using RFdiffusion2, a second-generation diffusion model trained directly on experimentally determined structures. Best designs achieved catalytic efficiencies (kcat/KM) up to 53,000 M⁻¹s⁻¹, orders of magnitude above prior computationally designed enzymes and approaching the efficiency of naturally evolved metallohydrolases. A companion paper in Nature Methods described the RFdiffusion2 architecture itself.

## What Happened

Enzyme design is widely regarded as one of the hardest problems in computational biology. Enzymes catalyze reactions by precisely positioning substrates relative to catalytic residues and cofactors — a feat that requires not just the correct fold but the correct geometry at the active site, the correct electrostatic environment, and the correct protein dynamics to support the catalytic cycle. Prior computational enzyme design efforts, including David Baker's own celebrated work on de novo enzyme design from 2008–2018, produced functional enzymes but at catalytic efficiencies typically 3–6 orders of magnitude below their natural counterparts.

RFdiffusion2 addressed the architecture underlying the design process. The original RFdiffusion (2023) was trained on structures from the Protein Data Bank augmented with predicted structures from AlphaFold2. RFdiffusion2 was retrained on a substantially expanded experimental structure dataset, incorporating the explosion of experimental structural data from cryo-EM that had accumulated between 2022 and 2025, and introduced conditioning mechanisms that allowed specification of metal ion binding geometry and active site configuration alongside backbone constraints.

For metallohydrolase design, the pipeline specified the metal binding site (typically zinc coordinated by histidine and aspartate residues), the substrate binding geometry, and a backbone scaffold onto which the active site was to be placed. RFdiffusion2 then diffused over the remaining protein scaffold to produce complete structures, which were filtered by Rosetta energy and AlphaFold2 confidence before experimental testing. The best second-round designs — those produced by iterating on the initial experimental results — achieved kcat/KM values in the range of 10,000–53,000 M⁻¹s⁻¹, entering the range occupied by natural metallohydrolases catalyzing similar reactions.

## Why It Matters

The orders-of-magnitude improvement over prior enzyme design was not merely incremental — it crossed a threshold of practical relevance. Enzymes at natural catalytic efficiency are candidates for industrial biocatalysis, biosensors, therapeutic applications, and biosynthetic pathways. Enzymes 10,000-fold less efficient are curiosities that demonstrate the correct fold but cannot do useful chemistry at economically relevant concentrations. The RFdiffusion2 designs, for the first time, showed that computationally designed enzymes could reach the performance regime where real-world application was conceivable.

The dual-paper publication — Nature for the enzyme design, Nature Methods for the architecture — was unusual and reflected a recognition that RFdiffusion2 itself was a methodological contribution independent of its enzyme design application. The methods paper documented how retraining on experimental rather than predicted structures improved both the accuracy and diversity of backbone generation, a finding likely to influence the next generation of protein design tools across the field. Together, the two papers closed a chapter in computational enzyme design that had been open since the problem was first formulated as a grand challenge for the field.
