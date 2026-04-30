---
id: ineffable-intelligence-seed-round
title: "David Silver Launches Ineffable Intelligence with $1.1B Seed to Build AI Without Human Data"
date: 2026-04-27
category: research
significance: notable
confidence: medium
sources:
  - url: https://www.bloomberg.com/news/articles/2026-04-27/sequoia-and-nvidia-back-ex-deepmind-researcher-at-5-1-billion-value
    title: "Sequoia and Nvidia Back Ex-DeepMind Researcher's New AI Startup at $5.1 Billion Value"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-04-27
    accessed: 2026-04-30
  - url: https://techcrunch.com/2026/04/27/deepminds-david-silver-just-raised-1-1b-to-build-an-ai-that-learns-without-human-data/
    title: "DeepMind's David Silver just raised $1.1B to build an AI that learns without human data"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-04-27
    accessed: 2026-04-30
actors:
  - id: david-silver
    role: subject
  - id: ineffable-intelligence
    role: subject
  - id: google-deepmind
    role: context
regions: [UK, US]
tags: [reinforcement-learning, pure-rl, ai-funding, seed-round, deepmind-spinout, superintelligence, data-free-learning]
threads: []
related: []
state: published
revision:
  created: 2026-04-30
  last_reviewed: 2026-04-30
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On April 27, 2026, David Silver — UCL professor and former head of Google DeepMind's reinforcement learning team, best known for creating AlphaGo, AlphaZero, AlphaFold, and AlphaProof — announced the launch of Ineffable Intelligence, a UK-based AI company, with a $1.1 billion seed round at a $5.1 billion valuation. The round, co-led by Sequoia and Lightspeed with participation from Nvidia, Google, DST Global, Index Ventures, and the UK's Sovereign AI Fund, is the largest seed round in European history. Ineffable Intelligence's stated mission is to build a "superlearner" — an AI system that acquires knowledge without human-generated training data, using pure reinforcement learning. The thesis constitutes a direct counter-proposal to the human-feedback paradigm that underlies the training pipelines of OpenAI, Anthropic, and Google DeepMind's current frontier models. Silver pledged 100% of his personal equity proceeds to charity through Founders Pledge.

## What Happened

David Silver joined DeepMind in 2013 as part of its founding research team and became head of its reinforcement learning group, the group responsible for AlphaGo (2016), which defeated Go world champion Lee Sedol; AlphaZero (2017), which achieved superhuman performance in chess, shogi, and Go from self-play alone; AlphaFold (2020), which predicted protein structure from sequence with previously unreachable accuracy; and AlphaProof (2024), which demonstrated AI capability in formal mathematical proof generation. Silver left DeepMind in late 2025 to found Ineffable Intelligence.

The $1.1 billion seed round, announced April 27, was co-led by Sequoia Capital and Lightspeed Venture Partners, with additional participation from Nvidia, Google, DST Global, Index Ventures, and the UK Government's Sovereign AI Fund. The valuation at seed of $5.1 billion — before a product has been commercially deployed — is exceptional even by the standards of 2026 AI funding. The company had not disclosed any prior external funding, emerging from stealth with this announcement. Silver described the company's core question as whether AI can achieve broad general intelligence through self-directed exploration, without access to human-generated data at training time.

The "superlearner" concept as described by Silver and reported in Bloomberg and TechCrunch refers to an AI system that learns through trial and error — reinforcement learning — rather than through supervised training on annotated human examples or instruction-tuned responses. The distinction from current frontier models is explicit: GPT-5.5, Claude Opus 4.7, and Gemini 3.1 Pro all rely on training pipelines that include large quantities of human-generated text, human preference signals through RLHF (reinforcement learning from human feedback), and curated instruction datasets. Silver's research direction — that an AI trained through pure RL interaction with an environment can acquire knowledge exceeding what human data can provide — is a bet against the central premise of the current generation of frontier models.

Silver's prior work at DeepMind is the primary empirical support for the thesis. AlphaGo's initial version was trained on human game records; AlphaZero, its successor, was trained purely through self-play with no human data and reached higher performance. AlphaFold used human-curated protein structure databases; AlphaProof moved further toward self-generated training signal. The Ineffable Intelligence thesis extrapolates this trajectory to general intelligence: that as environments become richer and reward signals more sophisticated, the ceiling imposed by human data disappears.

The UK Government's Sovereign AI Fund participation, alongside Google's individual investment (distinct from Google's broader Google DeepMind operations), reflects two independent strategic interests in the company. Silver pledging all personal equity proceeds to charitable causes through Founders Pledge was included in the company announcement.

## Why It Matters

The Ineffable Intelligence founding bet is significant not because $1.1 billion is a large amount in 2026 AI funding — it is, for a seed stage, though multiple larger rounds closed in April 2026 alone — but because of the specific counter-thesis it embeds. The dominant paradigm in frontier AI development as of early 2026 is scaled transformer training on curated internet text, followed by human-feedback alignment. DeepMind, OpenAI, and Anthropic all operate within variations of this paradigm. Silver's departure from DeepMind to pursue a fundamentally different approach, carrying with him the empirical track record of the AlphaGo family of systems, constitutes a credible scientific dissent from that consensus at the highest level of the field.

The AlphaGo/AlphaZero precedent provides concrete evidence for Silver's thesis in narrow domains: self-play RL achieved superhuman performance in chess and Go faster and more completely than training on human games had managed. Whether the same principle can generalize from well-defined board games with clear reward signals to open-ended knowledge acquisition is the unresolved scientific question on which Ineffable Intelligence is staking its existence. The critics of the approach — that real-world environments lack the clean reward structure of Go, and that human data encodes vast amounts of relevant structure that RL from scratch would take decades to rediscover — are well-represented in the field and have not been answered by the company's launch announcement.

What is not known from the public announcement: the specific technical architecture Ineffable Intelligence plans to pursue; the type of environments and reward signals they intend to use; timelines or milestones at which the company considers its approach validated; or whether any of the investor consortium has insight into early research results that informed the investment decision. The $5.1 billion valuation reflects investor belief in Silver's track record and the research direction rather than observable commercial or scientific progress.
