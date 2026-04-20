---
id: mcp-cross-industry-adoption
title: "OpenAI and Google Adopt Anthropic's Model Context Protocol"
date: 2025-03-26
category: industry
significance: landmark
confidence: high
actors:
  - id: anthropic
    role: subject
  - id: openai
    role: partner
  - id: google-deepmind
    role: partner
  - id: microsoft
    role: partner
regions: [global]
tags: [mcp, agent-protocols, interoperability, sdk, open-standards]
threads: [ai-agents-era]
sources:
  - url: https://techcrunch.com/2025/03/26/openai-adopts-rival-anthropics-standard-for-connecting-ai-models-to-data/
    title: "OpenAI Adopts Rival Anthropic's Standard for Connecting AI Models to Data"
    type: secondary_reporting
    date: 2025-03-26
  - url: https://techcrunch.com/2025/04/09/google-says-itll-embrace-anthropics-standard-for-connecting-ai-models-to-data/
    title: "Google Says It'll Embrace Anthropic's Standard for Connecting AI Models to Data"
    type: secondary_reporting
    date: 2025-04-09
  - url: https://www.anthropic.com/news/model-context-protocol
    title: "Introducing the Model Context Protocol"
    type: official
    date: 2024-11-25
---

## Summary

Within the span of two weeks in late March and early April 2025, OpenAI, Google DeepMind, and Microsoft each announced support for Anthropic's Model Context Protocol — transforming a single-company open standard into the de facto shared infrastructure for AI agent tool integration.

## What Happened

Anthropic had open-sourced MCP in November 2024 as a standardized way for AI models to connect to external tools and data sources. The protocol defined a client-server architecture where MCP servers expose capabilities — file systems, databases, APIs, code execution — and MCP clients (AI assistants and agents) call them in a uniform way.

On March 26, Sam Altman announced that OpenAI would integrate MCP across its Agents SDK, Responses API, and ChatGPT desktop app. The same day, Anthropic shipped MCP version 2, introducing Streamable HTTP as a transport layer and OAuth 2.1 for authentication — upgrades that made the protocol practical for remote hosted servers and enterprise deployments.

On April 9, Demis Hassabis confirmed that Google would integrate MCP into Gemini models and the Vertex AI agent platform. Microsoft followed shortly after, embedding MCP support into Copilot Studio.

## Why It Matters

The simultaneous adoption by OpenAI and Google turned a Anthropic-originated standard into neutral infrastructure — analogous to what HTTP did for documents or OAuth did for identity. Developers building MCP servers now had confidence that their integrations would work across Claude, ChatGPT, Gemini, and Copilot without modification. The entire ecosystem of agent tooling could develop against a single protocol rather than fragmented vendor SDKs.

For Anthropic, the adoption was a rare instance of a safety-focused lab winning a standards race against larger competitors. MCP had been designed with security properties in mind — explicit capability declarations, structured permission scopes — and those properties were now baked into the cross-industry foundation for agent tooling. The MCP v2 additions (Streamable HTTP, OAuth 2.1) signaled that the protocol was being built to handle real production scale, not just research demos.
