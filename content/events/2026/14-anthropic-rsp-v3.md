---
id: anthropic-rsp-v3
title: "Anthropic Publishes RSP v3.0, Drops Unconditional Pause Commitment"
date: 2026-02-24
category: safety
significance: landmark
confidence: high
actors:
  - id: anthropic
    role: subject
  - id: us-dod
    role: associated-organization
tags: [RSP, responsible-scaling-policy, pause-commitment, Jared-Kaplan, frontier-safety, Pentagon]
threads: [frontier-safety-policies]
related: [anthropic-asl3-activation-opus-4, anthropic-dod-debate-2026]
sources:
  - url: https://anthropic.com/responsible-scaling-policy/rsp-v3-0
    title: "Responsible Scaling Policy v3.0"
    type: primary_document
    publisher: Anthropic
    date: 2026-02-24
  - url: https://www.anthropic.com/news/responsible-scaling-policy-v3
    title: "Responsible Scaling Policy v3: What Changed and Why"
    type: official
    publisher: Anthropic
    date: 2026-02-24
  - url: https://www.governance.ai/analysis/anthropics-rsp-v3-0-how-it-works-whats-changed-and-some-reflections
    title: "Anthropic's RSP v3.0: How It Works, What's Changed, and Some Reflections"
    type: expert_interpretation
    publisher: Centre for the Governance of AI
    date: 2026-02-24
  - url: https://www.safer-ai.org/anthropics-responsible-scaling-policy-update-makes-a-step-backwards
    title: "Anthropic's Responsible Scaling Policy Update Makes a Step Backwards"
    type: expert_interpretation
    publisher: SaferAI
    date: 2026-02-24
---

## Summary

Anthropic published RSP v3.0, replacing the unconditional pause commitment from earlier versions with a conditional formulation that requires both leading capability and material catastrophic risk to trigger a stop — while adding new structural accountability mechanisms and naming Jared Kaplan as Responsible Scaling Officer, against a backdrop of Mrinank Sharma's resignation and reported Pentagon pressure.

## What Happened

The Responsible Scaling Policy's most closely watched commitment had been its pause clause: the unconditional obligation to halt training and deployment if a model cleared defined risk thresholds, regardless of competitive pressure from other labs. RSP v3.0 replaced this with a conditional pause: the obligation to stop now requires that Anthropic be both at the frontier (leading capability) and facing material catastrophic risk simultaneously. The change substantially narrowed the circumstances in which a pause could be invoked.

The revision introduced several compensatory structural changes. Frontier Safety Roadmaps — multi-quarter commitments to specific safety work — were added as a public accountability mechanism. Risk Reports, to be published every three to six months, created a cadence for external assessment of where models stood against thresholds. Jared Kaplan, one of Anthropic's co-founders and a central figure in scaling law research, was named Responsible Scaling Officer, creating a named individual accountable for RSP implementation.

The announcement followed two significant contextual events. On February 9, Mrinank Sharma — a senior alignment researcher who had been one of the key architects of the RSP framework — resigned from Anthropic. Reporting at the time linked the resignation in part to disagreements over the direction of the policy revision. Separately, The Register and other outlets reported that Pentagon engagement with Anthropic had intensified in the period preceding the v3.0 release, with US government officials pressing for changes that would make Claude available for national security applications — a context that the shift away from unconditional pause was seen as accommodating.

## Why It Matters

The unconditional pause commitment had been the element of Anthropic's RSP that safety researchers most frequently cited as distinguishing it from softer voluntary commitments at other labs. An unconditional pause cannot be negotiated away by competitive pressure or government requests; a conditional pause that requires both frontier status and material risk creates two variables, either of which can be contested. External evaluators noted that the new formulation gave Anthropic significantly more discretion over when pause obligations applied, while the internal accountability measures — however substantive — were mechanisms Anthropic itself controlled. The Sharma resignation, published reporting on Pentagon pressure, and the timing of the change together created a contested narrative about causation that the structural improvements in v3.0 did not resolve. The revision became the clearest single example of the 2025-2026 pattern: voluntary safety commitments, once made unconditionally, being renegotiated as competitive and geopolitical context shifted.
