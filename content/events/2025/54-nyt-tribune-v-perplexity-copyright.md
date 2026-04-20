---
id: nyt-tribune-v-perplexity-copyright
title: "NYT and Chicago Tribune Sue Perplexity for Copyright and Trademark Infringement"
date: 2025-12-05
category: industry
significance: major
confidence: high
actors:
  - id: new-york-times
    role: plaintiff
  - id: chicago-tribune
    role: plaintiff
  - id: perplexity
    role: defendant
tags: [copyright, litigation, rag, news-publishers, trademark, robots-txt]
threads: [ai-copyright-wars]
related: [nyt-openai-mtd-ruling-2025]
sources:
  - url: https://www.courtlistener.com/docket/71997720/the-new-york-times-company-v-perplexity-ai-inc/
    title: "The New York Times Company v. Perplexity AI, Inc. — CourtListener Docket 1:25-cv-10106"
    type: primary_document
    publisher: CourtListener
  - url: https://dockets.justia.com/docket/new-york/nysdce/1:2025cv10094/654176
    title: "Chicago Tribune v. Perplexity AI, Inc. — Justia Docket 1:25-cv-10094"
    type: primary_document
    publisher: Justia
  - url: https://techcrunch.com/2025/12/05/the-new-york-times-is-suing-perplexity-for-copyright-infringement/
    title: "The New York Times Is Suing Perplexity for Copyright Infringement"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2025-12-05
  - url: https://www.axios.com/2025/12/05/nyt-sues-perplexity-for-copyright-infringement
    title: "NYT Sues Perplexity for Copyright Infringement"
    type: secondary_reporting
    publisher: Axios
    date: 2025-12-05
---

## Summary

The New York Times and Chicago Tribune filed parallel copyright and trademark infringement lawsuits against Perplexity AI in the Southern District of New York, alleging that Perplexity's AI search engine systematically circumvented robots.txt restrictions and paywalls to harvest and reproduce publisher content. The cases represent the first major copyright litigation targeting retrieval-augmented generation systems rather than model training.

## What Happened

The NYT filed case 1:25-cv-10106 and the Tribune filed 1:25-cv-10094, both in SDNY, on the same day. The complaints targeted two specific Perplexity mechanisms: PerplexityBot, the web crawler used to index content for retrieval, and Comet, Perplexity's integrated browser feature. Both were alleged to circumvent robots.txt directives and paywall access controls to access content that publishers had explicitly restricted from automated scraping.

Unlike the training-data cases against OpenAI and other developers, the Perplexity complaints focused on what the system does at inference time: when a user asks a question, Perplexity retrieves, reproduces, and summarizes publisher articles in a format that delivers the journalistic work product without the user ever visiting the publisher's site. The complaints alleged this constituted direct copying of protected expression in each summarized article. The trademark claims arose from a different mechanism — Perplexity's answers sometimes attributed fabricated or inaccurate statements to the Times and Tribune by name, the complaints alleged, constituting trademark infringement and false designation of origin.

## Why It Matters

The Perplexity suits introduced RAG-architecture systems as a distinct legal target in AI copyright litigation, separate from model training. The legal theory — that retrieval and summarization at inference time infringes each summarized article independently — would, if upheld, create a fundamentally different liability model than training-data disputes: potentially thousands of individual infringements per day rather than a single set of training acts. The robots.txt and paywall circumvention allegations also implicate the Computer Fraud and Abuse Act and terms-of-service law alongside copyright, broadening the legal surface area. The outcome of these cases will determine whether news publishers can use copyright law to control how AI answer engines use their content in real time.
