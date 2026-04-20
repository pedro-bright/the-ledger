---
id: google-a2a-protocol-launch
title: "Google Launches Agent2Agent (A2A) Protocol at Cloud Next"
date: 2025-04-09
category: industry
significance: major
confidence: high
actors:
  - id: google
    role: subject
regions: [global]
tags: [a2a, agent-protocols, interoperability, cloud-next, multi-agent, open-standards]
threads: [ai-agents-era]
sources:
  - url: https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
    title: "A2A: A New Era of Agent Interoperability"
    type: official
    date: 2025-04-09
  - url: https://platformengineering.com/features/google-cloud-unveils-agent2agent-protocol-a-new-standard-for-ai-agent-interoperability/
    title: "Google Cloud Unveils Agent2Agent Protocol — A New Standard for AI Agent Interoperability"
    type: secondary_reporting
    date: 2025-04-09
---

## Summary

At Google Cloud Next 2025, Google launched the Agent2Agent (A2A) protocol — an open HTTP/SSE/JSON-RPC standard for cross-vendor agent coordination. With more than 50 ecosystem partners on launch day and an explicit design to complement rather than compete with MCP, A2A addressed a layer of the agent stack that MCP had not: how agents coordinate with other agents.

## What Happened

Google unveiled A2A at its Cloud Next conference alongside a partner coalition that included Salesforce, SAP, Atlassian, ServiceNow, and more than 45 other enterprise software vendors. The protocol defines how AI agents discover each other, delegate tasks, and exchange results — all over standard HTTP with Server-Sent Events for streaming and JSON-RPC as the message format.

Where MCP defines how an agent connects to tools and data sources (the model-to-tool relationship), A2A defines how agents coordinate with other agents (the agent-to-agent relationship). Google positioned the two protocols as complementary layers in an agent stack: an orchestrator agent uses A2A to route tasks to specialist agents, and those specialist agents use MCP to access the tools they need.

The reference implementation was open-sourced immediately, and the specification was submitted to a community governance process with participation from the launch partners.

## Why It Matters

A2A filled a genuine gap in the emerging agent infrastructure. Multi-agent workflows — where one AI coordinates several specialized subagents — had become a common architecture in enterprise deployments, but each implementation was proprietary. A2A gave that coordination layer an open specification, enabling cross-vendor orchestration where a Salesforce agent could, in principle, delegate to a ServiceNow agent without either vendor writing custom integration code.

The timing, on the same day Google confirmed MCP adoption, was notable: Google was simultaneously accepting a competitor's standard (MCP) and proposing its own (A2A). The two-layer framing — MCP for tools, A2A for agents — proved influential and was widely adopted as a conceptual model by the developer community in subsequent months.
