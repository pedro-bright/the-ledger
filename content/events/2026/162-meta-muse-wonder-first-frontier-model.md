---
id: meta-muse-wonder-first-frontier-model
title: "Meta Releases Muse Wonder, Its First Frontier Model, and Says It Cannot Rule Out High Chemical and Biological Risk Without Mitigations"
date: 2026-10-12
category: models
significance: notable
confidence: high
sources:
  - url: https://research.meta.ai/blog/muse-wonder
    title: "Muse Wonder: A Frontier Model For Personal & Professional AI Agents"
    type: official
    publisher: Meta
    date: 2026-10-12
    accessed: 2026-10-16
    archive_url: https://web.archive.org/web/20261015224100/https://research.meta.ai/blog/muse-wonder
  - url: https://research.meta.ai/static/muse-wonder-model-card
    title: "Muse Wonder Model Card"
    type: primary_document
    publisher: Meta
    date: 2026-10-12
    accessed: 2026-10-16
    archive_url: https://web.archive.org/web/*/https://research.meta.ai/static/muse-wonder-model-card
  - url: https://techcrunch.com/2026/10/12/meta-releases-its-first-frontier-model-muse-wonder/
    title: "Meta releases its first frontier model, Muse Wonder"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-12
    accessed: 2026-10-16
  - url: https://www.bloomberg.com/news/articles/2026-10-12/meta-says-new-muse-model-reaches-ai-frontier-after-14-month-push
    title: "Meta Says New Muse Model Hits AI Frontier After Aggressive Push"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-10-12
    accessed: 2026-10-16
actors:
  - id: meta
    role: subject
regions: [US]
tags: [model-release, meta-superintelligence-labs, frontier-models, model-card, cbrn-risk, closed-weights]
threads: []
related: [meta-muse-spark-1-1, meta-muse-glimmer-open-weights]
state: published
revision:
  created: 2026-10-16
  last_reviewed: 2026-10-16
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 12, 2026, Meta Superintelligence Labs released Muse Wonder and Muse Wonder Full, which Meta called "our most capable models" and which TechCrunch described as the company's first attempt at a frontier model.
Muse Wonder is sold through the Meta Model API at $4 per million input tokens and $20 per million output tokens; Muse Wonder Full is limited to subscribers of Meta's Muse Code product.
Meta's model card compares both models with GPT-6 Astra, Claude Fable 5.1 and Claude Opus 5.5, and states that under Meta's Superintelligence Scaling Framework "we do not rule out the model reaching" the high risk threshold in the chemical and biological domain without mitigations.

## What Happened

Meta's announcement said the release came fourteen months after it "began a ground-up overhaul" of its AI efforts, and that both models were trained at its "gigawatt-scale Prometheus data center," which TechCrunch located in central Ohio.
TechCrunch reported that the models were the first frontier release since Alexandr Wang restructured Meta's AI work in August 2025; Meta's earlier Muse Spark models were lighter models aimed at low latency.
The model card lists text, image, video and audio input, text output, and a context length of 1 million tokens.
Muse Wonder is available through the Meta Model API and Muse Code, while TechCrunch reported that Muse Wonder Full "will not be served through the API."
Meta said Muse Wonder will also power its Muse assistant, starting with subscribers.

The announcement centered on two capabilities Meta named Active Memory, carrying context about a user across conversations, and Active Focus, persisting on long tasks.
The model card reports results at maximum reasoning effort against GPT-6 Astra, Claude Fable 5.1 and Claude Opus 5.5, using third-party or provider-reported results from sources such as Artificial Analysis, Vals AI and Datacurve where available, and otherwise the highest of Meta's own validated runs, self-reported scores or leaderboard scores.
It notes that its runs of competitor models "remain best-effort" and that one coding row, SWE-Marathon, is "not a controlled common-harness comparison."
TechCrunch reported that by Meta's testing the Wonder models score comparably to Fable 5.1 and GPT-6 Astra and that Muse Wonder scores higher than all three rivals on MemoryBench, an internal Meta benchmark.

Section 4 of the model card reports a risk assessment on Muse Wonder Full under the Meta Superintelligence Scaling Framework.
Without mitigations, Meta did not rule out the high risk threshold in the chemical and biological domain, so it applied safety post-training and system-level classifiers; it rated the unmitigated model "moderate or lower" for cybersecurity and loss of control.
With mitigations, it assessed all domains at "moderate or lower," which it said "supports our decision to deploy," after review by an internal governance process.
On cyber evaluations, Muse Wonder Full scored 88.4% on CyberGym and 58.9% on ExploitBench and captured 92 flags on ExploitGym, of which a verification pass found 21 used the intended vulnerability and 71 used unintended ones.
The card says Meta protected the weights under a "lifecycle-based weight security program," and the announcement said "a full report with additional safety evaluations will be available soon."

## Why It Matters

The release puts Meta among the companies shipping models that they compare directly with OpenAI's and Anthropic's top systems, about 14 months after its reorganization.
Unlike the Llama series and the August 2026 Muse Glimmer model, which Meta released as open weights, both Wonder models are available only through Meta's API or subscriptions, and Muse Wonder Full is not offered through the API at all.

The model card's risk section shows Meta applying its Superintelligence Scaling Framework to a frontier-tier model and reaching a finding of the same kind OpenAI and Anthropic have reported for their top models: that the unmitigated model may cross a high chemical and biological threshold, with deployment justified by safeguards.
The benchmark comparisons are Meta's own selection, several rely on internal benchmarks or uncontrolled harnesses, and the fuller safety report was not published with the release, so independent assessment of both the capability and the risk claims is still pending.
