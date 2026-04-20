---
id: google-project-mariner-io-2025
title: "Google Rolls Out Project Mariner Multi-Task Browser Agent"
date: 2025-05-20
category: models
significance: major
confidence: high
actors:
  - id: google-deepmind
    role: subject
regions: [global]
tags: [agents, computer-use, browser-agent, gemini, google-io, cloud-vm, parallel-tasks]
threads: [ai-agents-era]
sources:
  - url: https://techcrunch.com/2025/05/20/google-rolls-out-project-mariner-its-web-browsing-ai-agent/
    title: "Google Rolls Out Project Mariner, Its Web-Browsing AI Agent"
    type: secondary_reporting
    date: 2025-05-20
  - url: https://deepmind.google/models/project-mariner/
    title: "Project Mariner"
    type: official
    date: 2025-05-20
  - url: https://blog.google/innovation-and-ai/technology/ai/io-2025-keynote/
    title: "Google I/O 2025 Keynote"
    type: primary_recording
    date: 2025-05-20
---

## Summary

At Google I/O 2025, Google DeepMind announced the broader rollout of Project Mariner — a Gemini-powered browser agent that can execute up to ten web tasks in parallel inside isolated cloud virtual machines. Available first to AI Ultra subscribers, Mariner was also opened to developers via the Gemini API and Vertex AI.

## What Happened

Project Mariner had been previewed in late 2024 as a research prototype. At I/O 2025, Google announced it was moving to a production rollout with several significant upgrades. The most notable architectural change was parallelism: Mariner could now run up to ten concurrent browser sessions, each in its own isolated Google Cloud VM, allowing users to dispatch multiple research or automation tasks simultaneously rather than sequentially.

The rollout was tiered. Google's AI Ultra plan ($249.99/month) received access first, bundling Mariner alongside other premium Gemini capabilities. Developers could access Mariner programmatically through the Gemini API and through Vertex AI for enterprise integrations. The VM isolation architecture — each task running in a sandboxed environment — was highlighted as a security and reliability feature, preventing cross-task contamination and enabling clean rollback on failure.

Mariner used Gemini's multimodal capabilities to perceive and interact with web interfaces, supporting a range of tasks from price comparison and form completion to multi-step research workflows.

## Why It Matters

Project Mariner's parallel VM architecture represented a meaningful step beyond single-session computer-use agents. Rather than a model that could do one thing at a time, Mariner enabled a model of ambient delegation: users could queue multiple tasks and let the agent work through them asynchronously. That framing — agent as background worker rather than foreground assistant — would become increasingly important as agent session length extended through 2025.

The tiered rollout also reflected a broader pricing dynamic: the most capable agent features were positioned as justifications for premium subscription tiers. Project Mariner's inclusion in the AI Ultra bundle signaled that agent capabilities, rather than model intelligence alone, were becoming the primary differentiator between consumer AI tiers.
