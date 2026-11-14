---
id: meta-llama-research-release
title: "Meta Releases LLaMA to Researchers, and Its Weights Leak Within a Week"
date: 2023-02-24
category: open-source
significance: major
confidence: high
sources:
  - url: https://ai.meta.com/blog/large-language-model-llama-meta-ai/
    title: "Introducing LLaMA: A foundational, 65-billion-parameter large language model"
    type: primary_document
    publisher: Meta AI
    date: 2023-02-24
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230224160908/https://ai.facebook.com/blog/large-language-model-llama-meta-ai/
  - url: https://arxiv.org/abs/2302.13971
    title: "LLaMA: Open and Efficient Foundation Language Models"
    type: primary_document
    publisher: arXiv
    date: 2023-02-27
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230303112615/https://arxiv.org/abs/2302.13971
  - url: https://www.theverge.com/2023/2/24/23613512/meta-llama-ai-research-large-language-model
    title: "Meta has a new machine learning language model to remind you it does AI too"
    type: secondary_reporting
    publisher: The Verge
    date: 2023-02-24
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230226025826/https://www.theverge.com/2023/2/24/23613512/meta-llama-ai-research-large-language-model
  - url: https://www.theverge.com/2023/3/8/23629362/meta-ai-language-model-llama-leak-online-misuse
    title: "Meta's powerful AI language model has leaked online - what happens now?"
    type: secondary_reporting
    publisher: The Verge
    date: 2023-03-08
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230309142514/https://www.theverge.com/2023/3/8/23629362/meta-ai-language-model-llama-leak-online-misuse
  - url: https://www.blumenthal.senate.gov/newsroom/press/release/blumenthal-and-hawley-demand-answers_warn-of-misuse-after-leak-of-metas-ai-model
    title: "Blumenthal & Hawley Demand Answers & Warn of Misuse After \"Leak\" of Meta's AI Model"
    type: primary_document
    publisher: Office of Senator Richard Blumenthal
    date: 2023-06-06
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230613224642/https://www.blumenthal.senate.gov/newsroom/press/release/blumenthal-and-hawley-demand-answers_warn-of-misuse-after-leak-of-metas-ai-model
actors:
  - id: meta-ai
    role: developer
  - id: mark-zuckerberg
    role: executive
  - id: josh-hawley
    role: legislator
regions: [US]
tags: [open-weights, large-language-model, model-leak, research-access, noncommercial-license]
threads: [open-vs-closed-weights]
related: [meta-llama-2-release, meta-llama-3-release, mistral-7b-release]
state: published
revision:
  created: 2026-11-14
  last_reviewed: 2026-11-14
  draft_assistance: ai-assisted
---

## Summary

On February 24, 2023, Meta announced LLaMA, a family of four large language models of 7 billion to 65 billion parameters, and offered the weights to researchers under a noncommercial license granted case by case.
Meta reported that the 13-billion-parameter model outperformed OpenAI's much larger GPT-3 on most benchmarks.
On March 3 the weights were posted as a torrent on 4chan and spread across the internet, which put a model close to the state of the art into anyone's hands and made LLaMA an early test case in the public argument over whether powerful model weights should be released.

## What Happened

Meta's AI research group announced LLaMA (Large Language Model Meta AI) in a blog post and a research paper.
The models came in 7B, 13B, 33B and 65B parameter sizes; the two largest were trained on 1.4 trillion tokens and the smallest on one trillion, using public data in the 20 languages with the most speakers.
Meta argued that smaller models trained on more data were easier for researchers without large computing budgets to retrain, study and fine-tune.
To "maintain integrity and prevent misuse," Meta released the models under a noncommercial license focused on research, with access granted case by case to academic researchers, government, civil society and industry research labs.
Mark Zuckerberg announced the release on Facebook, saying Meta was "committed to this open model of research."

The research paper claimed that LLaMA-13B outperformed the 175-billion-parameter GPT-3 on most benchmarks, and that LLaMA-65B was competitive with DeepMind's Chinchilla-70B and Google's PaLM-540B.
LLaMA was a base model without the conversational fine-tuning of ChatGPT, so it was a research tool rather than a product.

About a week after Meta began approving access requests, a downloadable torrent of the weights was posted on 4chan on March 3, 2023, and spread through AI communities.
The Verge reported that researchers who compared the leaked files with the official release confirmed they matched.
Meta's Joelle Pineau said in a statement that "some have tried to circumvent the approval process."
On June 6, 2023, Senators Richard Blumenthal and Josh Hawley wrote to Mark Zuckerberg questioning whether Meta had assessed the risks of releasing LLaMA and asking how many people had received access before the leak.

## Why It Matters

Meta offered outside researchers weights that it said matched or beat much larger closed models, and the leak made that access effectively universal.
Because LLaMA-13B could run on a single data-center GPU, people well outside large labs could now run, study and fine-tune a model close to the state of the art, which Shawn Presser, one of the researchers who helped spread the leaked files, told The Verge was "a huge leap."
Meta's next release, Llama 2 in July 2023, was licensed for commercial use, so the research-only gate of February lasted five months.

The leak became an early reference point in the open-versus-closed debate.
Critics quoted by The Verge called open release "a terrible idea" that would bring personalized spam and phishing; supporters argued that wide access was needed to find and fix the problems of language models.
The senators' letter brought the question to Congress, and it raised a point that later policy debates about open-weight models kept returning to: once weights are out, no access policy can call them back.
