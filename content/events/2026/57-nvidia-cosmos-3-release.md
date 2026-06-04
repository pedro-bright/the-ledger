---
id: nvidia-cosmos-3-release
title: "NVIDIA Releases Cosmos 3, First Open Omnimodal Physical AI World Model"
date: 2026-06-01
category: open-source
significance: notable
confidence: high
sources:
  - url: https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-3-the-open-frontier-foundation-model-for-physical-ai
    title: "NVIDIA Launches Cosmos 3, the Open Frontier Foundation Model for Physical AI"
    type: official
    publisher: NVIDIA Newsroom
    date: 2026-06-01
    accessed: 2026-06-04
    archive_url: https://web.archive.org/web/*/https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-3-the-open-frontier-foundation-model-for-physical-ai
  - url: https://research.nvidia.com/labs/cosmos-lab/cosmos3/technical-report.pdf
    title: "Cosmos 3: Omnimodal World Models for Physical AI"
    type: primary_document
    publisher: NVIDIA Research
    date: 2026-06-01
    accessed: 2026-06-04
    archive_url: https://web.archive.org/web/*/https://research.nvidia.com/labs/cosmos-lab/cosmos3/technical-report.pdf
  - url: https://www.axios.com/2026/06/01/nvidia-ai-push-cosmos-3-world-model
    title: "Nvidia's Cosmos 3 open AI world model helps robots, autonomous vehicles"
    type: secondary_reporting
    publisher: Axios
    date: 2026-06-01
    accessed: 2026-06-04
actors:
  - id: nvidia
    role: subject
regions: [global]
tags: [physical-ai, open-source, robotics, world-models, omnimodal, autonomous-vehicles]
threads: []
related: [nvidia-rtx-spark-computex-2026]
state: published
revision:
  created: 2026-06-04
  last_reviewed: 2026-06-04
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On June 1, 2026, NVIDIA released Cosmos 3 at GTC Taipei — an open-weight world foundation model designed to jointly process and generate text, images, video, ambient sound, and robot and vehicle action trajectories within a single architecture. NVIDIA described it as the first model to unify physical reasoning, world generation, and action prediction across all major sensor modalities under an open license. Both variants — Cosmos3-Nano (16B total parameters) and Cosmos3-Super (64B total parameters) — were published on Hugging Face under terms permitting commercial use on the day of release.

## What Happened

NVIDIA announced Cosmos 3 at its GTC Taipei event on June 1, 2026. The release is the third generation of NVIDIA's Cosmos world foundation model series. Earlier generations focused on video generation; Cosmos 3 extends the scope to include physical action sequences alongside every major visual and audio modality.

The architectural design departs from the single-transformer tower used in Cosmos 1 and Cosmos 2. Cosmos 3 uses a two-tower mixture-of-transformers design: a reasoning transformer that processes inputs and builds a world-state representation, and a separate expert generation transformer that uses that representation to produce outputs. NVIDIA's technical report describes the towers as jointly trained, with the design permitting independent fine-tuning of either tower — a property the company positioned as useful for robotics researchers who need to adapt the generation component to specific hardware platforms without retraining the reasoning component.

NVIDIA released two variants. Cosmos3-Nano pairs an 8-billion-parameter reasoning backbone with an 8-billion-parameter generation backbone for a total of 16 billion parameters. It is intended for workstations and development environments where inference must run on available compute. Cosmos3-Super pairs 32-billion + 32-billion-parameter towers for a total of 64 billion parameters and is aimed at data-center use. NVIDIA stated that a Cosmos3-Edge variant optimized for real-time edge inference is in development but was not released on June 1.

NVIDIA's technical report claimed first place among open-weight models on the Artificial Analysis Text-to-Image and Image-to-Video leaderboards and top position on RoboArena's open-weight policy model ranking at time of submission. The report also cited first-place rankings on the Physics-IQ, PAI-Bench, and RoboLab open-weight leaderboards. HuggingFace's daily papers list for June 4 ranked the Cosmos 3 technical report first with 8,680 upvotes, a high figure for a model paper in the community's daily digest.

Alongside the model release, NVIDIA announced the Cosmos Coalition: a group of AI labs and robotics developers — including Agile Robots, Black Forest Labs, Generalist, LTX, Runway, and Skild AI — intended to use Cosmos 3 as a foundation for specialized downstream models. Model weights are available on Hugging Face and NVIDIA's GitHub repository.

## Why It Matters

Prior to Cosmos 3, building physical AI systems typically required assembling multiple specialized models: a visual language model for scene understanding, a video generation model for simulation and synthetic data, and a separate policy model for action generation. Each component had its own training pipeline and learned representation space, and fine-tuning one component to a new physical environment could degrade the others. Cosmos 3's unified architecture shares a world representation across all output modalities, which NVIDIA argues enables more coherent simulation of physical cause and effect.

Whether this architectural consolidation proves durable in production settings — or whether task-specific models will continue to outperform generalist architectures in commercial robotics and autonomous vehicle deployment — is an open question. NVIDIA's benchmark rankings at release were drawn from evaluations conducted or submitted by NVIDIA. Independent leaderboard confirmations from RoboArena and Artificial Analysis support some claims, though cross-architecture comparisons are complicated by the absence of standardized evaluation conditions across model families and the rapid pace of competing releases in the same week.

The open-weight release under commercially permissive terms makes Cosmos 3 the most capable openly licensed physical AI world model available as of June 2026. For organizations developing robotics and autonomous vehicle systems outside the largest vertically integrated companies, this lowers the effective cost of world model training and synthetic data generation — both of which have historically required proprietary data-collection infrastructure. The Cosmos Coalition structure provides a coordination mechanism for specialized derivatives, though whether coalition relationships translate to sustained collaborative development will depend on downstream commercialization dynamics that are not yet visible.

