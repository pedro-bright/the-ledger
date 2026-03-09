---
id: claude-3-5-sonnet-new-haiku
title: "Anthropic Releases Updated Claude 3.5 Sonnet and Claude 3.5 Haiku with Computer Use"
date: 2024-10-22
category: models
significance: major
confidence: high
actors:
  - id: anthropic
    role: developer
regions: [US]
tags: [computer-use, agentic-ai, tool-use, frontier-model]
threads: [scaling-laws-debate]
sources:
  - url: https://www.anthropic.com/news/3-5-models-and-computer-use
    title: "Introducing computer use, a new Claude 3.5 Sonnet, and Claude 3.5 Haiku"
    type: primary
  - url: https://www.theverge.com/2024/10/22/24277152/anthropic-claude-computer-use-ai-agent
    title: "Anthropic's latest AI can use your computer the way you do"
    type: secondary
---

## Summary

Anthropic released an upgraded Claude 3.5 Sonnet alongside Claude 3.5 Haiku, with the headline feature being a public beta of "computer use" — the ability for Claude to directly control a computer by viewing the screen, moving the cursor, clicking, and typing. This represented the first major commercial deployment of an AI model that could autonomously operate a computer interface.

## What Happened

On October 22, 2024, Anthropic announced three releases: a significantly improved version of Claude 3.5 Sonnet (internally referred to as "new Sonnet"), Claude 3.5 Haiku (a faster, cheaper model), and a public beta of computer use capabilities for Claude.

The updated Claude 3.5 Sonnet showed substantial improvements over its June predecessor, particularly in coding tasks — scoring 49.0% on SWE-bench Verified (a benchmark requiring models to resolve real GitHub issues), up from 33.4% for the earlier version and significantly above competitors.

The computer use capability was the more groundbreaking announcement. In public beta, Claude could interact with a computer through screenshots — viewing the screen, recognizing UI elements, moving the cursor, clicking buttons, typing text, and navigating between applications. This enabled Claude to perform multi-step tasks like filling out forms, navigating websites, and operating desktop applications without requiring custom API integrations for each tool.

Anthropic emphasized that computer use was in early beta and explicitly warned about its limitations and safety implications, including the risk of prompt injection through displayed content and the challenges of giving an AI model control over a computer.

## Why It Matters

Computer use marked a significant step toward agentic AI — models that don't just respond to prompts but actively perform tasks in real-world environments. While AI agents had been discussed extensively throughout 2024, Claude's computer use was one of the first implementations that worked reliably enough for public release.

The implications were profound for software interaction: rather than requiring every application to build a custom AI integration, computer use allowed an AI model to interact with any software through the same visual interface humans use. This potentially made every existing application "AI-compatible" without any modification.

The safety implications were equally significant. An AI that could operate a computer could potentially take actions its user didn't intend — sending emails, making purchases, modifying files, or interacting with external systems. Anthropic's decision to release this capability publicly, while acknowledging its risks, reflected a calculated bet that the benefits of early deployment and iteration outweighed the risks of waiting for the technology to mature further.
