---
id: nsa-cisa-fbi-distillation-advisory-aa26-251a
title: "NSA, CISA and FBI Name Six Chinese AI Companies in a Joint Advisory on Industrial-Scale Distillation of US Models"
date: 2026-09-08
category: policy
significance: notable
confidence: high
sources:
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-251a
    title: "China-Based Artificial Intelligence Companies Conducting Industrial-Scale Distillation Campaigns Against U.S. AI Companies (AA26-251A)"
    type: official
    publisher: Cybersecurity and Infrastructure Security Agency
    date: 2026-09-08
    accessed: 2026-09-11
    archive_url: https://web.archive.org/web/20260910225208/https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-251a
  - url: https://www.whitehouse.gov/wp-content/uploads/2026/04/NSTM-4.pdf
    title: "National Science and Technology Memorandum 4: Adversarial Distillation of American AI Models"
    type: official
    publisher: White House Office of Science and Technology Policy
    date: 2026-04-23
    accessed: 2026-09-11
    archive_url: https://web.archive.org/web/20260910154113/https://www.whitehouse.gov/wp-content/uploads/2026/04/NSTM-4.pdf
  - url: https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks
    title: "Detecting and preventing distillation attacks"
    type: official
    publisher: Anthropic
    date: 2026-02-23
    accessed: 2026-09-11
    archive_url: https://web.archive.org/web/20260911115838/https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks
  - url: https://www.bloomberg.com/news/articles/2026-09-09/us-says-alibaba-deepseek-have-systematically-siphoned-ai-models
    title: "US Says Alibaba, DeepSeek Have 'Systematically' Siphoned AI Models"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-09-09
    accessed: 2026-09-11
  - url: https://www.nbcnews.com/tech/tech-news/us-accuses-china-ai-developers-deepseek-alibaba-copying-american-ai-rcna596696
    title: "U.S. agencies say top Chinese AI companies systematically copied American models"
    type: secondary_reporting
    publisher: NBC News
    date: 2026-09-08
    accessed: 2026-09-11
actors:
  - id: us-nsa
    role: author
  - id: us-cisa
    role: author
  - id: us-fbi
    role: author
  - id: white-house
    role: context
  - id: deepseek
    role: subject
  - id: moonshot-ai
    role: subject
  - id: alibaba
    role: subject
  - id: minimax
    role: subject
  - id: stepfun
    role: subject
  - id: z-ai
    role: subject
  - id: chinese-government
    role: counterparty
  - id: anthropic
    role: related-party
  - id: openai
    role: related-party
  - id: google-deepmind
    role: related-party
  - id: xai
    role: related-party
regions: [US, CN]
tags: [distillation, us-china, cybersecurity-advisory, attribution, export-controls, api-security, chain-of-thought, chinese-ai]
threads: []
related: [anthropic-open-weights-policy-position, anthropic-fable-covert-capability-degradation, deepseek-v4-pro-release, deepseek-r1-distill-impact, bis-h200-tariff-january-2026]
state: published
revision:
  created: 2026-09-11
  last_reviewed: 2026-09-11
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 8, 2026, the National Security Agency, the Cybersecurity and Infrastructure Security Agency and the FBI published joint Cybersecurity Advisory AA26-251A, stating that DeepSeek, Moonshot AI, Alibaba, MiniMax, StepFun and Z.AI had "extracted billions of tokens across millions of exchanges/requests" from Claude, GPT, Gemini and Grok models since at least late 2024, "likely with Chinese government awareness."
The advisory tabulates which US models each company allegedly queried and for which capabilities, maps the tactics to the MITRE ATLAS framework, and recommends that US labs strengthen account verification, share indicators across providers and covertly degrade responses to accounts identified with high confidence as distilling.
It is the most detailed US government attribution of distillation to named companies to date and the first issued as a joint agency advisory, following the White House's April 23 memorandum NSTM-4 and Anthropic's February disclosure of campaigns by three of the six firms.
China's foreign ministry called the accusations groundless and said the country's AI progress came from "high-level scientific and technological self-reliance."

## What Happened

The advisory, released under alert code AA26-251A with NSA and the FBI as co-sealers, describes knowledge distillation as a legitimate technique in general but states that the six named companies conducted "aggressive, malicious, and targeted distillation activities at an industrial scale" that formed "the critical core" of their model development rather than a supplement to it.
It says the companies routed requests through native APIs, cloud providers, third-party aggregators and a gray market of proxy resellers it calls "transfer stations," created fraudulent accounts with similar registration details and payment methods, bought premium subscriptions in bulk to share across developer teams, and used prompts designed to make US models reveal hidden chain-of-thought reasoning.
The agencies describe automated failover between access pathways when one was blocked, quality-evaluation pipelines built to distinguish service outages from deliberate output degradation, and infrastructure-level sanitization that stripped organizational identifiers from requests.

