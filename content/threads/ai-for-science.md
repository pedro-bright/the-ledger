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
last_updated: 2026-11-14
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
  - openai-o1-er-diagnosis-study
---

## Canonical Synthesis

**Author:** terry-tang | **Last updated:** 2026-11-14

The arc of AI for science runs from AlphaFold — a single system solving a single 50-year-old problem — to a broad front of tools reshaping how researchers do biology, chemistry, mathematics, weather forecasting, and energy physics simultaneously. The field's trajectory is not a straight line from benchmark to application, but the density of landmark results in 2025 makes it harder to dismiss as a series of isolated demos.

AlphaFold 2's release in November 2020 was the inflection point that started this thread. The system predicted protein structures from sequence with accuracy that matched experimental crystallography, effectively solving a problem that had resisted the field for five decades. The 2024 Nobel Prize in Chemistry, shared by Demis Hassabis and John Jumper (AlphaFold) and David Baker (computational protein design), retrospectively confirmed what practitioners had recognized immediately: this was not an incremental improvement but a category change. AlphaFold 3's extension to protein-ligand and protein-nucleic acid complexes in 2024, and its commercialization through Isomorphic Labs (which raised $600M in March 2025 from Thrive Capital), established AI-native drug discovery as a viable commercial category rather than a research aspiration.

**The 2025 biology wave.** Five major results in 2025 pushed AI's role in biology from structure prediction toward functional understanding and design. Arc Institute's Evo 2 (February 2025) scaled DNA foundation modeling to 40 billion parameters across 100,000+ species, achieving zero-shot pathogenicity prediction and synthetic genome design — moving the scope of biological AI from proteins to the genome. DeepMind's AlphaGenome (June 2025) took the complementary approach: a unified model for regulatory genomics that jointly predicted gene expression, chromatin state, transcription factor binding, and splicing from megabase DNA windows, outperforming specialized models on 22 of 24 benchmarks. On the design side, Baker Lab published two Nature papers — RFdiffusion antibody design (November 2025) and RFdiffusion2 enzyme design (December 2025) — demonstrating atomically precise antibody construction against user-specified epitopes and metallohydrolase enzymes approaching natural catalytic efficiency. Boltz-2 (June 2025), released open-source by MIT CSAIL and Recursion, delivered near-FEP binding affinity prediction at 1,000× the speed — the first open-weight model to make high-accuracy virtual screening accessible outside commercial platforms.

**Mathematics.** Two results in 2025 established AI at olympiad level by different routes. AlphaProof's Nature paper (November 2025) formalized the system's silver-medal performance at IMO 2024 using reinforcement learning against the Lean 4 theorem prover — machine-verified proofs guaranteed correct by construction. Gemini Deep Think's gold medal at IMO 2025 (July 2025) achieved comparable performance entirely in natural language, without formal verification scaffolding, working in the mode human mathematicians actually use. The two paradigms — formal correctness vs. prose fluency — are likely to coexist: formal provers offer guarantees, natural language offers generality.

**Infrastructure science.** ECMWF's operational deployment of AIFS (February 2025) was the first time a machine-learning weather system ran in real-time 24/7 at a major forecast center, with an ensemble version following in July. The 1,000× energy efficiency advantage over physics-based numerical weather prediction has implications beyond meteorology: if similar gains apply to climate simulation, the compute cost of century-scale ensemble projections might become tractable. DeepMind's partnership with Commonwealth Fusion Systems (October 2025) applied deep RL plasma control to SPARC, the first application of the approach to a commercial fusion program.

**Commercial.** Isomorphic Labs represents the clearest test of whether AI-native drug discovery translates to clinical outcomes. The $600M raise funds an internal pipeline in oncology and immunology, with milestone deals at Eli Lilly and Novartis. The timeline from AI-designed candidate to approved drug is a decade and subject to attrition rates that AI does not change. Whether the platform advantage in structure prediction and binding affinity propagates through the clinical trial process is the central unresolved question for AI pharma.

## What changed since the last synthesis

**Author:** terry-tang | **Covers:** events dated 2026-05-20 to 2026-11-10 | **Written:** 2026-11-14

*Draft assistance: AI-assisted. This section was drafted from the archive's event entries for the curator to edit and sign.*

The open question below about research-level mathematics gained its first documented case on May 20, 2026, when OpenAI said an internal general-purpose model had disproved the Erdős unit distance conjecture and nine outside mathematicians verified the construction the same day ([Erdős disproof](/events/openai-erdos-unit-distance-disproof)).
OpenAI did not disclose the model, the prompting method, or the human intermediation involved ([Erdős disproof](/events/openai-erdos-unit-distance-disproof)).
OpenAI's September 8 claim to have resolved the Navier-Stokes Millennium Prize problem was still unverified three days later, when twenty-five Fields medallists declared the goals of AI companies and mathematicians "severely misaligned," arguing that rushed announcements bypass the work of understanding and raise attribution questions ([Fields medallists' declaration](/events/fields-medallists-declaration-ai-mathematics-misalignment)).
On September 21, OpenAI announced an independent advisory group at the Institute for Advanced Study to advise on how it assesses and releases mathematical results, excluding the pace of its work, and in the same post claimed that its internal model had resolved more than 100 open problems, with no list, papers, or external verification ([mathematics advisory group](/events/openai-mathematics-advisory-group-ias)).

