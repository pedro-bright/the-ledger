---
id: anthropic-responsible-scaling-policy-v1
title: "Anthropic Publishes the First Responsible Scaling Policy, Committing to Pause Scaling Past Its Safeguards"
date: 2023-09-19
category: safety
significance: landmark
confidence: high
sources:
  - url: https://www.anthropic.com/index/anthropics-responsible-scaling-policy
    title: "Anthropic's Responsible Scaling Policy"
    type: primary_document
    publisher: Anthropic
    date: 2023-09-19
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230919161716/https://www.anthropic.com/index/anthropics-responsible-scaling-policy
  - url: https://assets.claude.com/1adf000c8f675958c2ee23805d91aaade1cd4613.pdf
    title: "Anthropic's Responsible Scaling Policy, Version 1.0"
    type: primary_document
    publisher: Anthropic
    date: 2023-09-19
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230919161730/https://www-files.anthropic.com/production/files/responsible-scaling-policy-1.0.pdf
  - url: https://venturebeat.com/ai/anthropics-new-policy-takes-aim-at-catastrophic-ai-risks/
    title: "Anthropic's new policy takes aim at 'catastrophic' AI risks"
    type: secondary_reporting
    publisher: VentureBeat
    date: 2023-09-21
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230921205347/https://venturebeat.com/ai/anthropics-new-policy-takes-aim-at-catastrophic-ai-risks/
  - url: https://metr.org/blog/2023-09-26-rsp/
    title: "Responsible Scaling Policies (RSPs)"
    type: expert_interpretation
    publisher: METR (then ARC Evals)
    date: 2023-09-26
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230928123700/https://evals.alignment.org/blog/2023-09-26-rsp/
actors:
  - id: anthropic
    role: author
  - id: metr
    role: associated-organization
regions: [US]
tags: [responsible-scaling-policy, RSP, ai-safety-levels, ASL, frontier-safety, voluntary-commitments, pause-commitment]
threads: [frontier-safety-policies]
related: [anthropic-asl3-activation-opus-4, anthropic-rsp-v3, openai-preparedness-framework-v2]
state: published
revision:
  created: 2026-11-14
  last_reviewed: 2026-11-14
  draft_assistance: ai-assisted
---

## Summary

On September 19, 2023, Anthropic published its Responsible Scaling Policy, the first public framework by a frontier AI developer that tied the training and deployment of more capable models to specific safety measures.
The policy defined AI Safety Levels (ASLs), modeled loosely on the US government's biosafety levels, and committed Anthropic to pause scaling or delay deployment whenever its models' capabilities outstripped its ability to meet the safeguards required at the corresponding level.
OpenAI and Google DeepMind published comparable frameworks over the following months, and the RSP became the reference point for the voluntary approach to frontier AI safety.

## What Happened

Anthropic announced the policy in a blog post and published the full document as version 1.0, effective September 19, 2023.
The policy addressed catastrophic risks, defined as large-scale devastation, "for example, thousands of deaths or hundreds of billions of dollars in damage," directly caused by an AI model, whether through deliberate misuse such as bioweapons development or through a model acting autonomously against its designers' intent.

The core of the policy was a ladder of AI Safety Levels.
ASL-1 covered systems with no meaningful catastrophic risk.
ASL-2 covered systems showing early signs of dangerous capabilities that were not yet useful, and Anthropic said its current models, including Claude, appeared to be ASL-2.
ASL-3 covered systems that substantially increased the risk of catastrophic misuse compared with sources such as search engines or textbooks, or that showed low-level autonomous capabilities, and its measures included unusually strong security and a commitment not to deploy such models if they showed meaningful misuse risk under adversarial testing.
ASL-4 and higher were left undefined, with a commitment to define ASL-4 before training ASL-3 models.

The policy stated that following the ASL scheme "implies that we commit to pause the scaling and/or delay the deployment of new models whenever our scaling ability outstrips our ability to comply with the safety procedures for the corresponding ASL."
Anthropic committed to evaluate its models periodically for ASL-3 warning signs, and said the policy had been approved by its board and that changes required board approval after consultation with its Long-Term Benefit Trust.
Anthropic called the policy "our current best guess" and "an early iteration," and said it hoped the scheme could create a "race to the top" in which competitive pressure went into solving safety problems.

Anthropic credited ARC Evals, the evaluation group later renamed METR, with originating the responsible scaling policy concept and advising on its evaluations.
On September 26, ARC Evals published its own description of what a good RSP should contain and wrote that voluntary commitments would be "insufficient to adequately contain risks from AI" and were not a substitute for regulation.
Anthropic co-founder Sam McCandlish told VentureBeat that because the company both released and tested its models, "there is a temptation to make the tests too easy."

## Why It Matters

The RSP turned general statements about AI risk into conditional commitments with named thresholds, written down before any model had reached them.
It set the template that OpenAI's Preparedness Framework and Google DeepMind's Frontier Safety Framework followed.

The policy also showed the limits of self-governance from the start.
Anthropic wrote the thresholds, ran the evaluations and could amend the policy through its own board; the document called for external audits only at the future ASL-4 level.
The commitments were tested later: Anthropic activated ASL-3 protections for Claude Opus 4 in May 2025, and in February 2026 version 3.0 replaced the unconditional pause commitment with a conditional one, a change disputed as soon as it was published.
