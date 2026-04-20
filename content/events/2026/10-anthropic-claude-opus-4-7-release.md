---
id: anthropic-claude-opus-4-7-release
title: "Anthropic Releases Claude Opus 4.7 with Task Budgets"
date: 2026-04-16
category: models
significance: major
confidence: high
actors:
  - id: anthropic
    role: subject
regions: [global]
tags: [claude-opus, task-budgets, swe-bench, extended-thinking, xhigh-reasoning, image-support]
threads: [ai-agents-era]
sources:
  - url: https://www.anthropic.com/news/claude-opus-4-7
    title: "Claude Opus 4.7"
    type: official
    date: 2026-04-16
  - url: https://github.blog/changelog/2026-04-16-claude-opus-4-7-is-generally-available/
    title: "Claude Opus 4.7 Is Generally Available"
    type: official
    date: 2026-04-16
  - url: https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7
    title: "What's New — Claude Opus 4.7"
    type: official
    date: 2026-04-16
---

## Summary

Anthropic released Claude Opus 4.7 on April 16, 2026, introducing task budgets as a public beta feature — a mechanism that gives the model a token target and displays a live countdown for users observing long-horizon work. The release also added a new xhigh reasoning effort level, expanded image support to 3.75 megapixels, and posted a 39.3% SWE-bench score (a 13-point improvement over Opus 4.6). Pricing remained unchanged at $5/$25 per million tokens.

## What Happened

Task budgets were the headline feature of Opus 4.7. The mechanism allows an agent framework or user to specify a token target for a task — an estimate of how much computation the task should require. The model receives the budget at the start of work and displays a live countdown visible to users monitoring the session. When the budget runs low, the model can flag that the task is more complex than anticipated and request an extension, or wrap up its current progress.

The feature addressed a practical problem in long-horizon agent deployments: cost and time unpredictability. Users watching an agent work had no sense of how much longer or how much more expensive a task would become. Task budgets gave that visibility in real time and created a negotiation point between user and agent before costs spiraled.

Opus 4.7 also added a new reasoning effort level called xhigh, sitting above the existing high setting. The xhigh level allocated more tokens to internal reasoning steps before generating output, targeting tasks where the highest possible accuracy justified higher latency and token cost. The image resolution expansion from 1.15 megapixels to 3.75 megapixels improved the model's ability to process dense visual information — engineering diagrams, dense code screenshots, high-resolution document scans.

On SWE-bench Verified, Opus 4.7 scored 39.3% — a 13-percentage-point improvement over Opus 4.6, reflecting continued gains in the lower-difficulty region of the benchmark where agentic scaffolding improvements had the most leverage.

## Why It Matters

Task budgets represented a shift in how long-horizon agents communicated cost and progress to users. The field had learned in 2025 that raw capability was not sufficient for enterprise adoption — predictability, observability, and cost control were equally important. Task budgets addressed all three simultaneously: a budget is a prediction (predictability), the countdown is observability, and the negotiation mechanism is cost control.

The xhigh reasoning level continued the trend toward variable-intensity reasoning within sessions, giving developers a finer-grained control surface for balancing cost against accuracy. Together, these features reflected a maturing view of what frontier AI agents needed to be: not just capable, but governable — systems that operators and users could understand, supervise, and constrain without sacrificing the autonomy that made them useful.
