---
id: nsa-mythos-access-dod-blacklist
title: "NSA Uses Anthropic Mythos Preview as Pentagon Maintains Supply Chain Blacklist"
date: 2026-04-19
category: policy
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/glasswing
    title: "Project Glasswing: Securing Critical Software for the AI Era"
    type: official
    publisher: Anthropic
    date: 2026-04-07
    accessed: 2026-04-22
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/glasswing
  - url: https://www.axios.com/2026/04/19/nsa-anthropic-mythos-pentagon
    title: "Scoop: NSA using Anthropic's Mythos despite Defense Department blacklist"
    type: secondary_reporting
    publisher: Axios
    date: 2026-04-19
    accessed: 2026-04-22
  - url: https://www.bloomberg.com/news/articles/2026-04-16/white-house-moves-to-give-us-agencies-anthropic-mythos-access
    title: "White House Moves to Give US Agencies Anthropic Mythos Access"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-04-16
    accessed: 2026-04-22
actors:
  - id: us-nsa
    role: subject
  - id: anthropic
    role: subject
  - id: us-dod
    role: counterparty
  - id: white-house
    role: associated-government
regions: [US]
tags: [mythos, nsa, pentagon, supply-chain-risk, military-ai, cybersecurity, dual-use-ai, intra-government]
threads: [ai-military-ethics]
related: [anthropic-dod-debate-2026, openai-trusted-access-cyber]
state: published
revision:
  created: 2026-04-22
  last_reviewed: 2026-04-22
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On April 19, 2026, Axios reported that the National Security Agency was using Anthropic's Claude Mythos Preview — the company's most capable and restricted model — as one of approximately 40 organizations with access through Project Glasswing, while the Department of Defense simultaneously maintained an active "supply chain risk" designation against Anthropic in federal court. The NSA operates under DoD authority. The disclosure documented an intra-government policy split: the Pentagon's litigation posture and the NSA's operational deployment were in direct contradiction.

## What Happened

In early March 2026, the Department of Defense designated Anthropic a "supply chain risk" following the breakdown of contract negotiations. The DoD had demanded that Anthropic make its Claude models available for "all lawful purposes," including mass domestic surveillance and the development of fully autonomous weapons systems. Anthropic declined on acceptable use policy grounds, and the Pentagon barred its contractors from using Anthropic's software in defense workflows.

On April 7, 2026, Anthropic announced Claude Mythos Preview alongside Project Glasswing, a defensive cybersecurity initiative. Glasswing granted access to Mythos Preview to approximately 40 organizations — primarily technology companies and critical infrastructure operators — for scanning their own systems for exploitable vulnerabilities. Anthropic committed up to $100 million in usage credits. The publicly listed Glasswing partners were private-sector: Amazon Web Services, Apple, Cisco, CrowdStrike, Google, JPMorganChase, Microsoft, NVIDIA, and Palo Alto Networks, among others. Government agency participants were not disclosed in the launch announcement.

On April 16, Bloomberg reported that the White House was separately negotiating to give civilian agencies — including the Departments of Energy and Treasury, which are responsible for safeguarding critical infrastructure sectors — access to Mythos, outside the Project Glasswing framework.

On April 17, Anthropic CEO Dario Amodei met at the White House with Chief of Staff Susie Wiles and Treasury Secretary Scott Bessent, in discussions described by multiple outlets as "peace talks" aimed at resolving the standoff with the Pentagon. No resolution was announced.

On April 19, Axios reported that the NSA had access to Mythos Preview through Project Glasswing and was using the model. The DoD's blacklisting litigation was ongoing at the time of the report. The specific uses to which the NSA put Mythos were not disclosed; other Glasswing participants were using the model predominantly to scan their own environments for exploitable vulnerabilities.

## Why It Matters

The NSA's operational use of Mythos while the DoD maintained its supply chain blacklist produced the clearest documented instance of intra-government AI policy contradiction at the agency level in 2026. The DoD and the NSA are not independent bodies — the NSA is a DoD component — yet their effective postures toward Anthropic were inverted: one prosecuting the company in court on national security grounds, the other deploying its most sensitive model for national security work.

The episode established a practical boundary on the DoD blacklist's operational reach. The restriction limited contractors doing business with the Pentagon in defense contexts but did not prevent an intelligence agency from accessing Mythos through Anthropic's civilian-facing partnership mechanism. Whether this boundary reflected deliberate policy design or an unintended gap was not clarified by either the DoD or the NSA.

More broadly, the sequence documented how AI governance mechanisms can fracture within a single government. The Pentagon's "supply chain risk" designation was designed as a procurement tool — a mechanism for protecting defense contracts from vendors the DoD deemed unreliable. It was not designed as a blanket prohibition on all agency interaction with a company. Anthropic's Project Glasswing, structured as a civilian defensive-security initiative, provided a channel that the procurement restriction did not close. The Glasswing architecture — a private-sector consortium with selective government access — effectively allowed Anthropic to maintain critical government relationships while the DoD dispute remained unresolved.

The full resolution of the Pentagon's blacklist and the terms of any eventual agreement between Anthropic and the Department of Defense were not known at the time of the NSA disclosure.
