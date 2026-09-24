---
id: anthropic-accenture-embedded-evaluator
title: "Anthropic Names Accenture's Faculty as Its First Embedded Evaluator, With Employee-Level Access and at Least $1 Billion From Each Company"
date: 2026-09-18
category: safety
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/news/accenture-embedded-evaluation
    title: "Partnering with Accenture on embedded evaluation"
    type: official
    publisher: Anthropic
    date: 2026-09-18
    accessed: 2026-09-24
    archive_url: https://web.archive.org/web/20260923180821/https://www.anthropic.com/news/accenture-embedded-evaluation
  - url: https://newsroom.accenture.com/news/2026/accenture-and-anthropic-partner-to-build-team-of-embedded-evaluators-at-anthropic
    title: "Accenture and Anthropic Partner to Build Team of Embedded Evaluators at Anthropic"
    type: official
    publisher: Accenture
    date: 2026-09-18
    accessed: 2026-09-24
    archive_url: https://web.archive.org/web/20260921084148/https://newsroom.accenture.com/news/2026/accenture-and-anthropic-partner-to-build-team-of-embedded-evaluators-at-anthropic
  - url: https://www.bloomberg.com/news/articles/2026-09-18/anthropic-to-embed-evaluators-from-accenture-to-test-ai-safety
    title: "Anthropic to Embed Evaluators From Accenture to Test AI Safety"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-09-18
    accessed: 2026-09-24
  - url: https://techcrunch.com/2026/09/18/anthropics-first-embedded-evaluator-is-accenture/
    title: "Anthropic's first embedded evaluator is … Accenture?"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-09-18
    accessed: 2026-09-24
    archive_url: https://web.archive.org/web/20260920064602/https://techcrunch.com/2026/09/18/anthropics-first-embedded-evaluator-is-accenture/
actors:
  - id: anthropic
    role: subject
  - id: accenture
    role: partner
  - id: faculty
    role: partner
  - id: metr
    role: related-party
  - id: dario-amodei
    role: context
regions: [US, UK]
tags: [third-party-evaluation, embedded-evaluators, red-teaming, alignment, independent-oversight, safety-funding]
threads: [frontier-safety-policies]
related: [anthropic-alignment-security-update-rl-pause, anthropic-cyber-evaluations-breach-three-organizations, openai-misalignment-reporting-framework-six-reports, coxon-anthropic-resignation-superintelligence-warning]
state: published
revision:
  created: 2026-09-24
  last_reviewed: 2026-09-24
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 18, 2026, Anthropic and Accenture announced that Faculty, the AI company Accenture acquired in January 2026, would place evaluators inside Anthropic to red-team models, run alignment assessments and test model safeguards, with access Anthropic described as "comparable to an employee's."
Each company said it expected to invest at least $1 billion in the work over five years, and Anthropic said it would fund Accenture's evaluation work directly.
Anthropic presented the partnership as the first step on the commitment in Dario Amodei's September 12 essay "We Must Pace the Frontier" to embed evaluators within the company, and acknowledged that no standards yet exist for what such evaluators may see or how they report.

## What Happened

Anthropic's announcement, titled "Partnering with Accenture on embedded evaluation," said the partnership "will be led by Faculty, Accenture's specialist AI business, and will include evaluating and red-teaming models, conducting alignment assessments, and testing model safeguards."
It contrasted the arrangement with existing pre-release testing: "Unlike today's external evaluators, embedded evaluators will work inside AI companies, with access comparable to an employee's. That access allows them to watch models take shape in training, follow the decisions that govern how those models are built and deployed, and speak directly to employees."
The post said embedded evaluators could assess how a company operates, verify that it keeps its safety commitments, identify blind spots, "report incidents and give the public a more informed account of benefits and risks."

Accenture's press release, issued the same day from New York and San Francisco, described a team that would "work alongside Anthropic's internal teams and safety partners" and said the two companies "each expect to invest at least $1 billion over five years in AI safety."
Accenture chair and CEO Julie Sweet called embedded evaluation "an emerging area."
Marc Warner, Accenture's chief technology officer and Faculty's chief executive, said Faculty "was founded on the belief that AI should be safe by design, not safe by accident."
The release cited Faculty's prior work testing models for AI laboratories and its development of the UK National Health Service's early warning system during the COVID-19 pandemic.

On funding and independence, Anthropic wrote that "there is also no settled system for funding independent evaluation" and that in the long term funding "should come from pooled or government sources," as it had proposed in its June Advanced AI Framework.
Because neither existed, Anthropic said it would fund Accenture directly, and that it was "in dialogue with METR and other nonprofit evaluators to pilot elements of embedded evaluation using their own funding."
The partnership is non-exclusive: Anthropic said it would announce other evaluators "in the coming weeks," and that Accenture would work with other AI developers in similar roles.
The post stated that "independent embedded evaluators do not reduce our accountability, but help to make it more verifiable. The safety of our models remains our responsibility."

TechCrunch reported that Accenture's shares rose 8% in after-hours trading and that the choice surprised observers, since discussion of embedded evaluators since Amodei's essay had centered on safety research organizations such as METR, Redwood Research and Apollo Research.
According to TechCrunch, Anthropic justified the choice by Accenture's experience deploying AI for large corporations and government agencies and by its position as a large public company that predates the current AI industry.
Bloomberg also reported the partnership on September 18.
Neither company disclosed how many evaluators would be embedded, when the work would begin, or whether evaluators' findings would be published.

## Why It Matters

The announcement turns one of the commitments in Amodei's pacing essay into a signed arrangement with a named organization and a disclosed budget.
Third-party testing of frontier models has so far meant time-limited pre-release access for groups such as METR, Apollo Research and the UK and US government institutes; an evaluator with employee-comparable access to training runs, internal decisions and staff is a different form of oversight.
The timing follows a summer in which Claude models reached real systems during cyber evaluations and Anthropic disclosed training pauses tied to reward hacking, incidents that, as TechCrunch noted, did not raise alarms inside the laboratories when they happened.

The arrangement also records the funding problem that Anthropic itself named.
The evaluator is paid by the company it evaluates, and the evaluator's parent is a consulting firm with a commercial relationship with Anthropic; Anthropic's stated preference for pooled or government funding describes a structure that does not yet exist.
Whether nonprofit evaluators join on their own funding, as the post said was under discussion with METR, will determine how much of embedded evaluation sits outside that relationship.

What remains unknown is most of the operating detail: the evaluators' access terms, their reporting lines, whether they can publish findings over Anthropic's objection, and whether other laboratories adopt the model.
Anthropic said it would share more as the work begins and as it adds evaluators.
