---
id: nyt-openai-mtd-ruling-2025
title: "SDNY Denies OpenAI Motion to Dismiss Core Copyright Claims"
date: 2025-04-04
category: policy
significance: major
confidence: high
actors:
  - id: openai
    role: defendant
  - id: microsoft
    role: defendant
  - id: new-york-times
    role: plaintiff
tags: [copyright, litigation, motion-to-dismiss, fair-use, dmca]
threads: [ai-copyright-wars]
related: [openai-copyright-mdl-3143-consolidation]
sources:
  - url: https://www.nysd.uscourts.gov/sites/default/files/2025-04/yf%2023cv11195%20OpenAI%20MTD%20opinion%20april%204%202025.pdf
    title: "Opinion and Order — NYT v. OpenAI, 23-cv-11195 (MTD)"
    type: primary_document
    publisher: US District Court, SDNY
    date: 2025-04-04
  - url: https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2023cv11195/612697/514/
    title: "Document 514 — NYT v. OpenAI, Justia"
    type: primary_document
    publisher: Justia
  - url: https://ipwatchdog.com/2025/04/07/new-york-judge-keeps-key-aspects-suit-openai-alive/
    title: "New York Judge Keeps Key Aspects of Suit Against OpenAI Alive"
    type: expert_interpretation
    publisher: IPWatchdog
    date: 2025-04-07
---

## Summary

Judge Sidney H. Stein denied OpenAI and Microsoft's motion to dismiss the New York Times' core copyright infringement and contributory infringement claims, finding the Times had sufficiently pleaded its case to survive the pleading stage. The court also allowed trademark dilution claims to proceed, while dismissing most DMCA Section 1202 claims related to copyright management information removal.

## What Happened

OpenAI and Microsoft had argued that the Times' complaint failed as a matter of law — that training large language models on copyrighted news articles was categorically fair use, that any similarity between ChatGPT outputs and Times articles was too attenuated to support infringement, and that the complaint's DMCA claims were deficiently pleaded. Judge Stein rejected the fair use defense at the motion to dismiss stage, holding that whether training on Times articles constituted fair use was a fact-intensive inquiry that could not be resolved on the pleadings alone.

The court sustained the direct copyright infringement claim, accepting the Times' allegation that OpenAI's training process reproduced protected expression from Times articles as part of model training. Contributory infringement claims against Microsoft survived on the same basis. The court also allowed the trademark dilution claim to proceed, crediting the Times' allegation that ChatGPT outputs sometimes falsely attributed fabricated content to the Times, damaging its mark.

The partial victory for the defendants came on the DMCA claims: Judge Stein dismissed most claims under Section 1202(b)(1), which prohibits the intentional removal of copyright management information, finding insufficient pleading of intent. All Section 1202(b)(3) claims — covering distribution of content with CMI removed — were dismissed entirely.

## Why It Matters

The MTD ruling is the first judicial assessment of the legal sufficiency of training-data copyright claims in the context of large language models. By allowing the core claims to survive, Judge Stein gave the copyright litigation industry a roadmap: detailed factual allegations about specific reproductions, specific outputs, and specific harms can get a case past the pleading stage even against fair use defenses. The ruling also signals that courts will not short-circuit AI copyright disputes at the threshold, meaning the industry will face the full costs of discovery and potentially trial before any definitive ruling on fair use.
