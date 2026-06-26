---
id: openai-patch-the-planet
title: "OpenAI Launches Patch the Planet, Deploys GPT-5.5-Cyber Against Open-Source Vulnerabilities"
date: 2026-06-22
category: policy
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/patch-the-planet/
    title: "Patch the Planet: a Daybreak initiative to support open source maintainers"
    type: official
    publisher: OpenAI
    date: 2026-06-22
    accessed: 2026-06-26
    archive_url: https://web.archive.org/web/*/https://openai.com/index/patch-the-planet/
  - url: https://openai.com/index/daybreak-securing-the-world/
    title: "Daybreak: Tools for securing every organization in the world"
    type: official
    publisher: OpenAI
    date: 2026-06-22
    accessed: 2026-06-26
    archive_url: https://web.archive.org/web/*/https://openai.com/index/daybreak-securing-the-world/
  - url: https://www.axios.com/2026/06/22/openai-rolls-out-more-capable-version-of-cyber-model
    title: "OpenAI gives GPT-5.5-Cyber more powerful cybersecurity capabilities"
    type: secondary_reporting
    publisher: Axios
    date: 2026-06-22
    accessed: 2026-06-26
  - url: https://techcrunch.com/2026/06/22/openai-launches-new-initiative-to-help-find-and-patch-open-source-bugs/
    title: "OpenAI launches new initiative to help find and patch open source bugs"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-06-22
    accessed: 2026-06-26
actors:
  - id: openai
    role: subject
  - id: trail-of-bits
    role: counterparty
regions: [US]
tags: [dual-use-ai, cybersecurity, open-source, vulnerability-research, defensive-ai, daybreak]
threads: []
related: [openai-trusted-access-cyber]
state: published
revision:
  created: 2026-06-26
  last_reviewed: 2026-06-26
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On June 22, 2026, OpenAI expanded its Daybreak cybersecurity program with three simultaneous actions: launching "Patch the Planet," a structured open-source vulnerability patching initiative with Trail of Bits; broadening GPT-5.5-Cyber access to vetted defenders; and introducing the Daybreak Cyber Partner Program for commercial security vendors. Trail of Bits engineers using GPT-5.5-Cyber had already identified and routed fixes across 19 open-source projects before the announcement, including a Firefox WebAssembly CVE patched two days before the Pwn2Own Berlin competition.

## What Happened

OpenAI announced "Patch the Planet" on June 22, 2026, as an operational expansion of the Daybreak cybersecurity initiative. The earlier phase of Daybreak had introduced the Trusted Access for Cyber (TAC) program on April 14, 2026, which made GPT-5.4-Cyber available to a restricted cohort of verified defenders. The June 22 announcement extended that framework to GPT-5.5-Cyber and introduced a named program for deploying it against open-source software.

The principal model change was a broader release of GPT-5.5-Cyber to defenders cleared to the highest TAC tier — defined as those "responsible for securing critical infrastructure." On CyberGym, an internal OpenAI benchmark for offensive and defensive security tasks, GPT-5.5-Cyber scored 85.6%, above GPT-5.5 at 81.8% and above Anthropic's Mythos 5 at 83.4%. OpenAI stated that the scarce resource in software security is no longer bug discovery but remediation, and that Patch the Planet was structured accordingly: a human security engineer reviews every AI-identified finding before it is routed to a project maintainer.

Trail of Bits deployed engineers full-time working alongside GPT-5.5-Cyber across 19 open-source projects. By the announcement date, the joint effort had identified 8 Linux kernel pointer-leak proof-of-concepts, 24 local privilege escalation exploits across more than 30 million lines of kernel code, and more than 10 exploitable vulnerabilities in Safari. A WebAssembly CVE — CVE-2026-8390 — was identified in Firefox, routed to Mozilla under coordinated disclosure, and patched two days before the Pwn2Own Berlin competition. Four of six dnsmasq CVEs flagged through the program were identified before the public disclosure cycle for those issues.

More than 30 open-source projects agreed to participate in Patch the Planet, with the launch cohort including cURL, the Go project, the Python project, Sigstore, and pyca/cryptography. A separate action announced the same day created the Daybreak Cyber Partner Program: an arrangement under which commercial security vendors can embed GPT-5.5 access, subject to the existing TAC controls, in their own products and services to defenders.

The name "Patch the Planet" is an explicit reference to "Hack the Planet," the phrase associated with the 1995 film Hackers.

## Why It Matters

The Patch the Planet results represent documented AI-assisted vulnerability discovery in production open-source codebases — not synthetic benchmarks — with patches merged before public exploit. The Firefox CVE-2026-8390 timeline is the clearest illustration: a vulnerability identified through AI-assisted research, disclosed to Mozilla through a human-reviewed coordination process, and fixed before an adversarial exploitation window at a major competition. The dnsmasq CVEs show the same pattern at a lower profile. Whether this model scales to the volume of open-source software that operates without dedicated security resources is an unresolved question, but the early results establish a baseline.

The Daybreak Cyber Partner Program introduces a commercial distribution tier for GPT-5.5-Cyber capabilities. Previously, Daybreak access was a direct relationship between OpenAI and verified defenders. The partner program allows security vendors to intermediate that relationship, extending GPT-5.5-Cyber to end customers who may never interact with OpenAI directly. The accountability structure downstream — how TAC verification obligations apply when a vendor resells the capability — is not described in public disclosures and remains an open question for the governance model.

OpenAI's Daybreak program and Anthropic's Project Glasswing (announced April 7, 2026) represent converging approaches to dual-use frontier AI in cybersecurity: both restrict access through tiered verification and institutional accountability rather than blanket restriction. Whether verification processes are robust against misrepresentation, and how either company would respond to a breach of program terms, have not been tested publicly.
