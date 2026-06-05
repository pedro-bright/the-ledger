---
id: anthropic-glasswing-expansion-june-2026
title: "Anthropic Expands Project Glasswing to 150 New Organizations Across Critical Infrastructure Sectors"
date: 2026-06-02
category: safety
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/news/expanding-project-glasswing
    title: "Expanding Project Glasswing"
    type: official
    publisher: Anthropic
    date: 2026-06-02
    accessed: 2026-06-05
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/news/expanding-project-glasswing
  - url: https://techcrunch.com/2026/06/02/anthropic-scales-claude-mythos-to-critical-infrastructure-in-15-countries/
    title: "Anthropic scales Claude Mythos to critical infrastructure in 15 countries"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-06-02
    accessed: 2026-06-05
actors:
  - id: anthropic
    role: subject
regions: [US]
tags: [glasswing, mythos, cybersecurity, vulnerability-discovery, critical-infrastructure, security-research, defensive-ai]
threads: [frontier-safety-policies]
related: [nsa-mythos-access-dod-blacklist, anthropic-series-h-65b, anthropic-rsp-v3]
state: published
revision:
  created: 2026-06-05
  last_reviewed: 2026-06-05
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On June 2, 2026, Anthropic announced the expansion of Project Glasswing — its controlled-access program deploying Claude Mythos Preview for defensive vulnerability discovery — from roughly 50 initial partners to approximately 200 organizations total, spanning more than 15 countries. The expansion prioritized critical infrastructure operators in power, water, healthcare, communications, and hardware sectors whose software collectively affects more than 100 million people. Initial partners had by that date discovered more than 10,000 high- or critical-severity security vulnerabilities using the model. Claude Mythos Preview, Anthropic's highest-capability model, remains withheld from public release.

## What Happened

Anthropic launched Project Glasswing on April 7, 2026, alongside its announcement of Claude Mythos Preview — a model the company simultaneously stated it would not release publicly, citing concerns about its cybersecurity risk profile. The initial Glasswing cohort consisted of approximately 40 to 50 organizations, predominantly large technology and security companies: Amazon Web Services, Apple, Cisco, CrowdStrike, Google, JPMorganChase, Microsoft, Palo Alto Networks, and others. Anthropic committed up to $100 million in usage credits for the program. Glasswing partners used Mythos to scan their own systems and codebases for exploitable vulnerabilities.

On June 2, Anthropic announced approximately 150 new organizations had been added to the program, bringing total participation to roughly 200 organizations across more than 15 countries. The new cohort shifted the program's composition: where the initial partners were predominantly technology companies, the expansion added critical infrastructure operators and their vendors — organizations in power, water, healthcare, communications, and hardware sectors whose code underpins systems affecting more than 100 million people, according to Anthropic's characterization. Anthropic framed the expansion as targeting partners where "a major attack could affect more than 100 million people, with important ramifications for both global and national security."

At the time of the June 2 announcement, initial Glasswing partners had collectively discovered more than 10,000 high- or critical-severity security vulnerabilities using Claude Mythos Preview. Anthropic also released an open-source vulnerability discovery framework connected to Glasswing that, by the announcement date, had scanned more than 1,000 open-source projects and generated 23,019 potential findings, of which 6,202 were rated high or critical severity. Of the subset independently reviewed, 90.8% were validated as genuine vulnerabilities.

Claude Mythos Preview — which recorded 93.9% on the SWE-bench Verified benchmark at the time of the April 7 launch, approximately double the prior state of the art from 18 months earlier — remains available only through Project Glasswing. It is not accessible via the Anthropic API or any commercial product tier. Claude Security, Anthropic's public-facing vulnerability scanning product announced alongside the June 2 expansion, uses Claude Opus 4.8 rather than Mythos Preview.

## Why It Matters

The June 2 expansion is the largest documented instance of a frontier AI model being deployed at institutional scale while simultaneously withheld from general public access. The logic — Mythos Preview is sufficiently capable to find vulnerabilities that public access might allow adversaries to exploit for offense, but sufficiently controlled within Glasswing to provide net defensive benefit — reflects a capability management framework that prior AI safety thinking had theorized but that had not been implemented at this scale or with this explicitness.

The shift from technology-company partners to critical infrastructure operators changes the potential consequences of the program in both directions. The upside — if initial vulnerability discovery rates hold — is a systematic reduction of exploitable attack surface in systems underpinning power grids, water treatment, hospital networks, and communications infrastructure. The downside risk, which Anthropic has not publicly addressed in detail, is that a model of Mythos's capability, deployed inside organizations with less security maturity than Amazon or Google, operating in sectors where physical consequences of cyberattacks are severe, introduces new attack vectors if Glasswing access controls are breached or misused.

Anthropic has not disclosed publicly the governance mechanisms that constrain Glasswing partners' use of Mythos: whether there are audit requirements, usage logging, contractual restrictions on model output retention, or enforcement mechanisms for misuse. The 10,000-plus vulnerability figure, if accurate, represents a contribution to global cybersecurity that would be significant by any prior standard of automated vulnerability detection. Whether those vulnerabilities were patched — rather than merely identified — and at what rate, has not been reported. The program's design, in which Anthropic provides model access and partners conduct their own remediation, does not include any public verification mechanism for patch deployment outcomes.
