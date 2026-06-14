---
id: nvidia-sk-hynix-memory-partnership-2026
title: "NVIDIA and SK hynix Sign Multiyear Partnership to Co-Develop AI Memory"
date: 2026-06-07
category: industry
significance: notable
confidence: high
sources:
  - url: https://nvidianews.nvidia.com/news/sk-hynix-ai-factory
    title: "NVIDIA and SK hynix Announce Multiyear Technology Partnership to Advance Memory for AI Factories"
    type: primary_document
    publisher: NVIDIA Corporation
    date: 2026-06-07
    accessed: 2026-06-14
    archive_url: https://web.archive.org/web/*/https://nvidianews.nvidia.com/news/sk-hynix-ai-factory
  - url: https://www.bloomberg.com/news/articles/2026-06-07/nvidia-sk-hynix-sign-multi-year-pact-to-develop-next-gen-chips
    title: "Nvidia, SK Hynix Sign Multi-Year Deal to Develop Next-Gen AI Memory Chips"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-06-07
    accessed: 2026-06-14
  - url: https://www.bloomberg.com/news/articles/2026-06-07/nvidia-s-ceo-says-new-vera-chip-will-use-sk-hynix-s-memory-chips
    title: "Nvidia's CEO Says New Vera Chip Will Use SK Hynix's Memory Chips"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-06-07
    accessed: 2026-06-14
actors:
  - id: nvidia
    role: subject
  - id: sk-hynix
    role: subject
  - id: jensen-huang
    role: subject
regions: [US, KR]
tags: [hbm4, ai-hardware, memory-supply-chain, vera-rubin, semiconductor-partnership, ai-infrastructure]
threads: []
related: [nvidia-rtx-spark-computex-2026, nvidia-cosmos-3-release]
state: published
revision:
  created: 2026-06-14
  last_reviewed: 2026-06-14
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On June 7, 2026, NVIDIA and SK hynix announced a multiyear technology partnership to co-develop next-generation memory for NVIDIA's AI infrastructure, personal AI, and robotics product lines. The agreement was announced following a meeting in Seoul between NVIDIA CEO Jensen Huang and SK Group Chairman Chey Tae-won. It covers High Bandwidth Memory 4 (HBM4) for NVIDIA's Vera Rubin AI supercomputer platform and Vera CPUs, memory for RTX Spark personal AI systems, and Jetson Thor robotics platforms. Additionally, SK hynix will adopt NVIDIA's CUDA-X libraries and PhysicsNeMo to apply AI to its own semiconductor design and manufacturing workflows.

## What Happened

NVIDIA and SK hynix issued a joint press release on June 7, 2026, announcing a multiyear technology partnership across four domains of collaboration.

The primary scope covers memory co-development for NVIDIA's next hardware generations. SK hynix will supply and co-develop HBM4 for NVIDIA's Vera Rubin AI supercomputer platform — the planned successor to the Blackwell architecture — and for Vera CPUs. Vera Rubin is NVIDIA's next flagship AI datacenter product; HBM4 delivers the memory bandwidth required for frontier model training and large-batch inference. The partnership extends to NVIDIA's RTX Spark personal AI platform, announced at Computex 2026 in May, and to Jetson Thor, NVIDIA's robotics computing system.

A second domain covers the application of NVIDIA tooling to SK hynix's manufacturing. Under the agreement, SK hynix will use NVIDIA CUDA-X libraries and NVIDIA PhysicsNeMo — a physics-based simulation framework — to accelerate semiconductor workflows including Technology Computer-Aided Design (TCAD) simulations and internal engineering codes. The intent, as described in the press release, is to accelerate SK hynix's own chip design cycles using AI.

The announcement was made following a meeting between Jensen Huang and SK Group Chairman Chey Tae-won in Seoul, as reported by Bloomberg on the same date. Huang confirmed in comments reported by Bloomberg that NVIDIA's Vera CPUs would use SK hynix memory chips.

Two days earlier, on June 5, Bloomberg had separately reported that Huang confirmed all three major HBM manufacturers — Samsung Electronics, SK hynix, and Micron Technology — had been certified by NVIDIA for Vera Rubin HBM4 supply and were in production for Q3 2026 shipments. The June 7 announcement distinguished SK hynix's role: certification applies to all three suppliers; the formal multiyear co-development partnership is specific to SK hynix.

## Why It Matters

High Bandwidth Memory is among the most constrained components in the AI hardware supply chain. Unlike commodity DRAM, HBM is produced by only three manufacturers globally and requires stacking multiple DRAM dies using through-silicon via technology, making capacity expansion slower than conventional semiconductor scaling. Each generation of NVIDIA's flagship AI accelerator has required a corresponding HBM generation; the transition from HBM3e on Blackwell to HBM4 on Vera Rubin is a prerequisite for deploying Vera Rubin infrastructure at scale.

By formalizing a multiyear co-development relationship rather than transactional supply arrangements, NVIDIA and SK hynix are structuring memory supply as a long-horizon engineering alignment. The practical consequence is that SK hynix's HBM4 development roadmap is now explicitly tied to NVIDIA's hardware platform roadmap, reducing the risk of specification mismatches that can delay product launches and giving both companies visibility into the other's development timelines years ahead of product release.

The adoption of NVIDIA's AI tooling inside SK hynix's manufacturing process is a secondary but notable aspect of the deal. If AI-accelerated semiconductor simulation materially shortens SK hynix's design iteration cycles, it represents a case where AI capability directly accelerates the pace at which AI-enabling hardware can be produced — a feedback that is modest in scope compared to the AI-coding dynamics Anthropic documented in its June 4 paper, but which operates in a hardware domain where iteration cycles have historically been measured in years, not months.

The partnership does not establish exclusivity. Samsung and Micron remain certified Vera Rubin HBM4 suppliers and will receive portions of NVIDIA's orders. The strategic distinction is that SK hynix is now NVIDIA's formalized co-development partner across the full hardware portfolio — AI infrastructure, personal AI, and robotics — while Samsung and Micron retain supplier-only roles. Whether this translates into pricing advantages, preferential allocation of future HBM capacity, or faster qualification of successive SK hynix memory generations for NVIDIA platforms is not disclosed in the partnership announcement.
