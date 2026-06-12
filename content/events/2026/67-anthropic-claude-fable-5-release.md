---
id: anthropic-claude-fable-5-release
title: "Anthropic Releases Claude Fable 5, First Public Mythos-Class Model"
date: 2026-06-09
category: models
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/news/claude-fable-5-mythos-5
    title: "Claude Fable 5 and Claude Mythos 5"
    type: primary_document
    publisher: Anthropic
    date: 2026-06-09
    accessed: 2026-06-12
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/news/claude-fable-5-mythos-5
  - url: https://techcrunch.com/2026/06/09/anthropics-claude-fable-5-is-a-version-of-mythos-the-public-can-access-today/
    title: "Anthropic's Claude Fable 5 is a version of Mythos the public can access today"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-06-09
    accessed: 2026-06-12
  - url: https://www.theverge.com/ai-artificial-intelligence/948280/anthropic-claude-fable-invisible-distillation-guardrail
    title: "Anthropic apologizes for invisible Claude Fable guardrail that silently degraded AI research queries"
    type: secondary_reporting
    publisher: The Verge
    date: 2026-06-11
    accessed: 2026-06-12
actors:
  - id: anthropic
    role: subject
  - id: dario-amodei
    role: executive
regions: [US]
tags: [claude, frontier-models, mythos-class, safety-guardrails, model-release, distillation-guardrail, glasswing]
threads: [frontier-safety-policies]
related: [anthropic-glasswing-expansion-june-2026, anthropic-claude-opus-4-8-release, anthropic-rsp-v3]
state: published
revision:
  created: 2026-06-12
  last_reviewed: 2026-06-12
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On June 9, 2026, Anthropic released Claude Fable 5 — the first publicly available model in its Mythos-class tier, which had until that date been accessible only through the restricted Project Glasswing program. Fable 5 shares underlying weights with Claude Mythos 5, the model previously deployed in limited form for government and critical infrastructure vulnerability discovery. Within 24 hours of release, Anthropic reversed a hidden safety guardrail after community discovery that the model silently degraded responses for queries it identified as AI model distillation attempts — a policy undisclosed in Anthropic's public communications despite being documented in a 319-page system card.

## What Happened

Anthropic made Claude Fable 5 available on June 9, 2026, via the Claude API, Amazon Bedrock, Google Cloud, and Microsoft Foundry. The model was included at no additional cost for Claude Pro, Max, Team, and seat-based Enterprise subscribers through June 22, after which those plan types would require usage credits. API pricing was set at $10 per million input tokens and $50 per million output tokens — double the rate for Claude Opus 4.8.

Fable 5 is the public-access variant of the Mythos model tier. Claude Mythos 5, built on the same underlying weights without the safety classifiers applied to Fable 5, remains available only through Project Glasswing — Anthropic's controlled-access program for critical infrastructure vulnerability discovery — and through limited US government channels. The division between Fable 5 and Mythos 5 is implemented at the classifier layer, not at the model layer: the base model is the same. Anthropic described Fable 5 as state-of-the-art on nearly all tested capability benchmarks, reporting 95.0% on SWE-Bench Verified, 80.3% on SWE-Bench Pro (the leading score at launch), 92.6% on GPQA Diamond, 88.0% on Terminal-Bench 2.1, and 98.5% on τ²-Bench. At the Artificial Analysis Intelligence Index, Fable 5 ranked first across all public models with a quality score of 64.9 at launch.

The model carries a safety classifier architecture that routes high-risk queries — those related to cybersecurity, biology, chemistry, and, as was later prominently disclosed, AI model distillation — to Claude Opus 4.8 rather than completing them via Fable 5. Anthropic stated these guardrails trigger in fewer than 5% of sessions on average. The full safety architecture was documented in a 319-page system card published alongside the release.

Alongside the model, Anthropic announced a 30-day mandatory traffic retention policy for all Fable 5 and Mythos 5 sessions. Enterprise customers who had previously negotiated zero-retention agreements — under which Anthropic committed to not storing conversation data — found those agreements superseded. Anthropic stated the retention was required not for training but for "defending against complex and novel attacks, including new jailbreaks, and identifying and reducing false positives." The policy was applied across all access channels and subscription tiers without disclosed recourse for enterprises whose compliance obligations conflicted with it.

Within approximately 24 hours of the release, researchers identified a guardrail not prominently disclosed in Anthropic's public launch communications: Fable 5 would silently detect queries it assessed as attempts to distill the model — extracting its outputs for use in training competing or derivative AI systems — and degrade or reroute responses without notification. The guardrail's existence was documented in the 319-page system card, but its invisible operation — in contrast to the explicitly disclosed cybersecurity and biosecurity fallbacks — generated rapid backlash. Fortune's coverage characterized the undisclosed policy as "secret sabotage." Researchers identified that invisible capability degradation could corrupt benchmark comparisons, contaminate legitimate AI research workflows, and violate the reasonable expectations of enterprise customers who had deployed the model in evaluation pipelines.

Anthropic reversed the policy the following day. In a public statement, Anthropic said: "We're changing Fable 5's safeguards for frontier LLM development to make them visible. We made the wrong tradeoff, and we apologize for not getting the balance right." Under the revised policy, queries triggering the distillation guardrail now produce a visible fallback to Claude Opus 4.8 with an explicit notification to the user — consistent with how the cybersecurity and biosecurity guardrails had been handled from launch.

## Why It Matters

The Fable 5 release marks the first time Anthropic made a Mythos-class model — the same tier that had discovered 271 zero-day vulnerabilities in Firefox 150 under Project Glasswing — accessible to the general public. The boundary Anthropic had drawn between Glasswing-restricted and publicly available capabilities moved with the release. Whether Fable 5's classifier architecture provides durable protection against offensive misuse, or whether it will be systematically circumvented, is not determinable from the launch documentation.

The guardrail reversal is the episode's historically notable element. Anthropic's initial choice to implement an invisible capability-degradation guardrail for distillation-related queries represents a tradeoff between competitive protection and user transparency: the operational assumption being that users unaware of the degradation will not route around it, while users who know will. The reversal, completed within approximately 24 hours of community discovery, established a data point for how quickly organized scrutiny of frontier model behavior can force policy changes. The speed of both discovery and reversal suggests that invisible capability limitations on widely deployed frontier models face systematic evaluation pressure that makes them difficult to sustain regardless of the original justification.

The 30-day mandatory traffic retention policy remains in place as a structural change from the release. Enterprise zero-retention agreements had represented a privacy commitment that regulated industries — healthcare, legal, financial services — had used as a precondition for enterprise AI adoption. Superseding those agreements to enable safety monitoring, even with the stated purpose of defending against novel attacks rather than training, establishes that Anthropic reserves the right to renegotiate privacy terms unilaterally when safety considerations it judges sufficient arise. The scope of this reservation and its implications for regulated enterprise deployments have not been addressed in Anthropic's public disclosures.
