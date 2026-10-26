---
id: agentic-ai-foundation-agent-skills-four-projects
title: "Agentic AI Foundation Takes In Anthropic's Agent Skills and Three Other Projects, Reaching 10"
date: 2026-10-22
category: industry
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation
    title: "Donating Agent Skills to the Agentic AI Foundation"
    type: official
    publisher: Anthropic
    date: 2026-10-22
    accessed: 2026-10-26
    archive_url: https://web.archive.org/web/20261026090035/https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation
  - url: https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox
    title: "Agentic AI Foundation Announces Four New Projects: Agent Skills, Open Responses, OpenEnv, and OpenSandbox"
    type: official
    publisher: Linux Foundation
    date: 2026-10-22
    accessed: 2026-10-26
    archive_url: https://web.archive.org/web/*/https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox
  - url: https://simonwillison.net/2026/Oct/22/donating-agent-skills/
    title: "Donating Agent Skills to the Agentic AI Foundation"
    type: secondary_reporting
    publisher: Simon Willison
    date: 2026-10-22
    accessed: 2026-10-26
actors:
  - id: anthropic
    role: subject
  - id: linux-foundation
    role: related-body
  - id: openai
    role: participant
  - id: hugging-face
    role: participant
  - id: alibaba
    role: participant
regions: [global]
tags: [agent-skills, open-standards, agentic-ai-foundation, linux-foundation, governance, interoperability]
threads: [ai-agents-era]
related: [mcp-agentic-ai-foundation-donation]
state: published
revision:
  created: 2026-10-26
  last_reviewed: 2026-10-26
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 22, 2026, Anthropic donated Agent Skills, its open format for packaging instructions and scripts that AI agents load on demand, to the Agentic AI Foundation (AAIF) under the Linux Foundation.
The AAIF announced the same day that it had accepted four projects: Agent Skills from Anthropic, Open Responses from OpenAI, OpenEnv from Hugging Face and OpenSandbox from Alibaba.
The additions brought the foundation to 10 hosted projects, up from the three it launched with in December 2025.
Anthropic said more than 70 agent platforms, including ChatGPT, Cursor, GitHub Copilot and VS Code, had integrated Agent Skills.

## What Happened

Anthropic introduced skills in October 2025 while building Claude Code.
A skill is a folder containing a SKILL.md file that teaches an agent a specific task, along with any scripts or reference material it needs.
In December 2025 Anthropic published the format as an open standard under its own GitHub organization and the agentskills.io domain.
In its October 22 post Anthropic said that so far 1 million skills had been published and "nearly 280 million installed."

The donation covers the Agent Skills name and logo, the GitHub organization and the agentskills.io domain.
Anthropic said engineers from Anthropic, Google, OpenAI and other companies will maintain the standard as individuals, with David Soria Parra and Mahesh Murag as lead maintainers.
It proposed a first roadmap of versioned releases, a formal proposal process and security guidance for people who write and install skills, and said developers can keep using the standard without joining the AAIF.

The AAIF announcement was released at 16:00 UTC from AGNTCon + MCPCon North America in San Jose.
It described the four projects as covering four layers of agent infrastructure.
Open Responses is a specification for model interfaces that work across providers, based on OpenAI's Responses API.
OpenEnv is a framework and hub for reinforcement-learning environments that expose MCP and the Gym training interface; Hugging Face's Ben Burtenshaw said its committee had built and used it at Hugging Face, Microsoft, Reflection, Meta-PyTorch, Modal, Prime Intellect and other organizations.
OpenSandbox is a sandbox platform from Alibaba with Docker and Kubernetes runtimes for coding agents, agent evaluation and reinforcement-learning training.
The four joined A2A, Agent Router, agentgateway, AGENTS.md, goose and MCP as AAIF projects.

## Why It Matters

The donation repeats the step Anthropic took with the Model Context Protocol ten months earlier, when MCP was one of the AAIF's three founding projects.
With Agent Skills and Open Responses added, the foundation now holds specifications that Anthropic and OpenAI each first wrote around their own products.
The AAIF's CTO, Manik Surtani, said in the release that four different companies "chose to contribute them to neutral governance."

What the transfer changes in practice is not yet known.
The AAIF announcement gave no adoption figures of its own, and the 70-platform and 280-million-install numbers come from Anthropic.
Whether the AAIF's process produces versioned releases and security guidance for skills, as Anthropic proposed, will show how much of the standard's direction moves from Anthropic to the foundation's process.