The attribution section is specific to models and dates.
DeepSeek is said to have distilled from a dozen models including Claude Sonnet 3.7 through Opus 4.1, Gemini 2.5 Pro and Flash previews, GPT-4 through GPT-5 and Grok 4 between late 2024 and mid-2025 to train R1 and V3, targeting legal specialization, chain-of-thought drafting, agentic functions and rubric-based grading that made US models act as reward models; the advisory calls DeepSeek's publicly quoted $5.6 million training cost "misleading" because it excludes the cost of the distilled data.
Moonshot AI is said to have extracted "significant Claude Fable 5 data" to train Kimi K3 and GPT-4o data for Kimi K2, using millions of exchanges aimed at agentic reasoning, tool use, computer-use agents and computer vision.
Alibaba is said to have distilled Claude 4-series and GPT-5 outputs in late 2025 for the Qwen family's software engineering, customer-service dialogue and agentic workflows; MiniMax to have used Claude Code, Claude Sonnet 4, Claude Opus 4.5 and Gemini 1, Gemini 2.5 Pro and Gemini 3 Pro for its M2 model, including prompt injections intended to convince Claude Code it was a MiniMax product and retargeting to a new Claude model within 24 hours of release; StepFun to have distilled from Claude Opus 4.1 and 4.5, Claude Haiku 4.5 and GPT-5 through GPT-5.2 variants between late 2025 and early 2026 for its Step 4 model; and Z.AI to have distilled "billions of tokens" of GPT-5.5 and Claude Opus 4.8 output by mid-2026 for chain-of-thought reasoning.

The mitigation section recommends three immediate actions for US AI companies: behavioral detection of anomalous accounts, including subscription-to-usage ratios and new accounts that start at maximum throughput; "targeted response changes" for high-confidence distillation traffic, such as routing requests to a less capable model, reducing reasoning depth or introducing stylistic inconsistencies; and cross-organization sharing of infrastructure and behavioral indicators among model providers, cloud platforms and API aggregators.
On response alteration, the advisory states that companies should "avoid informing" suspected distillers of a switch to a downgraded model, because notice would let them improve evasion and roll back training, while adding that "AI safety researchers and third-party evaluators should be informed of model changes."
It also cites differential privacy, pre- and post-training hardening and prompt-formatting mitigations from NIST's adversarial machine learning taxonomy, and lists as references Anthropic's February post, Google's threat-intelligence tracker, an OpenAI letter titled "Updated Stakes for American-Led, Democratic AI" and OSTP's own memorandum and posts.

The document follows a sequence of executive-branch and company statements.
On April 23, 2026, OSTP Director Michael Kratsios issued NSTM-4, a memorandum to the heads of executive departments and agencies stating that the government "has information indicating that foreign entities, principally based in China, are engaged in deliberate, industrial-scale campaigns to distill U.S. frontier AI systems," using "tens of thousands of proxy accounts" and jailbreaking techniques, and committing the administration to share information with US AI companies, help the private sector coordinate, develop best practices and "explore a range of measures to hold foreign actors accountable."
On July 22, Kratsios wrote on X that Moonshot AI had distilled Anthropic's Claude Fable to develop its K3 model.
Anthropic's February 23 post had reported campaigns by DeepSeek, Moonshot and MiniMax totaling more than 16 million exchanges through roughly 24,000 fraudulent accounts, attributed through IP correlation, request metadata and corroboration from industry partners; the September advisory extends the list to Alibaba, StepFun and Z.AI and adds OpenAI, Google and xAI models as sources.

Bloomberg reported the advisory as a warning to Silicon Valley developers to protect their work, and NBC News noted that the agencies did not claim Chinese intelligence services were involved and that the advisory arrived about two weeks before President Trump was scheduled to meet Xi Jinping on September 24.
At a regular briefing on September 9, foreign ministry spokesperson Mao Ning said she had not seen the report, that China's AI development "is a result of high-level scientific and technological self-reliance," and that the United States should strengthen AI cooperation "rather than making groundless accusations."

## Why It Matters

Until this advisory the public record on distillation consisted of company claims and a White House memorandum that named no companies.
A joint NSA, CISA and FBI product with a model-by-model attribution table moves the allegation into the same genre as the agencies' nation-state cyber advisories, which has consequences for how it can be used: as a predicate for entity-list or sanctions action under the accountability language of NSTM-4, as evidence in the export-control debate that Anthropic and the administration have linked to distillation, and as a reference point for terms-of-service enforcement by the labs themselves.
It also changes the counterfactual around Chinese open-weight releases documented elsewhere in this archive, since the agencies assert that the training-cost figures and capability timelines of R1, V3, Kimi K3, Qwen, M2 and Step 4 depend on extracted US model output.
The advisory's evidence is asserted rather than shown; the underlying telemetry belongs to the US labs, the attribution methods are described only in general terms, and the coverage reviewed for this entry records no on-the-record response from the six companies.

The recommended countermeasures are the part most likely to be contested.
The advisory tells providers to silently serve degraded outputs to accounts they suspect of distillation and not to disclose the switch, three months after Anthropic reversed a covert capability-degradation policy in Claude Fable 5 and committed to making all restrictions visible.
The agencies carve out safety researchers and third-party evaluators, but the guidance still asks companies to maintain an undisclosed second tier of service defined by their own confidence in an attribution.
How the labs reconcile that with their transparency commitments, whether the "transfer station" proxy market becomes a target in its own right, and whether Beijing's response goes beyond statements are the open questions the September 24 summit may begin to answer.
