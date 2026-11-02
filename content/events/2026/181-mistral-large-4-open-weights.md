---
id: mistral-large-4-open-weights
title: "Mistral Releases the Weights of Mistral Large 4, a 1-Trillion-Parameter Model Pitched for Defensive Cybersecurity"
date: 2026-10-29
category: open-source
significance: notable
confidence: high
sources:
  - url: https://mistral.ai/news/mistral-large-4-oss/
    title: "Mistral Large 4 (Le Chonk) is now open weight"
    type: official
    publisher: Mistral AI
    date: 2026-10-29
    accessed: 2026-11-02
    archive_url: https://web.archive.org/web/20261029141730/https://mistral.ai/news/mistral-large-4-oss/
  - url: https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B
    title: "Mistral-Large-4-1T-A52B Model Card"
    type: primary_document
    publisher: Mistral AI
    date: 2026-10-29
    accessed: 2026-11-02
    archive_url: https://web.archive.org/web/20261101100540/https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B
  - url: https://huggingface.co/blog/mistral-large4
    title: "Welcome Le Chonk: Mistral Large 4 on Hugging Face"
    type: official
    publisher: Hugging Face
    date: 2026-10-29
    accessed: 2026-11-02
    archive_url: https://web.archive.org/web/20261030071059/https://huggingface.co/blog/mistral-large4
  - url: https://techcrunch.com/2026/10/29/mistral-releases-weights-for-its-trillion-parameter-ai-model-targeting-cybersecurity/
    title: "Mistral releases weights for its trillion-parameter AI model, targeting cybersecurity"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-29
    accessed: 2026-11-02
actors:
  - id: mistral
    role: subject
  - id: hugging-face
    role: distribution-partner
  - id: microsoft
    role: distribution-partner
  - id: nvidia
    role: partner
regions: [EU]
tags: [open-weights, mixture-of-experts, cybersecurity, model-licensing, sovereign-ai]
threads: [open-vs-closed-weights, sovereign-ai-race]
related: [mistral-large-3-release, mistral-series-d-3b-samsung, glm-5-3-safety-delayed-open-weights, reflection-beam-open-weights, meta-muse-spark-open-weights, openai-trusted-access-cyber]
state: published
revision:
  created: 2026-11-02
  last_reviewed: 2026-11-02
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 29, 2026, Mistral AI published the weights of Mistral Large 4, nicknamed "Le Chonk," on Hugging Face, about three weeks after opening the model to the public as an API preview.
The model card describes a natively multimodal mixture-of-experts model with about 1 trillion total parameters and 49 billion active per token, trained from scratch on 3,800 NVIDIA Grace Blackwell GPUs in Mistral's own data centers in Europe.
Mistral positioned the release around defensive cybersecurity and released it under a modified MIT license that requires companies running a Model-as-a-Service business to obtain a separate commercial license, where its predecessor Mistral Large 3 had used Apache 2.0.

## What Happened

Mistral had introduced Mistral Large 4 earlier in October as a public preview served through its own API, and TechCrunch reported the preview on October 6.
On October 29, Mistral published a post saying it was "releasing the weights of this improved Mistral Large 4," after what it described as three further weeks of reinforcement learning on the preview model.
The checkpoint went up on Hugging Face in FP8 across 54 weight files, with a quantized NVFP4 version for Blackwell GPUs.
The model card lists a 1 million token context window, text and image input with text output, 128 routed experts with 4 active per token plus one shared expert, three selectable reasoning levels, and fluency in more than 160 languages, including every official language of the European Union.
By November 2 the main repository showed about 5,500 downloads.

The license, which Mistral calls the Mistral Ecosystem Open-Weight License, grants the usual MIT permissions to use, modify, fine-tune and sell the model, subject to one added condition: a licensee that "operates a Model as a Service business" must enter a separate commercial license with Mistral before using the model or its derivatives for any commercial purpose.
The license defines Model as a Service as giving third parties inference or post-training access in a way that lets them exercise "meaningful control over the inputs, parameters, or training data," and exempts internal use and products that embed the model's capabilities in specific features.
Mistral priced its own API at $0.70 per million input tokens and $2.10 per million output tokens, and said the model was also available through Microsoft Foundry and NVIDIA-hosted endpoints.

Mistral's post framed the release as a defensive security tool.
It said the model scored 51% on Artificial Analysis's Cyber Index and refused an average of 96.6% of malicious cyber requests drawn from the JailbreakBench, StrongREJECT and AgentHarm benchmarks, which it called "the highest we measure among open models."
The post also reported what Mistral had seen in live traffic since the preview: "Though we observed the model refusing to comply with black-box attacks against live targets, we see a potential for uplift to conduct real attacks. We are modifying our guardrails accordingly, and will continue updating them in the months to come."
Mistral said it was giving enterprise design partners such as Orange Cyberdefense preview access to a separate variant tuned for penetration testing, vulnerability assessment and red-teaming, with access "subject to rigorous vetting and contractual safeguards."
The post carried statements from Booz Allen Hamilton, Cisco, Cloudflare, CrowdStrike, Elastic, Fortinet, Orange Cyberdefense, Rubrik, Zscaler, NVIDIA and the EU cybersecurity agency ENISA, which said it was testing the model to find security vulnerabilities, audit code and analyze defensive logs.

Pierre Stock, Mistral's vice president of science, told TechCrunch that open weights give businesses and governments "access to frontier intelligence to defend yourselves against cyberattacks. Access that can't be cut off by definition because the model is open-weighted."
Hugging Face published a companion post with architecture details, including a 72-layer text decoder that combines Multi-head Latent Attention with a DeepSeek Sparse Attention indexer, and a 1.6-billion-parameter Pixtral vision encoder.

## Why It Matters

Mistral Large 4 is the largest model Mistral has released with open weights, and it extends the pattern set by Z.ai's GLM-5.3 in August: a laboratory publishing weights for a model it describes as capable at finding and exploiting software vulnerabilities, while acknowledging that the same capability can help attackers.
Mistral's approach mirrors the tiered access that OpenAI applies to its cyber-tuned models, with a general model released openly and a more permissive security variant kept behind vetting, except that the general model's weights, and so its safety training, are now outside Mistral's control.
Mistral said it was still updating its guardrails after observing possible uplift for real attacks, but did not say whether those updates would reach the released weights, which anyone who has downloaded them can run without Mistral's involvement.

The license change matters for how "open" European flagship models are understood.
Mistral Large 3 in December 2025 used Apache 2.0 with no commercial carve-outs; Large 4 keeps free use for most companies but reserves hosted resale for Mistral's commercial terms, a restriction that falls on cloud and inference providers in particular.
The benchmark results in Mistral's post are the company's own, and the two launch documents do not fully agree: Hugging Face's post gives 28.3% on Terminal-Bench 4, the figure Mistral reported for the preview, while Mistral's post gives 41% for the released model.
Mistral said a full technical report is "coming soon," so the release shipped without one.
