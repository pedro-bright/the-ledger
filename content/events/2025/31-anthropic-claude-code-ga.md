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
    title: "Claude 3.7 Sonnet and Claude Code"
    type: official
    date: 2025-02-24
  - url: https://www.anthropic.com/news/claude-4
    title: "Claude 4"
    type: official
    date: 2025-05-22
  - url: https://github.com/anthropics/claude-code
    title: "Claude Code — GitHub Repository"
    type: primary_document
    date: 2025-05-22
---

## Summary

Anthropic launched Claude Code into general availability alongside Claude 4, completing a journey from February 2025 preview to production product. The terminal-native coding agent — capable of reading entire codebases, making multi-file edits, running tests, and committing changes through natural language — became the first coding agent to reach meaningful commercial scale, hitting $1 billion in ARR by November 2025.

## What Happened

Claude Code had been first previewed in February 2025 alongside Claude 3.7 Sonnet. It operated differently from IDE-embedded copilots: as a terminal process with direct filesystem access, it could explore a full codebase before acting, understand project-level context, and execute multi-step workflows that spanned reading, editing, testing, and version control. It made no attempt to embed inside an IDE, instead positioning the terminal as the natural coordination layer for agentic work.

The May 22 GA launch, timed with Claude 4, marked the transition from research tool to production product. Anthropic open-sourced the Claude Code repository, enabling third-party integrations and community extensions. The agent's design emphasized autonomy length over speed — it was built for tasks that might take minutes or hours, not for autocompletion.

Claude Code's commercial trajectory was steep. By November 2025 it had reached $1 billion in annualized revenue run rate, and by January 2026 that figure had roughly doubled to $2 billion. Those numbers made it the fastest-growing developer tool Anthropic had shipped and one of the first AI coding agents to achieve genuine commercial scale.

## Why It Matters

Claude Code's success established coding as the first mass-market category for long-horizon AI agents. It demonstrated that developers would pay for and trust an agent to work autonomously on real codebases — a higher bar than chat assistance or inline code suggestions. The commercial trajectory put pressure on every coding tool in the market and validated Anthropic's bet that terminal-native, context-aware agents would outperform IDE-embedded copilots for complex work.

The open-sourced repository also seeded an ecosystem: teams built wrappers, CI integrations, and custom workflows on top of Claude Code's architecture, accelerating adoption in enterprise engineering organizations.
