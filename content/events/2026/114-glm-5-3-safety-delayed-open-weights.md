---
id: glm-5-3-safety-delayed-open-weights
title: "Z.ai Publishes GLM-5.3's Weights on Schedule After a Self-Imposed Two-Week Cyber-Safety Hold"
date: 2026-08-28
category: open-source
significance: notable
confidence: high
sources:
  - url: https://huggingface.co/zai-org/GLM-5.3
    title: "GLM-5.3 Model Card"
    type: primary_document
    publisher: Z.ai
    date: 2026-08-28
    accessed: 2026-09-02
    archive_url: https://web.archive.org/web/*/https://huggingface.co/zai-org/GLM-5.3
  - url: https://www.axios.com/2026/08/14/china-open-source-ai-glm-53
    title: "China's Z.ai holds GLM 5.3 release over hacking risks"
    type: secondary_reporting
    publisher: Axios
    date: 2026-08-14
    accessed: 2026-09-02
  - url: https://www.bloomberg.com/news/articles/2026-08-14/z-ai-aims-to-catch-anthropic-openai-in-coding-with-new-ai-model
    title: "Z.ai to Rival Anthropic, OpenAI in Coding With New AI Model"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-08-14
    accessed: 2026-09-02
actors:
  - id: z-ai
    role: subject
  - id: hugging-face
    role: distribution-partner
regions: [CN]
tags: [open-weights, cybersecurity, model-release, chinese-ai, staged-release, model-licensing, dangerous-capabilities]
threads: [open-vs-closed-weights, frontier-safety-policies]
related: [glm-5-3-flash-stealth-launch-open-weights, qwen3-8-max-open-weights]
state: published
revision:
  created: 2026-09-02
  last_reviewed: 2026-09-02
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 14, 2026, the Beijing laboratory Z.ai launched GLM-5.3 as a paid API service and simultaneously announced that it would withhold the model's weights for two weeks, saying the model had become capable enough at finding and exploiting software vulnerabilities that it wanted time to test and harden its safety controls first.
On August 28 the company published the weights on Hugging Face under a custom license, keeping to the announced schedule.
The released checkpoint is a 753-billion-parameter sparse mixture-of-experts model shipped in FP8 across 755 gigabytes.
The sequence is unusual on the record: a laboratory pre-announced a fixed-length safety delay on an open-weights release, named the capability class that prompted it, and then completed the release on the stated timetable.

## What Happened

Z.ai released GLM-5.3 through its API on August 14 and stated at that time that the weights would follow in roughly two weeks, after safety evaluation and hardening.
Axios reported that the company attributed the delay specifically to the model's offensive-security ability, that Z.ai had deliberately trained GLM-5.3 on cyber tasks in controlled environments to improve vulnerability discovery, and that in the interim it was running a tiered access program giving selected security partners use of the model in controlled settings.
Axios also reported Z.ai's acknowledgement that once the weights were public the company would no longer be able to control how the model was modified or used.
Bloomberg covered the same August 14 launch as a coding-focused bid against Anthropic and OpenAI.

The `zai-org/GLM-5.3` repository was created on Hugging Face on August 25 and held privately; the first public commit landed on August 27 at 17:16 UTC under the title "Initial commit 0828," which is August 28 in Beijing time.
The published artifact is 154 files totalling 755.7 gigabytes, with 751.2 billion parameters stored in FP8 and 2.1 billion in BF16, for 753.3 billion in total.
The configuration lists 78 layers, 256 routed experts plus one shared expert with eight routed experts activated per token, a hidden size of 6,144, a 154,880-token vocabulary, a declared context length of 1,048,576 tokens, one multi-token-prediction layer, and a sparse-attention indexer selecting 2,048 positions.
Z.ai states in the model card that GLM-5.3 "uses the same base model as GLM-5.2 — every gain comes from post-training."

