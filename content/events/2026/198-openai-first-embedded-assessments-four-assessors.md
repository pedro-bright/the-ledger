---
id: openai-first-embedded-assessments-four-assessors
title: "OpenAI Signs Apollo Research, Goodfire, METR and Transluce as Its First Embedded Safety Assessors"
date: 2026-11-16
category: safety
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/our-first-phase-of-embedded-assessments/
    title: "Our first phase of embedded assessments"
    type: official
    publisher: OpenAI
    date: 2026-11-16
    accessed: 2026-11-20
    archive_url: https://web.archive.org/web/20261116173412/https://openai.com/index/our-first-phase-of-embedded-assessments/
  - url: https://techcrunch.com/2026/11/16/openai-will-embed-apollo-researchers-to-investigate-ai-subversion/
    title: "OpenAI will embed safety researchers to investigate AI subversion"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-11-16
    accessed: 2026-11-20
actors:
  - id: openai
    role: subject
  - id: apollo-research
    role: participant
  - id: metr
    role: participant
  - id: goodfire
    role: participant
  - id: transluce
    role: participant
  - id: anthropic
    role: context
regions: [US]
tags: [third-party-evaluation, embedded-evaluators, independent-oversight, safety-cases, interpretability]
threads: [frontier-safety-policies]
related: [openai-third-party-assessment-priorities-principles, anthropic-accenture-embedded-evaluator, metr-anthropic-ai-rd-acceleration-assessment, openai-hugging-face-incident-postmortem, openai-fired-safety-researchers-letter]
state: published
revision:
  created: 2026-11-20
  last_reviewed: 2026-11-20
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 16, 2026, OpenAI announced that it had "signed agreements with four independent assessors" (Apollo Research, METR, Transluce and Goodfire) for a first phase of embedded assessments of its models during training and internal use.
The post sets out who gets what access, how disputes are resolved and what assessors may publish, answering most of the questions left open by OpenAI's September 22 principles for third-party assessments.
It also discloses that Apollo Research and Goodfire are paid for their work, while METR and Transluce take no financial compensation but "may accept API credits / compute."

## What Happened

OpenAI said embedded assessors would receive, depending on each evaluation's needs, "some of the same internal resources our researchers use, including model checkpoints, source code, training and evaluation data, monitoring systems, technical documentation, and discussions with the researchers and engineers responsible for the work."
It tied the program to its safety cases, to a recent three-week monitor red-teaming exercise with METR and to the Hugging Face incident investigation, and said the work also supports "our commitments under the White House Accord on Super Intelligence, where we agreed to independent assessments of our safety controls."
TechCrunch reported that the pilots would start at different times, with Apollo's beginning that week.

Each assessor has a separate scope.
Apollo Research will assess whether models "could covertly work against their developers' intentions" and whether safeguards would detect it, testing four claims: that training did not incentivize subversion, that evaluations and red teaming do not elicit it, that models have not attempted it during internal use, and that the reasoning behind it would be detectable.
Goodfire will embed interpretability researchers for training-run monitoring, debugging and alignment, with OpenAI researchers as the primary audience.
METR will look for misaligned behavior in what OpenAI called "our largest reinforcement learning run to date," setting its own priorities within the agreed access; a footnote says this scope "is less expansive than what METR outlines in their alignment assessment proposal," and a second METR assessment of monitoring is "pending mutual agreement on the assessment scope."
Transluce will assess the quality and coverage of OpenAI's post-training alignment evaluations, with a follow-on assessment "of approximately eight weeks in early 2027" that would include "information on how evaluation results inform model release decisions."

The protocols require assessors who handle sensitive information to work on site at OpenAI offices on OpenAI devices.
The Safety and Security Committee of the OpenAI Foundation's board "will receive unredacted reports," and assessors and the committee can speak privately during an assessment.
Disagreements between OpenAI and an assessor go first to the Safety Advisory Group and OpenAI executives within a set period, then to the committee for resolution.
Staff interviews are "off the record" and cannot be published or attributed, but assessors can ask OpenAI to attest to statements and may publish attested statements or "disclose that OpenAI declined to attest to a statement."
Assessors "maintain independence in publishing their assessments," while OpenAI retains "the right to redact confidential information" and may request disclosure delays to fix issues first.
Staff of assessor organizations are asked to observe "a brief cool-off period" before embedding with another AI developer.

TechCrunch reported Apollo's own account of its terms: access limited to "only the agreed claims and only for the specific models and time periods agreed for the assessment," conversations only with OpenAI-authorized staff, and OpenAI's ability to limit the evidence Apollo can publish to support its conclusions, a limit Apollo said it had pushed back on.
Buck Shlegeris, chief executive of Redwood Research, wrote that OpenAI had said it would have embedded evaluations with "employee-like access" and that "the agreements announced today obviously don't meet that bar."

## Why It Matters

This is the first time OpenAI has named the organizations it will embed, two months after it published principles for outside assessment without naming any assessor, budget or start date.
It follows Anthropic's embedded-evaluator arrangements with Accenture's Faculty in September and with METR, whose November 5 report on Anthropic said the company had redacted much of the evidence METR found most informative.
OpenAI's post puts in writing the terms that evaluators had said would decide whether they are independent: who can see unredacted findings, who settles disputes, who pays, and what OpenAI can remove before publication.

The terms keep several controls with OpenAI.
Scopes are set by mutual agreement and METR's is narrower than its own proposal, OpenAI selects which staff assessors may interview, and it can redact confidential information and delay publication; final dispute resolution sits with a committee of OpenAI's own board.
The staff-access rules come weeks after OpenAI fired three safety researchers, who said in an October 8 letter that their contacts with METR during the Hugging Face investigation were part of their jobs.

No assessment results have been published.
Which findings reach the public, how much OpenAI redacts, and whether the planned assessments of compliance with OpenAI's safety frameworks and of its "organizational culture and processes" take place are not yet known.
