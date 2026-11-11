---
id: metr-anthropic-ai-rd-acceleration-assessment
title: "METR's Independent Assessment Estimates Anthropic's Capability Progress Has Roughly Doubled in Pace, Mostly Because of AI"
date: 2026-11-05
category: safety
significance: notable
confidence: high
sources:
  - url: https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/
    title: "Independent Assessment of AI R&D Acceleration at Anthropic in October 2026"
    type: primary_document
    publisher: METR
    date: 2026-11-05
    accessed: 2026-11-11
    archive_url: https://web.archive.org/web/20261105193303/https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/
  - url: https://x.com/METR_Evals/status/2118412183860351084
    title: "METR announcement thread on the Anthropic AI R&D acceleration assessment"
    type: primary_recording
    publisher: METR (X)
    date: 2026-11-05
    accessed: 2026-11-11
    archive_url: https://web.archive.org/web/*/https://x.com/METR_Evals/status/2118412183860351084
  - url: https://www.washingtonpost.com/business/2026/11/05/anthropic-metr-ai-claude-acceleration/863c713e-d943-11f1-930a-e08f8086f5ac_story.html
    title: "Anthropic is rapidly accelerating AI development amid slowdown calls, outside research group says"
    type: secondary_reporting
    publisher: The Washington Post
    date: 2026-11-05
    accessed: 2026-11-11
  - url: https://techcrunch.com/2026/11/09/anthropic-releases-new-mythos-and-fable-models-amid-rsi-concerns/
    title: "Anthropic releases new Mythos and Fable models amid RSI concerns"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-11-09
    accessed: 2026-11-11
actors:
  - id: metr
    role: author
  - id: anthropic
    role: subject
regions: [US]
tags: [ai-rd-acceleration, recursive-self-improvement, third-party-evaluation, responsible-scaling-policy, transparency]
threads: [frontier-safety-policies]
related: [anthropic-rd-automation-index-claude-leads-26-percent, anthropic-second-risk-report-misalignment, anthropic-rsp-v3, metr-ai-productivity-study-2026]
state: published
revision:
  created: 2026-11-11
  last_reviewed: 2026-11-11
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 5, 2026, the AI evaluation nonprofit METR published an independent assessment of how much AI is speeding up AI research and development at Anthropic, based on eleven weeks of access to Anthropic's internal data.
METR concluded that, as of October 2026, Anthropic "is likely improving the capabilities of their models on well-specified tasks at around twice the rate they did between March 2024 and October 2025," and guessed that about 80% of the current acceleration is due to AI.
METR also reported that Anthropic redacted "a majority of the evidence we found most informative for these conclusions" and dropped a planned verification of how Anthropic divides compute between capabilities and safety work.

## What Happened

Four METR staff, Tom Cunningham, Nate Rush, Parker Whitfill and Hjalmar Wijk, working the equivalent of 2.5 full-time positions, ran the assessment from August 12 to October 29, 2026. They worked on Anthropic devices and received what METR called "unprecedented access" to internal data: pretraining and reinforcement learning metrics, training compute by domain, benchmark scores for internal models, AI speedup analyses, forecasts of a future model's metrics, and interviews with staff. METR took no payment, and Anthropic provided free tokens. METR's staff did not have query access to Anthropic's unreleased models. The report says the engagement is distinct from the assessment Anthropic announced on October 15, under which a METR team received employee-like access, and that METR was also scoped to review the AI R&D section of Anthropic's August 2026 Risk Report. METR announced the report on X at 18:36 UTC on November 5.

The central measurement used AECI, Anthropic's version of the Epoch Capabilities Index, which combines benchmark scores into one capability scale. METR estimated a trend break on October 7, 2025, and found that AECI scores have since grown at 1.9 times the earlier rate (95% confidence interval 1.5 to 2.8 times), "implying that Anthropic has made roughly two years of historical progress over the last year." Alternative modeling choices gave estimates between 1.1 and 2.9 times. METR said it was confident the acceleration was not caused by faster scaling of training compute. The data included three internal models trained between July and October 2026; the newest, which METR calls Model 4, scored above 50% on every AECI benchmark on which it was tested, which METR flagged as a saturation problem for the measure. A forecast for a future model in METR's full report was redacted.

On the cause, METR wrote that beyond ruling out training compute "there was not a consensus among Anthropic's own staff and we did not find decisive evidence." Its subjective judgment was that non-AI factors likely contributed to the acceleration that began in late 2025, but that "a majority (perhaps ≈80%) of the current (October 2026) acceleration is due to AI." Staff interviews and surveys were consistent with AI doubling the pace of progress. In internal Slack polls, average self-reported uplift from the most capable internal model reached about 12x in October 2026, which METR treated as "only very loose evidence." METR was told that the acceleration comes mainly from AI assistance to researchers rather than fully autonomous work, "but there are some signs that fully autonomous contributions will play a larger role soon." It found no evidence of bottlenecks in algorithms, training compute, experiment compute or data that would prevent further progress over the next 12 months, while noting that its view of bottlenecks changed several times during the work.

The report documents its own limits. METR delivered a full report of about 100 pages to Anthropic on October 22. Anthropic issued redaction guidance on October 25 and tightened it between October 27 and 29, and the two organizations agreed on an extension of about five days before METR submitted the final public version on November 3. Anthropic described the redactions as "aimed at removing confidential information that could accelerate other AI developers." METR wrote that, as a result, "the public has to rely on METR's judgment much more than would be ideal." The original contract also covered verification of Anthropic's compute allocation between capabilities and safety; Anthropic changed the scope midway, and that component was canceled before METR reached substantive conclusions. On November 6, METR posted an update that corrected the report's AI Evaluator Forum (AEF-1) checklist entry on query access from "Yes" to "No."

The Washington Post reported the findings on November 5 under the headline "Anthropic is rapidly accelerating AI development amid slowdown calls, outside research group says." On November 9, TechCrunch's report on Anthropic's release of Claude Fable 5.2 and Claude Mythos 5.2 described METR's report as having "suggested the lab might be approaching recursive self-improvement" and summarized it as finding that internal models were speeding up Anthropic's progress by roughly 2x, "although many uncertainties remain."

## Why It Matters

This is the first published estimate by an outside evaluator, working from a frontier developer's internal data, of how much AI is accelerating that developer's own capability progress. Anthropic's Responsible Scaling Policy treats AI R&D acceleration as a key risk indicator, and in September Anthropic began publishing its own R&D Automation Index. METR stated that it did "not pay special attention to the thresholds set in the RSP" and aimed instead at an overall picture, so the report does not say whether any policy threshold has been crossed. METR's earlier work points in different directions: its 2025 developer study found that early-2025 AI tools slowed experienced developers down, which the report cites alongside its time-horizon trends as evidence on both sides.

The estimate rests on a narrow base. AECI measures well-specified, verifiable tasks and is saturating; the confidence interval is wide; and METR lists specific ways it could be underestimating or overestimating acceleration. The evidence METR considered most informative was redacted at Anthropic's request, so outside researchers cannot check the central judgment, and the question of how much compute Anthropic devotes to safety relative to capabilities went unanswered when that part of the review was canceled. Whether this arrangement, in which an evaluator has broad access and publication rights but the company controls redactions, becomes a standard for other developers, and whether later assessments confirm or revise the 2x figure, is not yet known.
