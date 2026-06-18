---
id: openai-acquires-ona
title: "OpenAI Acquires Ona to Power Long-Running Codex Agents"
date: 2026-06-11
category: industry
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/openai-to-acquire-ona/
    title: "OpenAI to acquire Ona"
    type: official
    publisher: OpenAI
    date: 2026-06-11
    accessed: 2026-06-18
    archive_url: https://web.archive.org/web/*/https://openai.com/index/openai-to-acquire-ona/
  - url: https://www.bloomberg.com/news/articles/2026-06-11/openai-to-acquire-cloud-platform-ona-to-support-ai-agents
    title: "OpenAI to Acquire Cloud Platform Ona to Support AI Agents"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-06-11
    accessed: 2026-06-18
actors:
  - id: openai
    role: subject
  - id: ona
    role: counterparty
regions: [US, DE]
tags: [acquisition, codex, agentic-ai, cloud-infrastructure, developer-tools, execution-environment]
threads: []
related: []
state: published
revision:
  created: 2026-06-18
  last_reviewed: 2026-06-18
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On June 11, 2026, OpenAI announced it will acquire Ona — a German cloud development company formerly known as Gitpod — to provide persistent cloud execution environments for Codex, its AI coding agent. The deal brings Ona's platform for running AI agents inside customer-controlled cloud sandboxes into OpenAI's Codex infrastructure, which reported more than 5 million weekly users at the time of announcement. Deal terms were not disclosed; the transaction remained subject to customary regulatory approval.

## What Happened

OpenAI published the acquisition announcement on June 11, 2026. Ona's co-founder and CEO Johannes Landgraf and the full Ona team will join OpenAI's Codex group upon close.

Ona was founded as Gitpod, a German developer-tools company based in Kiel that moved software development from local machines into browser-accessible cloud environments, eliminating local dependency for code editing and execution. The company rebranded to Ona in late 2025, having rebuilt its platform around AI agent orchestration rather than general developer cloud workspaces. By the time of the announcement, Ona's platform had served 2 million developers in secure, reproducible cloud environments.

Codex, OpenAI's AI coding agent, had grown to more than 5 million weekly users by June 2026 — a 400 percent increase from earlier in the year. That growth surfaced a structural constraint: Codex could not sustain long-running coding tasks, those extending hours or days, without a persistent cloud environment. If a developer closed their laptop, the agent's work stopped. Complex tasks — large-scale refactors, automated test-suite generation, iterative debugging across environments — required either keeping machines continuously online or accepting interruption.

Ona's platform resolves this by running agent workloads inside customer-controlled cloud sandboxes. Under the post-acquisition architecture, Codex agents execute within the customer's own cloud infrastructure while OpenAI provides intelligence and orchestration; proprietary source code and intermediate outputs do not cross OpenAI's infrastructure boundary. This separation is material for enterprise customers operating under code confidentiality requirements or regulated-data security policies.

The acquisition terms were not disclosed. The transaction was described as subject to customary closing conditions, with no close date announced as of June 11.

## Why It Matters

The Ona acquisition extends OpenAI's footprint beyond models and interfaces into execution infrastructure — the layer that enterprise agentic deployments depend on but that model providers have not historically owned. Before the deal, Codex agent execution ran on OpenAI-controlled infrastructure; after close, OpenAI will offer customers execution within their own cloud boundary, a requirement that enterprise security policies frequently impose on systems handling proprietary source code.

The acquisition reflects a pattern that emerged across AI labs in 2025–2026: model providers acquiring adjacent infrastructure to own more of the stack. Anthropic made four acquisitions in a six-month window ending May 2026, including Bun (JavaScript runtime), Stainless (SDK and MCP tooling), and Vercept (computer-use infrastructure). OpenAI's Ona acquisition follows the same logic applied to cloud execution. Whether vertical integration into execution environments is technically necessary, or whether existing hyperscaler sandbox services could substitute, is not yet settled.

What is not established by the announcement: whether Ona's execution platform offers differentiated technical properties beyond what AWS, Azure, or GCP sandbox products provide, and whether enterprise customers would independently pay for this capability absent OpenAI's bundling. The acquisition also puts OpenAI in the position of being both a provider of the intelligence running inside enterprise clouds and the provider of the execution infrastructure housing it — a combination with implications for data access and audit visibility that enterprise security teams will scrutinize at deployment.
