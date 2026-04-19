---
id: ai-for-science
title: "AI for Science"
status: active
started: 2020-11-30
core_question: "How is AI moving from surrogate models to frontline scientific discovery — in biology, chemistry, mathematics, weather, and physics — and which results generalize vs. remain narrow demos?"
curator: terry-tang
curator_scope: initial-synthesis
contestation:
  status: uncontested
  challenge_window: open
last_updated: 2026-04-19
events:
  - arc-institute-evo-2-dna-foundation-model
  - ecmwf-aifs-operational
  - isomorphic-labs-600m-round
  - boltz-2-open-source-drug-discovery
  - deepmind-alphagenome-release
  - gemini-deep-think-imo-2025-gold
  - deepmind-cfs-fusion-partnership
  - rfdiffusion-antibody-design-nature
  - alphaproof-nature-paper
  - rfdiffusion2-enzyme-design-nature
---

## Canonical Synthesis

**Author:** terry-tang | **Last updated:** 2026-04-19

The arc of AI for science runs from AlphaFold — a single system solving a single 50-year-old problem — to a broad front of tools reshaping how researchers do biology, chemistry, mathematics, weather forecasting, and energy physics simultaneously. The field's trajectory is not a straight line from benchmark to application, but the density of landmark results in 2025 makes it harder to dismiss as a series of isolated demos.

AlphaFold 2's release in November 2020 was the inflection point that started this thread. The system predicted protein structures from sequence with accuracy that matched experimental crystallography, effectively solving a problem that had resisted the field for five decades. The 2024 Nobel Prize in Chemistry, shared by Demis Hassabis and John Jumper (AlphaFold) and David Baker (computational protein design), retrospectively confirmed what practitioners had recognized immediately: this was not an incremental improvement but a category change. AlphaFold 3's extension to protein-ligand and protein-nucleic acid complexes in 2024, and its commercialization through Isomorphic Labs (which raised $600M in March 2025 from Thrive Capital), established AI-native drug discovery as a viable commercial category rather than a research aspiration.

**The 2025 biology wave.** Five major results in 2025 pushed AI's role in biology from structure prediction toward functional understanding and design. Arc Institute's Evo 2 (February 2025) scaled DNA foundation modeling to 40 billion parameters across 100,000+ species, achieving zero-shot pathogenicity prediction and synthetic genome design — moving the scope of biological AI from proteins to the genome. DeepMind's AlphaGenome (June 2025) took the complementary approach: a unified model for regulatory genomics that jointly predicted gene expression, chromatin state, transcription factor binding, and splicing from megabase DNA windows, outperforming specialized models on 22 of 24 benchmarks. On the design side, Baker Lab published two Nature papers — RFdiffusion antibody design (November 2025) and RFdiffusion2 enzyme design (December 2025) — demonstrating atomically precise antibody construction against user-specified epitopes and metallohydrolase enzymes approaching natural catalytic efficiency. Boltz-2 (June 2025), released open-source by MIT CSAIL and Recursion, delivered near-FEP binding affinity prediction at 1,000× the speed — the first open-weight model to make high-accuracy virtual screening accessible outside commercial platforms.

**Mathematics.** Two results in 2025 established AI at olympiad level by different routes. AlphaProof's Nature paper (November 2025) formalized the system's silver-medal performance at IMO 2024 using reinforcement learning against the Lean 4 theorem prover — machine-verified proofs guaranteed correct by construction. Gemini Deep Think's gold medal at IMO 2025 (July 2025) achieved comparable performance entirely in natural language, without formal verification scaffolding, working in the mode human mathematicians actually use. The two paradigms — formal correctness vs. prose fluency — are likely to coexist: formal provers offer guarantees, natural language offers generality.

**Infrastructure science.** ECMWF's operational deployment of AIFS (February 2025) was the first time a machine-learning weather system ran in real-time 24/7 at a major forecast center, with an ensemble version following in July. The 1,000× energy efficiency advantage over physics-based numerical weather prediction has implications beyond meteorology: if similar gains apply to climate simulation, the compute cost of century-scale ensemble projections might become tractable. DeepMind's partnership with Commonwealth Fusion Systems (October 2025) applied deep RL plasma control to SPARC, the first application of the approach to a commercial fusion program.

**Commercial.** Isomorphic Labs represents the clearest test of whether AI-native drug discovery translates to clinical outcomes. The $600M raise funds an internal pipeline in oncology and immunology, with milestone deals at Eli Lilly and Novartis. The timeline from AI-designed candidate to approved drug is a decade and subject to attrition rates that AI does not change. Whether the platform advantage in structure prediction and binding affinity propagates through the clinical trial process is the central unresolved question for AI pharma.

## Open Questions

- Clinical translation: none of the AI-designed protein therapeutics or drug candidates from AlphaFold-era tools have completed a Phase III trial. Does the structural biology advantage compound through clinical development, or does it stop at the nomination stage?
- Open vs. API-gated access: Evo 2, Boltz-2, RFantibody, and RFdiffusion2 are open-weight; AlphaGenome launched API-only. The two-tier ecosystem — academic open models vs. commercial API platforms — may fragment the research community and concentrate advanced capabilities in well-funded labs.
- Dual-use biosafety: models capable of designing synthetic genomes (Evo 2) and antibodies targeting specified epitopes (RFdiffusion) have dual-use implications that open-weight release cannot retract. The field has not converged on governance norms proportionate to the capability level.
- Generalization vs. demonstration: IMO gold and enzyme design near natural efficiency are extraordinary results; the recurring question is whether the underlying capabilities generalize to research-level mathematics and to enzyme targets outside the training distribution. Benchmark performance and field-relevant utility have historically diverged in AI.
- Physics-based vs. data-driven: ECMWF's AIFS and similar ML weather models outperform physics simulations on medium-range forecasting but have unknown failure modes in extreme or novel weather regimes. The appropriate role of data-driven vs. first-principles models in high-stakes prediction remains unsettled.