The card is unusually direct about why the hold happened.
Under the heading "Emergent Cyber Capability" it says that "as we scaled post-training, cyber capability developed faster than we expected," and that the largest gains appeared "further up the exploitation chain," where the model more than doubles GLM-5.2 on exploitation benchmarks.
The reported figures are 84.5 on CyberGym for vulnerability discovery, above every other model in the card's comparison table including Fable 5 at 83.8 and GPT-5.6 Sol at 83.6; 54.4 on ExploitBench against 24.4 for GLM-5.2; and 105 and 130 solves on ExploitGym at two-hour and six-hour budgets against 29 and 39 for GLM-5.2.
On the exploitation benchmarks GLM-5.3 remains well behind the leading closed models, with Fable 5 at 78.0 and GPT-5.6 Sol at 76.5 on ExploitBench.

These are vendor-run numbers and the card discloses the conditions attached to them.
Nearly all of the agentic evaluations, including every cyber benchmark, were run inside the Claude Code 2.1.207 harness at maximum reasoning effort rather than in a neutral scaffold.
The ExploitGym scores are not wall-clock results: Z.ai rescales API inference time by each model's tokens-per-second rate sourced from Artificial Analysis, using 115 tokens per second for GLM-5.3 against 40 for Kimi K3 and 47 for Qwen3.8-Max, so the two-hour and six-hour budgets are throughput-adjusted rather than measured.
The card also discloses that Z.ai removed anti-cheat checks it judged to produce false positives on the SWE-Marathon `strip-clone` task and on PostTrainBench, substituting model-based inspection.
CyberGym is reported as single-run pass@1 over 1,507 tasks.

The license is not one of the standard open-source licenses.
The `glm-5.3` license grants unrestricted use, modification, distribution and sale, but adds one condition: any licensee operating a "Model as a Service" business whose group revenue exceeds ten billion US dollars over any consecutive twelve months must pass a Z.ai security review, of a scope and method that Z.ai determines, before commercial use.
End-user products that embed model capabilities in specific features, and services that merely relay requests to models hosted elsewhere, are carved out of that definition.
By September 2 the repository recorded roughly 94,400 downloads and 1,488 likes.

## Why It Matters

Staged or delayed release is an old idea in this field — OpenAI's phased GPT-2 rollout in 2019 is the usual reference point — but it has rarely been applied to a frontier-scale open-weights model by a laboratory that then followed through publicly and on time.
What distinguishes this case is the specificity: Z.ai named the capability class, named the benchmark on which the model leads, fixed a duration in advance, and shipped at the end of it.
That produces a checkable record rather than an open-ended commitment, and it establishes a template other laboratories can be measured against.

It also draws the limits of the gesture clearly.
Two weeks is short, and neither the model card nor the reporting cited here describes what the hardening consisted of, what was measured before and after, or who verified it.
Z.ai's own statement that it cannot control downstream modification once weights are public is the operative fact: post-training safety behavior can generally be removed by fine-tuning, so a delay of any length changes what the released artifact can be made to do only insofar as it changes the underlying capability, which Z.ai does not claim it did.
The delay bought evaluation time and produced a public disclosure; it did not produce a containment mechanism.
Whether the interval was calibrated to the risk or to a release calendar cannot be determined from what has been published.

The licensing choice is a third data point in a month of divergent decisions among Chinese laboratories publishing frontier-scale weights.
Alibaba attached a revenue-gated separate-agreement requirement to Qwen3.8-Max on August 12; Z.ai released GLM-5.3-Flash under MIT on August 26; Tencent released Hy4-preview under Apache 2.0 on August 27.
The GLM-5.3 license sits between those poles — permissive by default, with a security-review gate that binds only very large inference providers.
Notably, the condition is a security review rather than a fee or a field-of-use restriction, which reads as continuous with the cyber-capability rationale for the delay rather than as a commercial term.
This event concerns the flagship GLM-5.3 checkpoint and is distinct from the GLM-5.3-Flash release two days earlier, which was a different and smaller model, released under different terms, and recorded separately.
