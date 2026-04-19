---
id: openai-preparedness-framework-v2
title: "OpenAI Preparedness Framework v2 Drops Persuasion as Tracked Risk"
date: 2025-04-15
category: safety
significance: major
confidence: high
actors:
  - id: openai
    role: subject
tags: [preparedness-framework, risk-categories, persuasion, CBRN, frontier-safety]
threads: [frontier-safety-policies]
related: [deepmind-fsf-v3]
sources:
  - url: https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf
    title: "OpenAI Preparedness Framework v2"
    type: primary_document
    publisher: OpenAI
    date: 2025-04-15
  - url: https://openai.com/index/updating-our-preparedness-framework/
    title: "Updating Our Preparedness Framework"
    type: official
    publisher: OpenAI
    date: 2025-04-15
  - url: https://arxiv.org/abs/2509.24394
    title: "Analysis of OpenAI Preparedness Framework v2"
    type: expert_interpretation
    date: 2025-09-01
---

## Summary

OpenAI published a revised Preparedness Framework that streamlined its tracked risk categories from four to three — removing persuasion and influence operations as a formally monitored capability tier — and introduced a competitive-parity exception allowing deployment of Critical-rated models if a competitor has already released equivalent capability.

## What Happened

The original Preparedness Framework, published in late 2023 and updated in 2024, had tracked four high-level capability categories: CBRN (chemical, biological, radiological, nuclear), cybersecurity, model autonomy, and persuasion and influence operations. The v2 revision consolidated the framework to three categories — CBRN, Cyber, and AI self-improvement — dropping persuasion from formal threshold tracking.

The competitive-parity exception was the second major change. Under the original framework, a Critical-rated model could not be deployed regardless of external competitive conditions. Under v2, if a competitor has publicly released a model with equivalent capability at the Critical level, OpenAI can deploy its own Critical-rated model. The document framed this as aligning safety standards with industry baselines rather than imposing unilateral constraints.

The revision emerged roughly five months before DeepMind's Frontier Safety Framework v3, which moved in the opposite direction by adding harmful manipulation as a new Critical Capability Level.

## Why It Matters

The removal of persuasion from the framework's formal tracking structure was the most substantive policy change and the most contested. Persuasion and influence operations had been among the earliest safety concerns raised about large language models — the ability to generate targeted, personalized, and linguistically convincing content at scale was precisely the capability that distinguished frontier models from earlier text generators. The competitive-parity clause marked an explicit acknowledgment that OpenAI's safety thresholds were partly contingent on what other labs did, rather than being set unconditionally on capability grounds. Together, these changes inaugurated a pattern that would define 2025: the gradual qualification of voluntary safety commitments under competitive pressure.
