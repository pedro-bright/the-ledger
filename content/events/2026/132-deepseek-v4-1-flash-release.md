---
id: deepseek-v4-1-flash-release
title: "DeepSeek Releases V4.1-Flash, a 552B Open-Weight Multimodal Model Built Around KV Cache Compression That It Says Outperforms Its Own V4-Pro Flagship"
date: 2026-09-10
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash
    title: "DeepSeek-V4.1-Flash Model Card"
    type: primary_document
    publisher: DeepSeek AI
    date: 2026-09-10
    accessed: 2026-09-13
    archive_url: https://web.archive.org/web/20260910055823/https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash
  - url: https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf
    title: "DeepSeek-V4.1-Flash: Pushing the Limits of KV Cache Compression (Technical Report)"
    type: primary_document
    publisher: DeepSeek AI
    date: 2026-09-10
    accessed: 2026-09-13
    archive_url: https://web.archive.org/web/*/https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf
  - url: https://www.bloomberg.com/news/articles/2026-09-10/deepseek-s-new-low-cost-model-deals-a-fresh-blow-to-openai-z-ai
    title: "DeepSeek's New Low-Cost Model Deals a Fresh Blow to OpenAI, Z.ai"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-09-10
    accessed: 2026-09-13
actors:
  - id: deepseek
    role: subject
  - id: hugging-face
    role: distribution-partner
regions: [CN]
tags: [open-weights, mixture-of-experts, model-release, chinese-ai, kv-cache, inference-efficiency, mit-license, multimodal, price-compression]
threads: [open-vs-closed-weights]
related: [deepseek-v4-pro-release, glm-5-3-flash-stealth-launch-open-weights, qwen3-8-max-open-weights, deepseek-first-external-funding, nsa-cisa-fbi-distillation-advisory-aa26-251a]
state: published
revision:
  created: 2026-09-13
  last_reviewed: 2026-09-13
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 10, 2026, DeepSeek published the weights of DeepSeek-V4.1-Flash on Hugging Face under the MIT license, together with a 51-page technical report.
The model is a 552-billion-parameter mixture-of-experts system that accepts images and text, supports a one-million-token context, and uses what DeepSeek calls a Causal Encoder-Decoder architecture in which only 8 billion parameters are active per token while reading input and 16 billion while generating output.
The report presents the release as an exercise in key-value cache compression, cutting the per-token cache held in GPU memory to 890 bytes, roughly a quarter of the previous DeepSeek-V4-Flash, and the company's vendor-run benchmark tables show the new model ahead of its 1.6-trillion-parameter V4-Pro flagship on most agentic coding tasks.
Bloomberg reported the launch as a further blow to OpenAI and Z.ai, framed around price.

## What Happened

The `deepseek-ai/DeepSeek-V4.1-Flash` repository was created on Hugging Face at 02:17 UTC on September 10 and by September 13 recorded roughly 244,000 downloads and 2,100 likes.
The weights are released under the MIT license with no field-of-use restrictions, matching the terms DeepSeek used for V4-Pro and V4-Flash in April, and the repository includes the technical report, a reference implementation of the prompt encoding, weight-conversion and local-inference instructions, and a script for reproducing the DeepSWE benchmark results.
The release does not include a Jinja chat template; DeepSeek instead points to a separately released Rust library with Python bindings that encodes conversations into the V4 and V4.1 prompt formats.

The architecture is the substance of the release.
The technical report describes a 40-layer Transformer split into a 20-layer causal encoder and a 20-layer decoder, in which the decoder's global key-value cache is projected from the final encoder hidden states rather than computed at each decoder layer.
That is what allows the asymmetric activation, 8 billion parameters per token during prefill and 16 billion during decode, which the report says "substantially improv[es] cost efficiency for input-heavy agentic workloads."
Each layer uses a mixture of one shared and 384 routed experts, with six routed experts active per token.
Attention uses a second version of DeepSeek's Compressed Sparse Attention, which assigns each layer one of three static modes, Full, Reindex or Reuse, so that main key-value entries and sparse-attention indices are shared across layers, and stores the main cache in FP4.
The report puts the resulting global cache at 890 bytes per token, about one-quarter of V4-Flash and, by DeepSeek's own chart, a 437-fold reduction relative to its first-generation model; a deployment technique it calls SWA Bounded Replay reconstructs sliding-window state on demand and cuts the persistent cache held on SSD or in host memory to roughly one-eighth of V4-Flash.
Other components include a 196-billion-parameter conditional memory module accessed by token lookup, a speculative-decoding scheme, and a vision encoder trained from scratch that is fed to the language model from the start of pre-training.

