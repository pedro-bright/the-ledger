---
id: openai-mdl-output-infringement-ruling
title: "SDNY Denies Dismissal of AI-Output-Based Copyright Infringement Claims"
date: 2025-10-27
category: policy
significance: major
confidence: high
actors:
  - id: openai
    role: defendant
  - id: microsoft
    role: defendant
  - id: authors-guild
    role: plaintiff
tags: [copyright, litigation, ai-outputs, substantial-similarity, training-data]
threads: [ai-copyright-wars]
related: [openai-copyright-mdl-3143-consolidation, nyt-openai-mtd-ruling-2025]
sources:
  - url: https://www.courthousenews.com/wp-content/uploads/2025/10/open-ai-motion-to-dismiss-infringement-opinion.pdf
    title: "In re OpenAI Inc. Copyright Infringement Litigation — MTD Opinion (Output Claims)"
    type: primary_document
    publisher: Courthouse News Service
    date: 2025-10-27
  - url: https://www.loeb.com/en/insights/publications/2025/11/in-re-openai-inc-copyright-infringement-litigation
    title: "In re OpenAI Inc. Copyright Infringement Litigation"
    type: expert_interpretation
    publisher: Loeb & Loeb
    date: 2025-11-03
  - url: https://www.courtlistener.com/docket/69879510/in-re-openai-inc-copyright-infringement-litigation/
    title: "In re OpenAI Inc. Copyright Infringement Litigation — MDL Docket 1:25-md-03143"
    type: primary_document
    publisher: CourtListener
---

## Summary

Judge Sidney H. Stein denied OpenAI's motion to dismiss output-based copyright infringement claims within MDL 3143, accepting at the pleading stage that ChatGPT's summaries of George R.R. Martin novels were substantially similar to the protected expression in those works. The ruling extended the MDL's litigation scope from training-data ingestion to the downstream question of whether AI outputs can themselves infringe.

## What Happened

Within MDL 3143 (1:25-md-03143), the Authors Guild and other plaintiff authors had alleged not only that OpenAI's training process infringed their copyrights but that ChatGPT's outputs — specifically detailed plot summaries and character descriptions generated on demand — reproduced protected expression from their novels in a way that constituted direct infringement. OpenAI moved to dismiss these output-based claims, arguing that language model outputs are generated stochastically and cannot be substantially similar to any specific prior work as a matter of law.

Judge Stein rejected this argument at the pleading stage. Reviewing the specific ChatGPT outputs attached to the complaint alongside excerpts from the Martin novels, the court found that plaintiffs had plausibly alleged substantial similarity between the AI-generated summaries and the expressive elements of the underlying books. The court declined to rule as a matter of law that no output of a language model could ever be substantially similar to a training work, holding that the question required factual development through discovery and expert analysis.

On a separate discovery question, the court also denied Microsoft's request for limits on document production, signaling that the MDL would proceed with broad discovery into both companies' training and deployment practices.

## Why It Matters

The output-infringement ruling opens a second front in AI copyright litigation that the industry had hoped to close at the pleading stage. Even if AI companies ultimately prevail on training-data fair use arguments, they now face potential liability for what their models produce in deployment. The ruling creates pressure for developers to invest in output filtering and similarity detection, and substantially increases the settlement value of the pending MDL. It also sets the stage for what could be the first trial on output-based AI copyright infringement.
