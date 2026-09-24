---
id: anthropic-rd-automation-index-claude-leads-26-percent
title: "Anthropic Publishes an R&D Automation Index Reporting That Claude Leads 26% of Its Model Development Work"
date: 2026-09-17
category: research
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/institute/measuring-pace-of-ai-development
    title: "Measurements for understanding the pace of AI development inside frontier labs"
    type: official
    publisher: Anthropic
    date: 2026-09-17
    accessed: 2026-09-24
    archive_url: https://web.archive.org/web/20260922164416/https://www.anthropic.com/institute/measuring-pace-of-ai-development
  - url: https://www.bloomberg.com/news/articles/2026-09-17/anthropic-says-claude-drives-26-of-its-research-and-development
    title: "Anthropic Says Claude Drives 26% of Its Research and Development"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-09-17
    accessed: 2026-09-24
  - url: https://www.washingtonpost.com/technology/2026/09/17/anthropic-says-its-chatbot-claude-is-taking-over-work-building-its-own-successor/
    title: "Anthropic says its chatbot Claude is taking over the work of building its own successor"
    type: secondary_reporting
    publisher: The Washington Post
    date: 2026-09-17
    accessed: 2026-09-24
actors:
  - id: anthropic
    role: subject
  - id: jack-clark
    role: author
regions: [US]
tags: [ai-rd-automation, recursive-self-improvement, agent-oversight, safety-compute, transparency-metrics, pacing]
threads: [frontier-safety-policies]
related: [anthropic-accenture-embedded-evaluator, anthropic-alignment-security-update-rl-pause, openai-misalignment-reporting-framework-six-reports]
state: published
revision:
  created: 2026-09-24
  last_reviewed: 2026-09-24
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 17, 2026, Anthropic published three internal measurements of how its models are built and proposed that every frontier developer report the same figures.
Its new R&D Automation Index found that, as of August 2026, Claude "leads" 26% of Anthropic's AI research and development work, up from under 1% in February 2026, and that more than 90% of the work is done at or above the level where AI "collaborates."
The company also reported that about 30,000 agents were doing research and engineering work at any one time on its most-used internal platform, that its online monitor blocked about 1 in 47,000 agent decisions in August, and that about 6% of compute spent on AI R&D in a sampled week went to safety.

## What Happened

The post, "Measurements for understanding the pace of AI development inside frontier labs," was published by Anthropic's Institute, co-authored by Marina Favaro and Phillie Wright with research direction from Jack Clark.
It opened by stating that AI systems "have begun to automate more of the process of building themselves" and that "as the world considers slowing the pace of frontier AI development, the public needs more information."
It set out three measurements: how much AI R&D is performed by AI, how well the actions of AI agents are overseen, and how compute is allocated.

For the first, Anthropic used an automation scale developed by Epoch AI that runs from AL0 (no AI involvement) to AL5 (AI operates fully autonomously, with no human in the loop).
At AL3 AI "collaborates," doing large parts of a task under close human direction; at AL4 AI "leads," completing most of a task end to end from a high-level prompt while a human supervises.
To build the task list, Anthropic sampled 20% of staff in the model R&D departments each week in July 2026, had a Claude research agent review each sampled person's week using Slack and internal documentation, and collected about 15,000 tasks, which Claude organized into a frozen tree of 542 nodes, 378 of them leaves.
The post reported: "As of August 2026, Claude is not operating fully autonomously for any measured subset of AI R&D work. Claude 'leads' 26% of Anthropic's AI R&D work. The share of work at or above 'AI collaborates' is above 90%."
A chart in the post showed the leads share rising from under 1% in February 2026.
Comparing a January 2026 basket of tasks against new tasks arriving from February to July, Anthropic found no rise in the number of novel tasks.

For oversight, the post said approximately 30,000 agents were doing research and engineering work at Anthropic at any one time on its most-used internal platform, and that the figures covered that platform only.
Across more than a billion agent decisions in August 2026, an online monitor blocked 0.002%, about 1 in 47,000.
An offline monitor flagged roughly 100,000 transcripts per week for classifier review, of which about 50 per week were escalated to human review.
For compute, Anthropic reported that over the examined week about 6% of compute that went to AI R&D, and about 12% of compute that went to AI-driven AI R&D, was allocated to safety, and described both figures as deliberately conservative.

The post stated that Anthropic "would expect these numbers to shift if there were coordination on pacing the frontier, as called for by Anthropic CEO Dario Amodei," and that it planned to embed independent third-party evaluators with access "comparable to what internal risk assessment teams have" who would "verify safety practices, report incidents, and monitor key metrics such as the ones in this piece."
Bloomberg and The Washington Post reported the disclosure on September 17; the next day Anthropic named Accenture's Faculty as its first embedded evaluator.

## Why It Matters

The index is a quantified, repeatable estimate, published by a frontier laboratory about itself, of how much of its own model development is carried out by its models.
Discussion of AI systems automating AI research had relied on anecdotes, capability evaluations and forecasts; the post supplies a method, a current figure and an earlier one from February, and it asks other developers to publish the same three measures so that figures can be compared across companies and over time.

All of the figures are Anthropic's measurements of itself, produced partly by Claude reviewing staff activity, and the post describes no external verification of them.
The AL4 category still requires human supervision, and the 26% share describes how tasks are carried out, not how much of model development would continue without people.
The oversight and compute figures cover one internal platform and one sampled week, and Anthropic noted that the safety share depends on how production workloads and classifier costs shift.

The post ties the measurements directly to the argument for pacing frontier development and to the embedded evaluators who are to check them.
Whether other laboratories publish comparable numbers, and whether Anthropic reports the index at regular intervals as it proposed, will determine whether it becomes a tracking series or remains a single disclosure.
