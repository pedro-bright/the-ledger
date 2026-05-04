---
id: dod-classified-network-ai-agreements
title: "Department of War Signs Classified Network AI Agreements with Eight Companies, Excluding Anthropic"
date: 2026-05-01
category: policy
significance: notable
confidence: high
sources:
  - url: https://www.war.gov/News/Releases/Release/Article/4475177/classified-networks-ai-agreements/
    title: "Classified Networks AI Agreements"
    type: official
    publisher: U.S. Department of War
    date: 2026-05-01
    accessed: 2026-05-04
    archive_url: https://web.archive.org/web/*/https://www.war.gov/News/Releases/Release/Article/4475177/classified-networks-ai-agreements/
  - url: https://www.washingtonpost.com/technology/2026/05/01/pentagon-ai-deals-microsoft-amazon-google-classified-military/
    title: "Pentagon strikes AI deals for classified military use"
    type: secondary_reporting
    publisher: The Washington Post
    date: 2026-05-01
    accessed: 2026-05-04
  - url: https://techcrunch.com/2026/05/01/pentagon-inks-deals-with-nvidia-microsoft-and-aws-to-deploy-ai-on-classified-networks/
    title: "Pentagon inks deals with Nvidia, Microsoft, and AWS to deploy AI on classified networks"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-05-01
    accessed: 2026-05-04
actors:
  - id: us-dod
    role: subject
  - id: anthropic
    role: counterparty
  - id: openai
    role: subject
  - id: google
    role: subject
  - id: microsoft
    role: subject
  - id: nvidia
    role: subject
  - id: amazon
    role: subject
  - id: spacex
    role: subject
  - id: oracle
    role: subject
  - id: reflection
    role: subject
regions: [US]
tags: [military-ai, classified-networks, dual-use-ai, defense-contracts, ai-governance, anthropic-exclusion]
threads: [ai-military-ethics]
related: [anthropic-dod-debate-2026, nsa-mythos-access-dod-blacklist]
state: published
revision:
  created: 2026-05-04
  last_reviewed: 2026-05-04
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On May 1, 2026, the U.S. Department of War announced formal agreements with eight technology companies to deploy their AI systems on classified Impact Level 6 and IL7 networks through GenAI.mil, the Pentagon's centralized AI platform. The companies — Amazon Web Services, Google, Microsoft, NVIDIA, OpenAI, Reflection, and SpaceX, with Oracle added hours later — will make AI tools available to DoD personnel for lawful operational use. Anthropic was absent from the agreements, a direct consequence of negotiations that collapsed after the company refused to remove contractual guardrails prohibiting use of Claude for autonomous weapons development and domestic mass surveillance.

## What Happened

The Department of War's May 1 press release announced that seven frontier AI companies had entered classified-network agreements: Amazon Web Services, Google, Microsoft, NVIDIA, OpenAI, Reflection, and SpaceX. Oracle was added as an eighth company in a separate announcement later the same day. The agreements cover deployment of AI capabilities within Impact Level 6 and Impact Level 7 network environments — the DoD's strictest cloud security classifications, governing data ranging from controlled unclassified information through top-secret and compartmented national security material. All covered AI capabilities are to be made available through GenAI.mil, a centralized Department of War platform designed to standardize AI tool access across defense personnel.

The Department framed the agreement structure explicitly as an anti-lock-in measure. The official press release stated that the goal was to build "an architecture that prevents AI vendor lock and ensures long-term flexibility for the Joint Force." Undersecretary of Defense for Research and Engineering Emil Michael described the initiative as equipping "the warfighter with a suite of AI tools to maintain an unfair advantage and achieve absolute decision superiority." No deployment timelines, contract values, or specific model designations were disclosed in the announcement.

Anthropic was not among the eight companies. The exclusion was the institutional endpoint of a dispute that began earlier in 2026, when the DoD formally designated Anthropic a "supply chain risk" after contract negotiations failed. The breakdown centered on acceptable-use restrictions Anthropic required before licensing Claude for classified defense work: specifically, contractual prohibitions on using the model to develop fully autonomous weapons systems and to conduct domestic mass surveillance. The DoD declined to accept those restrictions, and the Pentagon maintained its supply chain blacklist through the date of the May 1 announcement. The Washington Post reported that Anthropic's Claude was already in operational use on classified networks via Palantir's Maven toolkit — an arrangement the formal exclusion did not terminate.

The May 1 agreements represent a further progression from the sequence documented in April. On April 16, Bloomberg reported that the White House was negotiating to give civilian agencies access to Anthropic's Claude Mythos Preview. On April 17, Anthropic CEO Dario Amodei met at the White House with Chief of Staff Susie Wiles and Treasury Secretary Scott Bessent in what multiple outlets described as efforts to resolve the Pentagon standoff. On April 19, Axios reported that the National Security Agency — a DoD component — had access to Mythos Preview through Project Glasswing, even while the Pentagon's supply chain blacklist remained in place. The May 1 agreements closed the Pentagon's formal position: it moved ahead with seven of Anthropic's direct commercial competitors, establishing the classified AI baseline without the company.

## Why It Matters

The May 1 agreements constitute the first publicly documented formal framework for deploying commercial frontier AI on classified US military networks at IL6 and IL7 security levels. The published list of eight companies — and the documented absence of one — establishes a baseline against which future revisions to the Pentagon's AI access structure will be measured. The explicit anti-lock-in framing, unusual for a government procurement announcement, suggests the Department anticipated being pressed on why it was consolidating with a specific vendor set rather than expanding further.

The Anthropic exclusion is the substantively consequential data point. The company accepted verifiable commercial costs — exclusion from a classified government market populated by seven of its major competitors — rather than remove safety guardrails it had publicly committed to maintaining. The DoD's response was not to negotiate further but to sign comparable agreements with those competitors in a single publicly disclosed action. The sequence creates a documented precedent: a major AI company maintained a constraint on how its models could be used by a sovereign government, and the government's institutional response was to source those capabilities elsewhere and announce the arrangement publicly.

What remains open: whether the Anthropic-DoD standoff will be resolved through future negotiations, given the April White House discussions and the ongoing operational presence of Claude through Palantir's Maven; whether Anthropic's exclusion from IL6/IL7 formal agreements has practical consequence if its models remain accessible through third-party tools; whether the eight companies' agreements will be made available in redacted form permitting scrutiny of their own acceptable-use terms; and whether the DoD's stated goal of preventing vendor lock-in will hold as operational deployment deepens dependence on specific model providers.
