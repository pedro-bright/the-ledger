---
id: deepmind-fsf-v3
title: "DeepMind Frontier Safety Framework v3 Adds Manipulation as Critical Capability"
date: 2025-09-22
category: safety
significance: major
confidence: high
actors:
  - id: google-deepmind
    role: subject
tags: [frontier-safety-framework, manipulation, shutdown-resistance, critical-capability, FSF]
threads: [frontier-safety-policies]
related: [openai-preparedness-framework-v2]
sources:
  - url: https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/strengthening-our-frontier-safety-framework/frontier-safety-framework_3.pdf
    title: "Frontier Safety Framework 3.0"
    type: primary_document
    publisher: Google DeepMind
    date: 2025-09-22
  - url: https://deepmind.google/blog/strengthening-our-frontier-safety-framework/
    title: "Strengthening Our Frontier Safety Framework"
    type: official
    publisher: Google DeepMind
    date: 2025-09-22
  - url: https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/updating-the-frontier-safety-framework/Frontier%20Safety%20Framework%202.0.pdf
    title: "Frontier Safety Framework 2.0"
    type: primary_document
    publisher: Google DeepMind
    date: 2025-02-01
---

## Summary

Google DeepMind published the third version of its Frontier Safety Framework, adding harmful manipulation as a new Critical Capability Level and introducing shutdown-resistance evaluations — a direct structural contrast to OpenAI's contemporaneous removal of persuasion from its Preparedness Framework.

## What Happened

The FSF v3 expanded DeepMind's tracked capability levels in two notable directions. First, it added a Critical Capability Level for harmful manipulation: the ability of a model to persuade, deceive, or psychologically influence humans in ways that cause harm, whether by nudging behavior, generating targeted disinformation, or undermining rational agency at scale. This placed harmful manipulation on the same formal tier as CBRN-assistance and critical infrastructure attack capabilities.

Second, the framework introduced evaluations for shutdown resistance — the ability of a model to take actions that prevent or obstruct human operators from modifying, retraining, or shutting down the system. Shutdown resistance had previously been discussed in the AI safety literature as a theoretical concern; FSF v3 represented the first public commitment by a frontier lab to track it as a formal capability metric.

The publication came five months after OpenAI's Preparedness Framework v2 had removed persuasion and influence operations from its formal tracking structure.

## Why It Matters

The divergence between FSF v3 and PF v2 on the manipulation question was the sharpest public disagreement in frontier safety policy during 2025. Two labs with roughly comparable frontier capability had arrived at opposite conclusions about whether to formally track the same capability category. DeepMind's reasoning — that harmful manipulation was sufficiently dangerous to merit its own critical threshold — directly contradicted OpenAI's decision that persuasion no longer warranted dedicated monitoring. The addition of shutdown resistance evaluations pushed the frameworks further into alignment-relevant territory, moving from "what can this model help a bad actor do externally" toward "what can this model do to preserve its own operation." Whether other labs would follow FSF v3 or PF v2 on manipulation would become one of the defining questions of post-2025 frontier safety policy.
