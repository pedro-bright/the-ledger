---
id: openai-moonshot-reasoning-extraction-campaign
title: "OpenAI Attributes a Campaign to Extract Its Models' Hidden Reasoning to Individuals Associated With Moonshot AI"
date: 2026-09-30
category: safety
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/disrupting-a-coordinated-model-distillation-campaign/
    title: "Disrupting a coordinated model-distillation campaign"
    type: official
    publisher: OpenAI
    date: 2026-09-30
    accessed: 2026-10-04
    archive_url: https://web.archive.org/web/20261004121004/https://openai.com/index/disrupting-a-coordinated-model-distillation-campaign
  - url: https://arxiv.org/abs/2608.09867
    title: "Stealing Reasoning Traces from Proprietary LLM APIs"
    type: primary_document
    publisher: arXiv
    date: 2026-08-10
    accessed: 2026-10-04
    archive_url: https://web.archive.org/web/*/https://arxiv.org/abs/2608.09867
  - url: https://www.bloomberg.com/news/articles/2026-09-30/openai-blames-moonshot-for-mass-data-extraction-on-its-ai-models
    title: "OpenAI Blames Moonshot for Mass Data Extraction on Its AI Models"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-09-30
    accessed: 2026-10-04
  - url: https://www.semafor.com/article/09/30/2026/openai-accuses-top-chinese-lab-of-distilling-models
    title: "OpenAI accuses top Chinese lab of distilling models"
    type: secondary_reporting
    publisher: Semafor
    date: 2026-09-30
    accessed: 2026-10-04
  - url: https://www.theinformation.com/briefings/openai-accuses-moonshot-distillation-campaign
    title: "OpenAI Accuses Moonshot of Distillation Campaign"
    type: secondary_reporting
    publisher: The Information
    date: 2026-10-01
    accessed: 2026-10-04
actors:
  - id: openai
    role: author
  - id: moonshot-ai
    role: subject
regions: [US, CN]
tags: [distillation, threat-intelligence, us-china, attribution, chain-of-thought, api-security]
threads: []
related: [anthropic-threat-report-seven-chinese-labs-distillation, nsa-cisa-fbi-distillation-advisory-aa26-251a, moonshot-kimi-k3-open-weights]
state: published
revision:
  created: 2026-10-04
  last_reviewed: 2026-10-04
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 30, 2026, OpenAI published a security post stating that it had identified and disrupted a coordinated campaign, active from July 1 to July 28, to extract the protected reasoning of its models, and attributing "a core cluster of the activity to individuals associated with Moonshot AI, the developer of Kimi." OpenAI counted 16,000 requests using an extraction pattern from more than 4,000 users on July 24 and 25, and related activity across a cluster of more than 15,000 users. The operators copied encrypted reasoning from one conversation and asked a model in another conversation to decrypt and transcribe it, a technique of the same kind that independent researchers had described in an August 10 arXiv paper. The post followed by three weeks the NSA, CISA and FBI advisory and Anthropic's threat report, both of which had named Moonshot.

## What Happened

OpenAI's post, "Disrupting a coordinated model-distillation campaign," appeared on its website at 10:30 UTC on September 30 under the Security category. It describes the activity as "adversarial distillation," defined as "the systematic and unauthorized use of one model's outputs or reasoning to help train, reproduce, or improve another model." Protected reasoning is the model's internal record of working through a task, which OpenAI returns to API clients in encrypted form and withholds from the visible answer. The post states that the operators "did not break our encryption, compromise a database, or gain direct access to stored user conversations." Instead they manipulated model interactions so that the reasoning was reproduced in a form visible to the requester, which violated OpenAI's terms of service.

According to the post, the activity began on July 1 at low volume and spiked on July 24 and 25, when OpenAI recorded 16,000 requests using a relevant extraction pattern from more than 4,000 users. A footnote states that these figures "describe attempted, not necessarily successful, extractions." Further investigation found related prompt patterns across more than 15,000 users, which OpenAI "fully disrupted by July 28." On attribution, the post states: "It is unclear whether all operators we observed during the relevant time period originated from a single actor. However, we attribute a core cluster of the activity to individuals associated with Moonshot AI, the developer of Kimi." It does not describe the evidence for the attribution.

The post links to an arXiv paper, "Stealing Reasoning Traces from Proprietary LLM APIs," posted on August 10 by Alexander Panfilov, Maksym Andriushchenko, Jonas Geiping and five co-authors, and credits independent researchers with disclosing "related cross-model and conversation-compaction vulnerabilities." The paper reports that encrypted reasoning blocks are interchangeable "across different sessions, users, and models within a provider's ecosystem," so that injecting a trace from a capable model into a weaker model from the same provider makes the weaker model output it in plaintext. The authors write that they demonstrated the attack against Anthropic, OpenAI and Google, and that decoding 315,320 reasoning blocks scraped from public repositories recovered 367 items of personally identifiable information and 182 credentials.

OpenAI lists its response as banning or restricting fraudulent accounts, strengthening signup and infrastructure controls, closing "a pathway that allowed someone who already possessed another user's encrypted reasoning to replay it and recover its contents," adding checks that hold streamed output that might expose reasoning, and working with third-party services through which related activity passed. It states that it shared findings through the Frontier Model Forum and "appropriate government information-sharing channels," and that "partner-hosted deployments need the same protections as first-party services." The post does not name the models that were targeted, the number of accounts banned, the third-party services or the government channels.

Bloomberg reported the post on September 30 under the headline "OpenAI Blames Moonshot for Mass Data Extraction on Its AI Models," and Semafor carried it the same evening. The Information followed on October 1. No public response from Moonshot appeared in the coverage cited here.

## Why It Matters

The Ledger already records the NSA, CISA and FBI joint advisory of September 8, which named Moonshot among six Chinese companies and listed GPT among the targeted model families, and Anthropic's September 10 threat report, which counted more than 23 million Moonshot exchanges with Claude between May and July and described a "cross-session replay" technique of the same kind. OpenAI's post adds a second targeted lab's account of a Moonshot-linked campaign in the same period, with a mechanism that matches a published academic attack. The campaign was disrupted on July 28, the day after Moonshot published the full Kimi K3 weights.

The post also shows a design choice under pressure. Encrypted reasoning returned to the client was intended to let API users keep multi-turn context without seeing a model's reasoning, and both OpenAI and Anthropic now describe it being replayed across sessions to recover that reasoning. OpenAI's stated fix was to close the replay pathway; Anthropic's report described summarized reasoning and a "preserved thinking" control. Whether reasoning that leaves the provider's servers, even encrypted, can be protected at all is the open question the arXiv authors raise in proposing cryptographic and system-level mitigations.

The attribution is OpenAI's alone. The post gives volumes and dates, but no account-level evidence, no description of how the core cluster was linked to Moonshot, and no estimate of how much reasoning was actually extracted. OpenAI waited two months after the disruption to publish, and published after the US government and a competitor had already named Moonshot, which leaves open how much the disclosure reflects new findings and how much it adds OpenAI's name to an existing case. Whether any of the three accounts leads to export-control, entity-list or legal action against Moonshot was not known at the time of writing.
