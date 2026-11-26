---
id: openai-perplexity-common-limits-proposal
title: "OpenAI's Chief Scientist Publishes Internal Pretraining Loss Figures and Proposes Industry Limits Based on Perplexity"
date: 2026-11-22
category: safety
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/perplexity-and-intelligence/
    title: "Perplexity and Intelligence"
    type: primary_document
    publisher: OpenAI
    date: 2026-11-22
    accessed: 2026-11-26
    archive_url: https://web.archive.org/web/20261125151849/https://openai.com/index/perplexity-and-intelligence/
  - url: https://www.theinformation.com/briefings/openai-calls-leading-ai-firms-agree-ai-development-limits
    title: "OpenAI Calls For Leading AI Firms to Agree on AI Development Limits"
    type: secondary_reporting
    publisher: The Information
    date: 2026-11-22
    accessed: 2026-11-26
  - url: https://techcrunch.com/2026/11/22/openais-chief-scientist-has-thoughts-on-how-to-limit-ai-development/
    title: "OpenAI's chief scientist has thoughts on how to limit AI development"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-11-22
    accessed: 2026-11-26
actors:
  - id: jakub-pachocki
    role: author
  - id: openai
    role: subject
  - id: sam-altman
    role: commentator
regions: [US]
tags: [ai-safety, pretraining, perplexity, capability-thresholds, ai-pause, transparency, industry-standards]
threads: [frontier-safety-policies]
related: [pachocki-alien-mind-voluntary-slowdown, anthropic-accenture-embedded-evaluator, openai-third-party-assessment-priorities-principles, anthropic-coordinated-pause-call]
state: published
revision:
  created: 2026-11-26
  last_reviewed: 2026-11-26
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 22, 2026, OpenAI published "Perplexity and Intelligence," an essay by chief scientist Jakub Pachocki that discloses the company's internal pretraining loss figures for its models since GPT-3.5 and proposes that frontier developers adopt "common limits, based on perplexity and other measurements," which they would commit not to cross until AI monitoring reaches "a certain concrete milestone."
The post gives no limit value, no date and no signatories.
OpenAI CEO Sam Altman called it "the most important thing OpenAI has published in awhile."

## What Happened

The essay argues that the capabilities of modern models come mostly from pretraining, which Pachocki describes as training a compressor on a large corpus, and that progress on this step is best tracked by perplexity, or equivalently cross-entropy loss, on held-out data.
He writes that publishing the figures "gives competitors a clearer picture of where we stand, but that concern is outweighed by the urgency of establishing shared safety measures across the industry."

The disclosed figures are log-perplexity on held-out datasets drawn from OpenAI's internal codebase, which a footnote says have been the company's primary evaluation sets since GPT-3.5.
GPT-3.5 is put at "~0.99" and GPT-4 at "~0.91."
The essay says that "as we have reached losses below 0.8, we have seen the emergence of transformative capabilities in fields like cybersecurity and mathematics," and that once OpenAI "upgraded to a model of log-perplexity ~0.76, it started producing groundbreaking results" on open mathematical problems; that model is not named.
A footnote attributes "a steep acceleration in 2026" on OpenAI's loss curve "mostly to the outcomes of long term research and compute investments, and only in a smaller part to automation."

Looking ahead, Pachocki writes that "we should expect further transformative capabilities as we enter the ~0.68-0.7 log-perplexity window," along with "further degradation in currently dominant forms of alignment auditing," and that "as soon as 2027 we could conceivably see a similar avalanche of fundamental pretraining advancements" from AI contributions to pretraining research.
He proposes shared norms for evaluating such models and red-teaming their safety cases "by the time they are first used," and "an industry standard that specifies a first limit on development, measured by some key metric we can track across labs, and what concretely we'd need to achieve before going beyond it," giving "the development of a successor to CoT monitors" as an example milestone.
The essay lists four problems with perplexity as a shared metric: different labs use different evaluation data, it does not correspond to a specific task, it does not capture gains from methods such as chain-of-thought reasoning, and the lowest achievable loss is unknown.
The word "shared" in the essay links to Anthropic CEO Dario Amodei's September essay "We Must Pace the Frontier."

Altman wrote on X the same day that OpenAI is "providing a lot of transparency into our pretraining progress" and hopes the industry can agree to common limits.
The Information and TechCrunch reported the proposal that evening.

## Why It Matters

The post makes public a series of internal pretraining loss figures that OpenAI says it weighed withholding because they show competitors where it stands.
The essay names a candidate metric for the threshold that Pachocki's September essay "An Alien Mind" did not specify, and it ties crossing that threshold to a monitoring milestone, a link that essay also left open.
It also places OpenAI's current models below the 0.8 level that it associates with transformative cybersecurity and mathematics capabilities, and puts the next expected jump at 0.68 to 0.7.

The post remains a proposal by one company's chief scientist.
It sets no number for the first limit, does not say whether OpenAI would observe a limit if other labs did not, and names no other developer or government that has agreed.
The figures cannot be compared with other labs' models, because they are measured on OpenAI's internal code data, a limitation the essay states itself.
Whether the proposal leads to a joint standard, or how it relates to Anthropic's call to "pace the frontier," is not known from the documents.
