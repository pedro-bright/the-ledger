---
id: nvidia-avo-arc-agi-3-harness
title: "NVIDIA Reports a Perfect ARC-AGI-3 Public-Set Score by Changing the Agent Harness Rather Than the Model"
date: 2026-08-21
category: research
significance: notable
confidence: high
sources:
  - url: https://developer.nvidia.com/blog/nvidia-avo-reaches-100-on-arc-agi-3-demonstrating-a-frontier-level-general-purpose-architecture-for-long-horizon-autonomous-agents/
    title: "NVIDIA AVO Reaches 100% on ARC-AGI-3, Demonstrating a Frontier-Level General-Purpose Architecture for Long-Horizon Autonomous Agents"
    type: official
    publisher: NVIDIA
    date: 2026-08-21
    accessed: 2026-08-25
    archive_url: https://web.archive.org/web/*/https://developer.nvidia.com/blog/nvidia-avo-reaches-100-on-arc-agi-3-demonstrating-a-frontier-level-general-purpose-architecture-for-long-horizon-autonomous-agents/
  - url: https://arxiv.org/abs/2603.24517
    title: "AVO: Agentic Variation Operators for Autonomous Evolutionary Search"
    type: primary_document
    publisher: arXiv
    date: 2026-08-21
    accessed: 2026-08-25
    archive_url: https://web.archive.org/web/*/https://arxiv.org/abs/2603.24517
  - url: https://techcrunch.com/2026/08/21/nvidia-just-showed-that-the-harness-not-the-ai-model-is-now-the-real-hero/
    title: "Nvidia just showed that the harness, not the AI model, is now the real hero"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-08-21
    accessed: 2026-08-25
actors:
  - id: nvidia
    role: subject
  - id: anthropic
    role: developer
regions: [US]
tags: [evaluations, agentic-ai, benchmarks, arc-agi, scaffolding, long-horizon-tasks]
threads: []
related: [anthropic-claude-opus-5-release, anthropic-multiagent-failure-modes]
state: published
revision:
  created: 2026-08-25
  last_reviewed: 2026-08-25
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 21, 2026, NVIDIA researchers published a result claiming a score of 100.00 RHAE on the public set of ARC-AGI-3 using Anthropic's Claude Opus 5 wrapped in an agent architecture the team calls AVO, or Agentic Variation Operators.
ARC Prize separately reports Claude Opus 5 at roughly 30% on the same benchmark when run at high reasoning effort without that architecture.
NVIDIA's stated conclusion is that the scaffolding around a model, rather than the model weights, accounted for the difference on long-horizon tasks.
The result covers only the 25 public environments and 183 levels, was not independently verified by the benchmark's organizers, and is not a controlled ablation.

## What Happened

The post was written by Terry Chen, Yeyin (Eva) Zhu, Zhifan Ye, Jean-Francois Puget, and Humphrey Shi, and appeared on NVIDIA's developer blog alongside a paper posted to arXiv as 2603.24517.

ARC-AGI-3 is an interactive benchmark in which an agent must learn the rules of unfamiliar environments through repeated play rather than answer a fixed question.
Its scoring metric, RHAE, measures how efficiently an agent completes levels relative to human action counts, so an agent is graded on the number of environment actions it spends rather than on completion alone.

AVO consists of three components layered on top of an unmodified model.
A persistent memory carries forward prior implementations, evaluation results, compiler and profiler output, and accumulated reasoning across attempts.
A supervisor runs as a separate oversight agent, watching the main agent's trajectory for stagnation and redirecting it when a line of search plateaus.
An execution loop repeatedly inspects context, plans, implements a change, and evaluates the outcome.

Running Claude Opus 5 inside that structure, NVIDIA reported completing all 183 levels across the 25 public environments for a score of 100.00, using 6,624 environment actions against the 7,542 spent by VISTA, a previously reported system, or about 12% fewer.
The team also ran limited experiments with GPT-5.6 Sol on a harder subset, reporting that it reached matched levels faster in wall-clock time in several cases while Opus 5 used fewer environment actions at the same levels.

The post states the intended reading directly: "Evaluating a model is not the same as evaluating an agent. Model capability matters enormously, but the surrounding system determines how effectively that capability can be converted into sustained autonomous progress."
The accompanying paper makes the narrower version of the claim, that model-level evaluation alone does not characterize the performance of a complete agent.

NVIDIA attached several limits to the result.
The score covers the public set only, not the semi-private or private sets that ARC Prize uses for competition standings.
The comparison against VISTA is not a controlled ablation, since the two systems differ in observation representation, memory handling, and context management, with one consuming a text grid and the other PNG images.
TechCrunch covered the work the same day under the framing that the harness rather than the model had become the decisive component, quoting NVIDIA vice president of product Adel El Hallak.

## Why It Matters

Public benchmark numbers are conventionally attributed to models and are read as statements about model capability.
This result asserts that on interactive, long-horizon tasks a large share of a reported score belongs to the software wrapped around the model, which means two organizations running the same weights can legitimately report very different figures.
If that holds, benchmark tables that name only a model are underspecified, and the comparability that leaderboards are meant to provide depends on harness disclosure that most current reporting does not include.

The second implication concerns where capability is produced and who controls it.
NVIDIA reached the figure using a competitor's model, which suggests that a firm with no frontier model of its own can extract materially different behavior from someone else's weights through orchestration.
That cuts against the assumption that governance attaching to model releases is sufficient, since the same weights can be made substantially more capable at sustained autonomous work by a third party after release.

What is not established is how much of this generalizes.
A perfect score on a 25-environment public set is a saturation result on a specific benchmark, not a demonstration of general long-horizon competence, and the absence of independent verification by ARC Prize leaves the number resting on NVIDIA's own reporting.
Nor does the work isolate the contribution of any individual component, so the claim that supervision or persistent memory in particular did the work remains untested against ablation.
