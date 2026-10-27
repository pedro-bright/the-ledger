---
id: anthropic-claude-code-ga
title: "Anthropic Launches Claude Code to General Availability"
date: 2025-05-22
category: industry
significance: major
confidence: high
actors:
  - id: anthropic
    role: subject
regions: [global]
tags: [coding-agents, claude-code, terminal, swe-bench, developer-tools, agentic-coding]
threads: [ai-agents-era]
sources:
  - url: https://www.anthropic.com/news/claude-3-7-sonnet
    title: Claude 3.7 Sonnet and Claude Code
    type: official
    date: '2025-02-24'
  - url: https://www.anthropic.com/news/claude-4
    title: Introducing Claude 4
    type: primary_document
    date: '2025-05-22'
    publisher: Anthropic
    accessed: '2026-10-26'
    archive_url: https://web.archive.org/web/20261022151535/https://www.anthropic.com/news/claude-4
  - url: https://github.com/anthropics/claude-code
    title: Claude Code — GitHub Repository
    type: primary_document
    date: '2025-05-22'
revision:
  draft_assistance: ai-assisted
---

## Summary

Anthropic made Claude Code generally available on May 22, 2025 alongside Claude 4, following its February research preview.
Alongside the terminal-based agent's general availability, Anthropic released beta extensions for VS Code and JetBrains and a beta GitHub integration that supports background tasks through GitHub Actions.

## Editorial correction (2026-10-26)

The May 22 primary announcement includes VS Code and JetBrains integrations, which its Claude Code section describes as new beta extensions.
The same announcement released Claude Code on GitHub in beta, with background tasks through GitHub Actions.
Terminal-based interaction did not mean that Claude Code made no attempt to integrate with IDEs.
The original body's claim to that effect is preserved as the earlier assertion and is superseded by this correction.

[Revision record with the prior summary and metadata](https://github.com/pedro-bright/the-ledger/blob/main/content/revisions/sr-anthropic-claude-code-ga-20261026.md).

The original narrative below is preserved as published; use the revised summary and this note for the corrected account.

## What Happened

Claude Code had been first previewed in February 2025 alongside Claude 3.7 Sonnet. It operated differently from IDE-embedded copilots: as a terminal process with direct filesystem access, it could explore a full codebase before acting, understand project-level context, and execute multi-step workflows that spanned reading, editing, testing, and version control. It made no attempt to embed inside an IDE, instead positioning the terminal as the natural coordination layer for agentic work.

The May 22 GA launch, timed with Claude 4, marked the transition from research tool to production product. Anthropic open-sourced the Claude Code repository, enabling third-party integrations and community extensions. The agent's design emphasized autonomy length over speed — it was built for tasks that might take minutes or hours, not for autocompletion.

Claude Code's commercial trajectory was steep. By November 2025 it had reached $1 billion in annualized revenue run rate, and by January 2026 that figure had roughly doubled to $2 billion. Those numbers made it the fastest-growing developer tool Anthropic had shipped and one of the first AI coding agents to achieve genuine commercial scale.

## Why It Matters

Claude Code's success established coding as the first mass-market category for long-horizon AI agents. It demonstrated that developers would pay for and trust an agent to work autonomously on real codebases — a higher bar than chat assistance or inline code suggestions. The commercial trajectory put pressure on every coding tool in the market and validated Anthropic's bet that terminal-native, context-aware agents would outperform IDE-embedded copilots for complex work.

The open-sourced repository also seeded an ecosystem: teams built wrappers, CI integrations, and custom workflows on top of Claude Code's architecture, accelerating adoption in enterprise engineering organizations.