DeepSeek reports pre-training on a 45-trillion-token multimodal corpus at a fixed batch size of 100.6 million tokens, using the Muon optimizer for linear layers, with a 64,000-token sequence length extended to one million tokens after 34 trillion tokens, and states that training ran "with no instability."
Post-training follows supervised fine-tuning, reinforcement learning and on-policy distillation, with the report attributing gains to large-scale automated synthesis of agent tasks and environments rather than to algorithmic changes.
The instruct model exposes an integer reasoning-effort setting from 1 to 100.

The benchmark tables are DeepSeek's own and had not been independently replicated at the time of publication.
Against the base models, V4.1-Flash-Base exceeds V4-Pro-Base on MMLU-Pro (74.1 versus 73.5), HumanEval (79.4 versus 76.8) and GSM8K, but trails it on SimpleQA-Verified (42.3 versus 55.2), LongBench-V2 (45.2 versus 51.5) and MATH.
For the instruct model at maximum reasoning effort, the card reports 90.6 on Terminal-Bench 2.1 and 74.2 on DeepSWE v1.1, figures it places above Claude Opus 5.0, GPT-5.6 Sol, Kimi K3, GLM-5.3 and V4-Pro, along with a Codeforces rating of 3471, 88.1 on CyberGym, 54.8 on AutomationBench and 31.8 on Agent's Last Exam.
On the hardest tasks the gap runs the other way: 30.0 on Terminal-Bench 3.0 and 31.2 on Terminal-Bench 4.0 against 43.3 and 51.8 for Opus 5.0, 20.3 on ProgramBench against 37.0, 36.8 on Humanity's Last Exam against 56.3, and 15.3 on ExploitGym against 33.7 for GPT-5.6 Sol.
The card also shows results varying by agent scaffold, from 65.5 to 74.2 on DeepSWE depending on the harness, with the top figure under the mini-SWE harness and 69.8 under Claude Code.
The report's own limitations section states that benchmark parity "does not imply that the model matches the frontier capabilities of leading closed-source systems on complex, high-difficulty reasoning and edge cases," and that the new sparse-attention and cache-replay mechanisms "create robustness boundaries that have yet to be fully characterized."

The release came two days after the NSA, CISA and FBI advisory that named DeepSeek among six Chinese companies accused of industrial-scale distillation of US models, and three months after the company's first external funding round.

## Why It Matters

The interesting claim is not the benchmark placement but the cost structure it is built on.
Agentic workloads read far more than they write, and the report's design choices, an encoder that does the reading with half the active parameters, a cache small enough to keep more sessions resident in GPU memory, and a replay scheme that keeps less on disk, target the serving economics of long-running agents rather than headline capability.
If the reported efficiency holds outside DeepSeek's own infrastructure, it lowers the hardware floor for running a model of this class, which matters for the domestic-silicon constraints documented in the V4-Pro entry and for anyone else serving open weights.
The company's statement that the smaller model now exceeds its own flagship on most agentic tasks, five months after V4-Pro's release, is also a data point on how quickly the cost of a given capability level is falling on the open-weight side.

Several things are not established.
Every number above is vendor-run, the comparison models were evaluated under DeepSeek's chosen settings, and the report itself concedes that saturated benchmarks understate the remaining gap on difficult reasoning.
The efficiency figures are stated relative to DeepSeek's previous model, not to competitors', and the persistent-cache reduction depends on a deployment technique that outside operators would have to reimplement.
The model ships with reported scores on cyber-exploitation benchmarks under a license that permits any use, in the same month that OpenAI restricted access to Astra's cyber capabilities; whether open-weight releases at this level draw the attention of the agencies that named DeepSeek two days earlier is not yet known.