On July 29, OpenAI offered 10,000 academic researchers free hosted model access, with a target of 100,000 through 2027 and no weights or training data, which places it on the API-gated side of the two-tier ecosystem described below ([academic access program](/events/openai-chatgpt-academic-researchers)).
On August 6, Google DeepMind reported that WeatherNext Cyclones added about one day of useful accuracy to cyclone track and intensity forecasts and released its weights, extending to cyclones the machine-learning forecasting that [ECMWF's AIFS](/events/ecmwf-aifs-operational) made operational in 2025 ([WeatherNext Cyclones](/events/google-weathernext-cyclone-forecasting)).
Its gains rest on one retrospective evaluation and a limited live season, and the team said it did not fully understand which signals the model used ([WeatherNext Cyclones](/events/google-weathernext-cyclone-forecasting)).

In biology, Google DeepMind and Isomorphic Labs published a joint bioresilience program on July 16 covering misuse prevention, pathogen detection, and countermeasure design, without validation results for its sequence screening ([bioresilience program](/events/google-deepmind-isomorphic-bioresilience)).
On August 27, Anthropic previewed the Model Hardware Standard for agent-operated lab instruments, with safety limits enforced in the driver below the model and performance figures not independently replicated ([Model Hardware Standard](/events/anthropic-model-hardware-standard)).
On September 23, Anthropic reported that Claude agents had found a family of phage reverse transcriptases, named ART, whose function it does not know; the result is an unreviewed company pre-print, human scientists did the lab work, and a Stanford team independently described a similar but distinct system ([ART discovery](/events/anthropic-biolab-claude-art-enzyme-discovery)).
On October 7, Biohub, the US Energy Department, the NIH, Google DeepMind, Isomorphic Labs, and Meta announced $1.8 billion for AI-ready cell data, a total mixing new money with in-kind and earlier spending ([Virtual Biology Initiative](/events/biohub-virtual-biology-initiative-1-8-billion)).
On October 24, the UK announced an AI Biosecurity Lab with £100 million in public funding and up to £200 million in OpenAI and Anthropic commitments, without named leadership ([UK AI Biosecurity Lab](/events/uk-ai-biosecurity-lab-openai-anthropic-credits)).
Both biosecurity efforts address the dual-use open question below through trusted model access, and neither announcement reported measured results ([bioresilience program](/events/google-deepmind-isomorphic-bioresilience), [UK AI Biosecurity Lab](/events/uk-ai-biosecurity-lab-openai-anthropic-credits)).

On November 10, Google DeepMind reported that AlphaProof Code agents wrote about 6.5 million lines of Lean proof establishing security properties of libsignal's compiled machine code, carrying the formal method of [AlphaProof](/events/alphaproof-nature-paper) from competition mathematics to production software ([AlphaProof Code](/events/google-deepmind-alphaproof-code-signal-verification)).
The guarantee holds only within the stated scope and on about 26,000 lines of trusted specifications, and no independent group had checked the proofs at publication ([AlphaProof Code](/events/google-deepmind-alphaproof-code-signal-verification)).

## Open Questions

- Clinical translation: none of the AI-designed protein therapeutics or drug candidates from AlphaFold-era tools have completed a Phase III trial. Does the structural biology advantage compound through clinical development, or does it stop at the nomination stage?
- Open vs. API-gated access: Evo 2, Boltz-2, RFantibody, and RFdiffusion2 are open-weight; AlphaGenome launched API-only. The two-tier ecosystem — academic open models vs. commercial API platforms — may fragment the research community and concentrate advanced capabilities in well-funded labs.
- Dual-use biosafety: models capable of designing synthetic genomes (Evo 2) and antibodies targeting specified epitopes (RFdiffusion) have dual-use implications that open-weight release cannot retract. The field has not converged on governance norms proportionate to the capability level.
- Generalization vs. demonstration: IMO gold and enzyme design near natural efficiency are extraordinary results; the recurring question is whether the underlying capabilities generalize to research-level mathematics and to enzyme targets outside the training distribution. Benchmark performance and field-relevant utility have historically diverged in AI.
- Physics-based vs. data-driven: ECMWF's AIFS and similar ML weather models outperform physics simulations on medium-range forecasting but have unknown failure modes in extreme or novel weather regimes. The appropriate role of data-driven vs. first-principles models in high-stakes prediction remains unsettled.
