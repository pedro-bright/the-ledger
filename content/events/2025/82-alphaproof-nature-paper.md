---
id: alphaproof-nature-paper
title: "AlphaProof Published in Nature — Olympiad-Level Formal Math via RL"
date: 2025-11-12
category: research
significance: landmark
confidence: high
actors:
  - id: google-deepmind
    role: subject
tags: [mathematics, formal-proof, Lean, reinforcement-learning, IMO, AlphaProof, theorem-proving]
threads: [ai-for-science]
related: [gemini-deep-think-imo-2025-gold]
sources:
  - url: https://www.nature.com/articles/s41586-025-09833-y
    title: "Solving olympiad geometry without human demonstrations"
    type: primary_document
    publisher: Nature
    date: 2025-11-12
  - url: https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/
    title: "AI solves IMO problems at silver-medal level"
    type: official
    publisher: Google DeepMind
    date: 2025-11-12
  - url: https://www.nature.com/articles/d41586-025-03585-5
    title: "AI earns silver at the Mathematics Olympiad — what this means for maths"
    type: expert_interpretation
    publisher: Nature News & Views
    date: 2025-11-12
---

## Summary

Google DeepMind published the full technical description of AlphaProof in Nature (DOI 10.1038/s41586-025-09833-y), formalizing the system's silver-medal performance at IMO 2024 (28/42 points, solving 3 of 5 non-geometry problems). The paper detailed how AlphaProof used reinforcement learning against the Lean 4 theorem prover — generating millions of related problem variants to build up a self-play training curriculum — and why the approach produced proofs that were machine-verified and therefore logically guaranteed correct.

## What Happened

AlphaProof's IMO 2024 result had been announced informally in July 2024; the Nature publication in November 2025 constituted the peer-reviewed scientific record with full architectural details.

The system operated in a loop. A language model (fine-tuned on formal mathematics) generated candidate Lean 4 proof steps. Lean's type checker acted as a perfect verifier, immediately accepting correct steps and rejecting incorrect ones — a reward signal with zero false positives. AlphaProof used this signal in a reinforcement learning loop, but the key innovation was the training distribution: rather than training only on competition problems (which number in the hundreds), the system generated millions of variants by systematically modifying known problems — changing constants, swapping lemmas, altering constraints — and used RL to solve these, building up a diverse library of formal proof experience.

At IMO 2024, AlphaProof was given problems translated into Lean by a human formalization team (the geometry problem required specialist formalization that the automated pipeline couldn't handle, which is why it was excluded). For the three problems it solved, AlphaProof's search ran for up to the maximum allowed time and returned machine-verified Lean proofs.

The silver medal score of 28/42 placed AlphaProof above roughly the top 50% of human competitors at the most selective mathematics competition in the world.

## Why It Matters

The Nature publication made the technical contribution precise in ways that informal announcements had not. The RL-against-formal-verifier paradigm resolved a long-standing chicken-and-egg problem in automated theorem proving: you need interesting theorems to train on, but generating interesting theorems requires reasoning capability you don't yet have. AlphaProof's variant-generation approach created a self-bootstrapping curriculum that required only a modest seed of formally stated problems.

The guaranteed correctness property mattered at a level beyond benchmarks. A prose-proof AI can produce confident-sounding but subtly flawed arguments — mathematicians have noted this failure mode in all natural-language math generation systems. AlphaProof's Lean proofs were either correct or they didn't compile; there was no ambiguous middle ground. For a future in which AI assists with research-level mathematics, the ability to produce machine-checkable proofs is arguably more valuable than raw performance on competition problems. The companion Gemini Deep Think gold (July 2025, natural language) showed the two paradigms reaching comparable competition performance from opposite architectural directions.
