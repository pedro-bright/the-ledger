---
id: apple-wwdc-2026-siri-ai-google
title: "Apple Announces Rebuilt Siri AI and Google Gemini Partnership at WWDC 2026"
date: 2026-06-08
category: industry
significance: notable
confidence: high
sources:
  - url: https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/
    title: "Apple Unveils Next Generation of Apple Intelligence, Siri AI, and More"
    type: primary_document
    publisher: Apple
    date: 2026-06-08
    accessed: 2026-06-11
    archive_url: https://web.archive.org/web/*/https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/
  - url: https://www.bloomberg.com/opinion/articles/2026-06-09/apple-siri-ai-reboot-makes-it-even-more-dependent-on-google-gemini
    title: "Apple Siri AI Reboot Makes It Even More Dependent on Google Gemini"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-06-09
    accessed: 2026-06-11
  - url: https://techcrunch.com/2026/06/09/wwdc-2026-everything-announced-on-siri-ai-os-27-apple-intelligence-and-more/
    title: "WWDC 2026: Everything announced on Siri AI, iOS 27, Apple Intelligence, and more"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-06-09
    accessed: 2026-06-11
actors:
  - id: apple
    role: subject
  - id: google
    role: counterparty
regions: [US]
tags: [siri, apple-intelligence, foundation-models, google-gemini, wwdc, ai-partnerships, on-device-ai]
threads: []
related: []
state: published
revision:
  created: 2026-06-11
  last_reviewed: 2026-06-11
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

At WWDC 2026 on June 8, Apple unveiled Siri AI — a completely rebuilt version of its digital assistant — alongside a restructured Apple Foundation Models (AFM) platform that introduces AFM Cloud Pro, a new cloud tier built on Google's cloud infrastructure. Apple simultaneously confirmed a multi-year licensing arrangement with Google, reported by multiple outlets at approximately $1 billion per year, covering Gemini technology licensing and cloud infrastructure required to run the most capable tier of Apple Intelligence at scale.

## What Happened

Apple's Worldwide Developers Conference opened on June 8 in Cupertino. The AI overhaul was the headline announcement: a rebuilt Siri, branded Siri AI, and a new version of Apple Intelligence built on an expanded Apple Foundation Models platform.

The new Siri AI can read and act on on-screen content, search across personal apps using contextual understanding, execute multi-step commands, and maintain persistent conversation history synced via iCloud across devices. A dedicated standalone Siri app replaces the prior integration. Apple described the assistant as able to attach images and documents to requests and to surface information from Messages, Mail, and Calendar. Features ship as part of iOS 27, macOS 27, visionOS 27, watchOS 27, and tvOS 27, available in developer beta starting June 8 with a public release planned for fall 2026.

The Apple Foundation Models platform was restructured into three tiers. AFM Core and AFM Core Advanced run entirely on-device. The new AFM Cloud Pro tier handles the most demanding and agentic tasks and, per Bloomberg and multiple other reports, runs on Google's cloud infrastructure using NVIDIA GPUs. Apple said the models powering AFM Cloud Pro were built using Google Gemini technology through distillation and training and characterized the resulting models as "pure Apple technology" in which end users never interact with Google code or Gemini services. Bloomberg's post-announcement reporting characterized the arrangement differently, describing it as making Apple increasingly dependent on Google's AI infrastructure. The technical distinction — whether Apple's models are genuinely independent of Gemini at inference time or whether Google infrastructure is serving requests — was not resolved in Apple's announcement materials.

Apple SVP of Software Engineering Craig Federighi and members of the Apple Intelligence team presented the AFM architecture on stage. The commercial terms of the Google arrangement were not disclosed by Apple; the approximately $1 billion per year figure was reported across multiple outlets citing people familiar with the deal. WWDC 2026 was Tim Cook's final Worldwide Developers Conference as CEO; Cook announced in April 2026 that John Ternus would succeed him as CEO on September 1.

## Why It Matters

Apple's decision to build its highest-capability AI tier on Google's cloud infrastructure is a structural departure from the company's vertical integration strategy in computing. Since the first Neural Engine in 2017, Apple had positioned on-device processing as a privacy and performance differentiator. The AFM Cloud Pro tier, as reported, represents the first case in which Apple has shipped a consumer-facing AI product tier that requires Google's data center infrastructure to run — regardless of how Apple characterizes the model independence. Whether this reflects a temporary gap while Apple scales its own AI infrastructure or a longer-term dependency cannot be determined from the WWDC announcement alone.

The commercial scale of the arrangement is notable in the industry context. A $1 billion per year licensing deal with Google places this among the largest commercial AI platform agreements disclosed to date, comparable in annual value to Microsoft's per-year OpenAI tranches. The deal runs alongside Apple's existing Google Search distribution arrangement, currently the subject of DOJ antitrust enforcement following the August 2024 monopoly finding. Two large commercial agreements between Apple and Google in two distinct product categories — search and AI infrastructure — create a regulatory and competitive dynamic that analysts and regulators had flagged as a concern in the Bloomberg preview coverage from June 5.

The WWDC 2026 announcement fits a broader pattern across the consumer electronics industry in which major device manufacturers are negotiating AI platform supply arrangements rather than developing frontier model capabilities internally. Apple's disclosure — that AFM Cloud Pro runs on a partner's infrastructure — is the most transparent version of this pattern from a Tier 1 OEM to date. It sets a reference point for how similar arrangements at Samsung, Microsoft Surface, and others may eventually be characterized publicly.
