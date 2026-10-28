---
id: gemini-deep-think-imo-2025-gold
title: "Gemini Deep Think Achieves IMO 2025 Gold in Natural Language"
date: 2025-07-21
category: research
significance: landmark
confidence: high
actors:
  - id: google-deepmind
    role: subject
tags: [mathematics, IMO, reasoning, formal-math, benchmark, deep-think]
threads: [ai-for-science]
related: [alphaproof-nature-paper]
sources:
  - url: https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/
    title: Advanced version of Gemini with Deep Think officially achieves gold medal standard at the IMO
    type: official
    publisher: Google DeepMind
    date: '2025-07-21'
revision:
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: terry-tang
---

## Summary

Google DeepMind reported on July 21, 2025 that an advanced Gemini Deep Think system reached gold-medal standard at IMO 2025, solving five problems for 35 of 42 points using natural-language proofs.
Its official account is separate from arXiv 2507.15855, a paper by Yichen Huang and Lin F. Yang about a verification-and-refinement approach using Gemini 2.5 Pro.
That paper is not the technical report of DeepMind's competition run.

## Editorial correction, October&nbsp;26,&nbsp;2026

The cited arXiv identifier was assigned an incorrect title and attribution.
Version 1, submitted July 21, is titled Gemini 2.5 Pro Capable of Winning Gold at IMO 2025 and names Yichen Huang and Lin F. Yang.
Later versions changed the title and expanded the model comparison; they do not turn it into DeepMind's official report.
The misattributed citation is removed from the event's supporting source list and preserved here as contextual evidence of the correction.
The existing official DeepMind announcement remains the source for the competition result.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-gemini-deep-think-imo-2025-gold-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

The 2025 IMO was held in Sunshine Coast, Australia. DeepMind submitted Gemini Deep Think as an unofficial participant, operating under the same problem constraints as human competitors: no external tools, natural language solutions only, the standard 4.5-hour session per day across two days. The model solved Problems 1, 2, 3, 4, and 6 correctly, failing only Problem 5. Total score: 35/42.

The gold medal threshold at IMO 2025 was 34 points. Gemini Deep Think exceeded it by one point.

The key technical feature was Deep Think, a mode that allowed the model to generate and evaluate many parallel reasoning chains before committing to an answer. Unlike standard next-token generation, Deep Think treated solution exploration as a search problem, generating candidate proof strategies, identifying flaws, and backtracking — a process that traded latency for correctness on problems requiring extended logical chains. The model operated entirely in natural language; proofs were written in the standard English mathematical style that human competitors use, and scored by the same human judges.

This distinguished it from AlphaProof, which won silver at IMO 2024 using a hybrid system that translated problems into Lean formal proofs and used reinforcement learning to search for machine-verified solutions. Gemini Deep Think's gold came from a model writing prose mathematics — the approach closer to human mathematical practice.

## Why It Matters

IMO gold in natural language closed a gap that remained open after AlphaProof's silver. AlphaProof's architecture relied on the formal verification scaffolding of the Lean theorem prover, which guaranteed correctness but required a translation step between informal mathematical statements and machine-checkable formal logic — a non-trivial bottleneck for geometry problems and for novel proof strategies that don't fit standard formalization templates. Gemini Deep Think demonstrated that a model could achieve comparable performance working entirely in the mode human mathematicians actually use.

The implications for mathematical research are contested. IMO problems are extraordinarily hard by high school standards but are deliberately solvable — they have clean answers, are designed to test technique rather than originality, and are selected to be tractable in 4.5 hours. The open question is whether the reasoning capabilities that produce IMO gold generalize to research mathematics, which involves months of exploration, dead ends, and genuine conceptual novelty. Whether 2025's IMO gold marks a transition point or a plateau in AI mathematical capability will only be visible in retrospect.
