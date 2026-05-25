---
id: openai-erdos-unit-distance-disproof
title: "OpenAI Reasoning Model Autonomously Disproves Erdős Unit Distance Conjecture"
date: 2026-05-20
category: research
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/model-disproves-discrete-geometry-conjecture/
    title: "An OpenAI model has disproved a central conjecture in discrete geometry"
    type: official
    publisher: OpenAI
    date: 2026-05-20
    accessed: 2026-05-25
    archive_url: https://web.archive.org/web/*/https://openai.com/index/model-disproves-discrete-geometry-conjecture/
  - url: https://arxiv.org/abs/2605.20695
    title: "Remarks on the disproof of the unit distance conjecture"
    type: primary_document
    publisher: arXiv
    date: 2026-05-20
    accessed: 2026-05-25
actors:
  - id: openai
    role: subject
regions: [US]
tags: [mathematics, discrete-geometry, reasoning-models, open-problems, combinatorics, autonomous-discovery]
threads: []
related: []
state: published
revision:
  created: 2026-05-25
  last_reviewed: 2026-05-25
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On May 20, 2026, OpenAI announced that an internal general-purpose reasoning model had autonomously disproved the Erdős unit distance conjecture, an open problem in discrete combinatorial geometry first posed by Paul Erdős in 1946. The model produced an infinite family of point-set constructions achieving a polynomial improvement over the square grid configurations previously believed to represent the best known lower bound, connecting the geometric problem to algebraic number theory via Golod-Shafarevich theory and infinite class field towers. Nine external mathematicians — including Fields Medalist W.T. Gowers and Princeton's Will Sawin, who refined the constructive exponent to δ = 0.014 — independently verified and formalized the proof, submitting it to arXiv as preprint 2605.20695 on the same day as OpenAI's announcement.

## What Happened

The unit distance problem is one of the best-known open questions in combinatorial geometry: given n points placed in a plane, what is the maximum number of pairs at distance exactly 1 from each other? Paul Erdős posed it in 1946 and attached prize money to its resolution. For nearly 80 years, the strongest known lower bound — the largest number of unit distances a construction could achieve — came from slightly skewed square grids, which produce approximately n^(1 + c/log log n) unit-distance pairs, where the exponent improvement over n shrinks to zero as n grows. The best known upper bound, from Spencer, Szemerédi, and Trotter (1984), is O(n^(4/3)). The gap between those bounds remained unresolved, with the prevailing view that square grids were close to optimal.

OpenAI's announcement described an internal general-purpose reasoning model — not purpose-built for mathematics and not aimed at this problem specifically — that produced an infinite family of point-set constructions achieving n^(1+δ) unit-distance pairs for a fixed positive constant δ. That is a polynomial rather than sub-polynomial improvement over square grids, resolving the question of whether square grids were asymptotically optimal. The model's approach bypassed traditional geometric arguments and instead used tools from algebraic number theory: specifically Golod-Shafarevich theory, the theory of infinite class field towers, and ideas building on work by Ellenberg-Venkatesh. The model constructed point sets inside algebraic number fields whose arithmetic structure forces many unit-distance pairs.

OpenAI published its announcement alongside a companion document: a "human-digested, somewhat simplified, and somewhat generalized version" of the AI-generated proof, submitted to arXiv the same day. The nine co-authors of the arXiv paper were Noga Alon (Princeton), Thomas Bloom (Oxford), W.T. Gowers (Cambridge, Fields Medal 1998), Daniel Litt (Toronto), Will Sawin (Princeton), Arul Shankar (Toronto), Jacob Tsimerman (Toronto), Victor Wang (MIT), and Melanie Matchett Wood (Harvard). Sawin's contribution refined the exponent to a specific value of δ = 0.014, tightening the construction from the original AI-generated version. The arXiv paper states the argument "relies crucially on ideas that may be attributed to Ellenberg-Venkatesh, Golod-Shafarevich, and Hajir-Maire-Ramakrishna."

Sam Altman wrote that the result was one that could be "recommended for acceptance without any hesitation to the Annals of Mathematics." Gowers, who described it as "a milestone in AI mathematics," had previously been publicly skeptical about AI's capacity for original mathematical proof, giving his assessment particular weight.

## Why It Matters

The Erdős unit distance disproof is the first documented case of a generalist AI model producing a correct, original proof of a prominent open problem in pure mathematics — one subsequently verified, simplified, and submitted to the scientific record by independent mathematicians of standing. Prior AI mathematics results in 2026 — AlphaEvolve's matrix multiplication improvement in April and benchmark performance on FrontierMath — involved a specialized evolutionary coding agent and multiple-choice evaluation respectively; neither involved an unscaffolded general-purpose model producing an original proof later deemed publishable.

The mathematical approach is independently notable: the problem belongs to discrete geometry; the solution came from algebraic number theory. Cross-field connections of this kind are generally regarded as difficult even for human mathematicians, because they require recognizing structural similarities between problems that superficially belong to different areas of mathematics. Whether the model found this connection through genuine mathematical reasoning or pattern-matching to related literature — the Ellenberg-Venkatesh and Golod-Shafarevich building blocks exist in the published record — is not resolved by the announcement or the arXiv paper.

Significant facts are not disclosed by OpenAI: the specific model and architecture, the exact prompting methodology, whether the model produced the proof in a single attempt or through multiple iterations, and what human intermediation if any was involved between the model's output and the proof examined by the verifiers. These gaps matter because the difference between "a model instructed to explore algebraic number theory approaches" and "a model that connected those approaches without direction" is substantial for interpreting what this result demonstrates about autonomous mathematical capability. Until those details are available, the record shows that a general-purpose OpenAI model produced a construction subsequently verified as a genuine disproof — and does not show more or less than that.
