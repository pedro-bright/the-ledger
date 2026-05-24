---
id: anthropic-stainless-acquisition
title: "Anthropic Acquires Stainless, Taking Control of MCP Toolchain Used by Competitors"
date: 2026-05-18
category: industry
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/news/anthropic-acquires-stainless
    title: "Anthropic acquires Stainless"
    type: official
    publisher: Anthropic
    date: 2026-05-18
    accessed: 2026-05-24
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/news/anthropic-acquires-stainless
  - url: https://techcrunch.com/2026/05/18/anthropic-has-acquired-the-dev-tools-startup-used-by-openai-google-and-cloudflare/
    title: "Anthropic has acquired the dev tools startup used by OpenAI, Google, and Cloudflare"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-05-18
    accessed: 2026-05-24
actors:
  - id: anthropic
    role: subject
  - id: stainless
    role: counterparty
  - id: openai
    role: related-party
  - id: google-deepmind
    role: related-party
regions: [US]
tags: [acquisition, sdk, mcp, developer-tooling, agentic-ai, infrastructure, toolchain]
threads: []
related: []
state: published
revision:
  created: 2026-05-24
  last_reviewed: 2026-05-24
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On May 18, 2026, Anthropic announced the acquisition of Stainless, a developer tooling company that generated SDKs, CLIs, and MCP servers for hundreds of organizations including OpenAI, Google DeepMind, Perplexity, Groq, and Cloudflare. The acquisition price was not disclosed; The Information reported the deal exceeded $300 million. Anthropic announced it will wind down all hosted Stainless products, including its SDK generator service, and redirect the team to the Claude Platform. The deal gives Anthropic control over the model (Claude), the connectivity standard it originated (MCP), and the toolchain most widely used in practice to build connections to AI APIs.

## What Happened

Stainless was founded in 2022 by Alex Rattray, a former Stripe engineer, and was backed by Sequoia Capital and Andreessen Horowitz. The company built software that automated the creation and maintenance of software development kits — the libraries that allow developers to call an API from a given programming language. Stainless had generated every official Anthropic SDK (Python, TypeScript, Go, Java, Ruby) since early in Anthropic's API history, and had also built SDKs for OpenAI, Google DeepMind, Perplexity, Groq, and Cloudflare. Hundreds of additional companies used Stainless's hosted SDK generator to maintain their own API libraries.

In parallel with the SDK work, Stainless had expanded into generating MCP servers — connectors that allow AI agents to access external APIs through Anthropic's Model Context Protocol standard. MCP was introduced by Anthropic in November 2024 and had become the dominant connectivity protocol for agentic AI applications by 2026, adopted by Google's Gemini platform, Microsoft's Copilot, and independent AI coding tools.

Anthropic's announcement stated it would wind down all hosted Stainless products. Existing customers were told they retain ownership of SDKs already generated and have full rights to modify and extend them; the SDK generation service itself will no longer be available. The Stainless team will shift focus to Claude Platform infrastructure.

The acquisition is the fourth Anthropic made in a six-month period: Bun (December 2025), Vercept (February 2026), Coefficient Bio (April 2026), and Stainless (May 2026). The reported price for Stainless — over $300 million — makes it the largest of the four by reported value.

## Why It Matters

Before the acquisition, Stainless occupied a neutral position in the AI developer ecosystem: a third-party infrastructure provider whose work happened to serve competing AI labs simultaneously. Its acquisition removes that neutrality. Anthropic now controls the model, the connectivity standard, and — through Stainless — the toolchain that most organizations used in practice to build that connectivity.

The strategic weight falls most heavily on the MCP server generation capability. MCP has become a de facto standard for agent-to-API connectivity. Anthropic originated MCP; it now owns the most widely used tooling for implementing it. Whether Anthropic maintains the quality and pace of MCP tooling for connections to non-Claude services, or whether the tooling gradually tilts toward Claude-native workflows, will affect the neutrality of the standard itself.

What is not yet clear: whether OpenAI, Google, and other labs that used Stainless's hosted service will build internal replacements, adopt alternative tooling, or shift toward alternative connectivity protocols. The wind-down of hosted products gives those organizations a transition period, but it removes access to a tool that had become embedded in their SDK maintenance pipelines. The medium-term effect on the competitive landscape of agentic tooling depends substantially on how quickly alternatives emerge.

---
