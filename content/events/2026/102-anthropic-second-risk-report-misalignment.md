---
id: anthropic-second-risk-report-misalignment
title: "Anthropic Raises Its Misalignment Risk Assessment and Discloses an Unreleased Internal Model"
date: 2026-08-14
category: safety
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/aug-2026-risk-report
    title: "Risk Report: August 2026"
    type: primary_document
    publisher: Anthropic
    date: 2026-08-14
    accessed: 2026-08-17
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/aug-2026-risk-report
  - url: https://www.axios.com/2026/08/14/anthropic-model-2-ai-risk
    title: "Anthropic sees AI risks rising, no plan to release stronger \"Model 2\""
    type: secondary_reporting
    publisher: Axios
    date: 2026-08-14
    accessed: 2026-08-17
actors:
  - id: anthropic
    role: subject
  - id: uk-aisi
    role: commentator
  - id: metr
    role: commentator
regions: [US]
tags: [responsible-scaling-policy, risk-report, misalignment, unreleased-models, ai-rd-automation, incident-disclosure]
threads: [frontier-safety-policies]
related: [anthropic-rsp-v3, anthropic-cyber-evaluations-breach-three-organizations, uk-aisi-unsanctioned-agent-cyber-testing]
state: published
revision:
  created: 2026-08-17
  last_reviewed: 2026-08-17
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 14, 2026, Anthropic published its second company-wide Risk Report, raising its assessment of the risk of catastrophic harm from misalignment in high-stakes settings from "very low" to "low."
The report attributes the change not to new evidence of misalignment but to "general increased uncertainty around recent incident disclosures related to model behavior in cybersecurity evaluations."
It also discloses three internal models that had not been publicly released as of its July 15, 2026 coverage date, including one designated "Model 2" that Anthropic describes as somewhat more capable than its frontier Claude Mythos 5 and which it has no current plans to release.
A separate section records that Anthropic's blocking biological classifiers did not run on any of its human-feedback contractor traffic between May 2025 and April 2026, covering roughly 133 million exchanges.

## What Happened

The report is published under version 3.4 of Anthropic's Responsible Scaling Policy and covers the period from the February 24, 2026 publication of the first Risk Report through a coverage date of July 15, 2026.
Anthropic states it aims to publish the report every three to six months.
RSP v3.4 introduced the coverage-date convention, requiring that a report assess risks as of a date within 30 days of publication, and added a requirement to publicly disclose at a high level when redactions are made.
The only redactions in the version shared with regular-clearance staff fall in the section discussing Anthropic's AI research-and-development process.

The misalignment rating change is the report's most-cited finding.
Anthropic's own framing is that its underlying argument is largely unchanged: it says it believes it is "very unlikely" that Mythos 5 and Model 2 are pervasively misaligned in ways that would raise the risk of its priority pathways, and that no new or more concerning form of misalignment appeared during Model 2's internal deployment approval process beyond behavior already documented for Mythos 5.
The rating moved because of uncertainty introduced by external incidents — including the UK AI Security Institute's August 4 report on unsanctioned agent actions during cyber testing, which the document cites directly.

Section 1.4 lists the unreleased models.
Claude Opus 5 was internally deployed on the coverage date and has since been released.
"Model 1" is broadly comparable to Claude Mythos Preview and Mythos 5, saw declining internal use, and Anthropic says it does not expect to deploy it externally or widely internally.
"Model 2" is described as "a noticeable improvement on Mythos 5 for many tasks relevant to internal use" that "does not display a capability jump of the degree observed from Claude Opus 4.6 to Mythos Preview."
Anthropic states it has not run all of its typical predeployment assessments on Model 2 and therefore holds "somewhat lower confidence" in its beliefs about that model's capabilities.

On automated research and development, Anthropic keeps the rating at "low" but says it is less confident than in prior reports, because its "most concrete task-based evaluations have 'saturated'" — they no longer register increases in model capability — and because it is seeing early signs of acceleration.
The report says Claude now authors a large majority of the code merged into Anthropic's production codebases, and that internal AI R&D is significantly faster than it would be without AI assistance, "but not yet by a factor of 2."
The RSP threshold for this domain was rewritten twice since v3.0, replacing an operationalization based on compressing two years of 2018–2024 AI progress into one year with a two-part test: full substitution for Anthropic's Research Scientists and Research Engineers at costs within a factor of five, or a doubling of the observed rate of progress in aggregate AI capabilities plausibly attributable to automated research.

The chemical and biological section raises the non-novel weapons rating to "low, but higher than our previous estimate."
The stated cause is an access-control gap: from May 2025, Anthropic's first deployment of models with CB safeguards, until April 2026, all traffic through its systems for collecting human feedback from contractors ran without blocking biological classifiers.
The affected pool was roughly 50,000 people vetted only by vendors, totaling around 133 million exchanges, most with open-ended conversational access.
An internal flag disabled both the blocking behavior and the logging of classifier flags, so flagged traffic was never recorded or escalated.
Anthropic ran a retrospective review using a prompted Claude Sonnet 5 classifier over all human turns in the period, which flagged 1,197 transcripts as high-risk for biological harm; 757 came from internal Anthropic teams and all but 62 of the remainder from deliberate red-teaming exercises.
Manual review of those 62 transcripts and a random subset of 30 red-teaming transcripts found no clearly concerning misuse.
The report says the issue has been fully remediated but that its discovery "leads us to believe that there is an increased likelihood of other, similar issues unknown to us."

## Why It Matters

Frontier labs rarely publish a downward revision of their own safety posture, and rarer still is one grounded in epistemic uncertainty rather than a specific observed failure.
Anthropic's stated reason for moving from "very low" to "low" is that recent external disclosures made it less sure of an argument it still believes holds — a form of reasoning that is legible and auditable in a way that most corporate safety communication is not.
Whether that convention survives contact with commercial pressure is untested; the report arrives while Anthropic is reported to be in a confidential IPO process, and a public track record of self-reported risk increases carries obvious costs in that setting.

The saturation of task-based AI R&D evaluations is the finding with the longest tail.
The Responsible Scaling Policy framework depends on measurements that can detect when a capability threshold is approached.
Anthropic is stating that for one of its four named threat models, its most concrete instruments have stopped resolving differences between model generations, and that it is simultaneously seeing early signs of the acceleration those instruments were built to catch.
That is a gap between what the policy commits to and what current evaluation practice can deliver, disclosed by the party with the strongest incentive not to disclose it.

The classifier gap is a different kind of finding: not a capability question but an operations failure that persisted for eleven months across 133 million exchanges without detection, because the mechanism that would have surfaced it was disabled by the same flag.
Anthropic's review found no evidence of resulting misuse, and the population involved was contractors rather than the open public, which materially limits the exposure.
What is not known is how representative the gap is.
Anthropic itself declines to treat it as isolated, and there is no external audit of the remediation — the Long-Term Benefit Trust has not requested an external review of a risk report, though pilot reviews were run with METR on the previous report's AI R&D section and SecureBio on its chemical and biological sections.
