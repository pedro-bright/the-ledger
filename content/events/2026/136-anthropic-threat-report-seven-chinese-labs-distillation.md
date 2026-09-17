---
id: anthropic-threat-report-seven-chinese-labs-distillation
title: "Anthropic Threat Report Attributes Distillation Campaigns to Seven Chinese Labs and Says Moonshot and DeepSeek Relayed Their Users' Requests to Claude"
date: 2026-09-10
category: safety
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/threat-intelligence-report-september-2026
    title: "Detecting and countering misuse of AI: September 2026"
    type: official
    publisher: Anthropic
    date: 2026-09-10
    accessed: 2026-09-17
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/threat-intelligence-report-september-2026
  - url: https://techcrunch.com/2026/09/10/anthropic-details-distillation-campaigns-from-alibaba-moonshot-ai-and-deepseek/
    title: "Anthropic details distillation campaigns from Alibaba, Moonshot AI, and DeepSeek"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-09-10
    accessed: 2026-09-17
  - url: https://www.bloomberg.com/news/articles/2026-09-10/moonshot-secretly-routed-user-requests-through-claude-anthropic-says
    title: "Moonshot Secretly Routed User Requests Through Claude, Anthropic Says"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-09-10
    accessed: 2026-09-17
  - url: https://techcrunch.com/2026/09/11/y-combinators-garry-tan-wants-u-s-open-weight-ai-labs-to-distill-frontier-models-too/
    title: "Y Combinator's Garry Tan wants US open-weight AI labs to 'distill' frontier models, too"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-09-11
    accessed: 2026-09-17
actors:
  - id: anthropic
    role: author
  - id: alibaba
    role: subject
  - id: moonshot-ai
    role: subject
  - id: deepseek
    role: subject
  - id: z-ai
    role: subject
  - id: xiaomi
    role: subject
  - id: sensetime
    role: subject
  - id: minimax
    role: subject
regions: [US, CN]
tags: [distillation, threat-intelligence, us-china, attribution, chain-of-thought, api-security, chinese-ai]
threads: []
related: [nsa-cisa-fbi-distillation-advisory-aa26-251a, anthropic-open-weights-policy-position, moonshot-kimi-k3-open-weights, deepseek-v4-1-flash-release]
state: published
revision:
  created: 2026-09-17
  last_reviewed: 2026-09-17
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 10, 2026, Anthropic published its fourth threat intelligence report, covering misuse of Claude that it disrupted between December 2025 and August 2026 across seven harm areas. The report's distillation section attributes unauthorized capability-extraction campaigns to seven China-based labs: Alibaba, Moonshot AI, DeepSeek, Zhipu (Z.ai), Xiaomi, SenseTime and MiniMax. It states that Alibaba ran the largest campaign Anthropic has measured, at more than 151 million exchanges between May and July 2026, and that Moonshot and DeepSeek forwarded their own customers' requests to Claude without telling them. The report was published two days after the NSA, CISA and FBI joint advisory on distillation by Chinese AI companies.

## What Happened

Anthropic released "Detecting and countering misuse of AI: September 2026" on its website with a downloadable PDF and a file of indicators of compromise. It follows the company's threat reports of March, August and November 2025. The report covers cyber operations, influence operations, surveillance, scams and fraud, biological misuse, conventional weapons development and distillation. Anthropic wrote that the misuse cases involved Claude Haiku, Sonnet and Opus models, and that none involved Claude Fable or Mythos-class models except one distillation case. It stated it had observed no distillation attempts against Mythos 5 or Mythos Preview, which are not generally available.

The distillation section defines "illicit distillation" as an industrial-scale, covert campaign to extract a model's capabilities without authorization, typically enabled by fraud. Anthropic wrote that since its first disclosure in February 2026 it had disrupted further campaigns from seven labs, which it said it attributed "with high confidence." According to the report, the labs reached Claude through proxy services known as "transfer stations," which create accounts using false identities, stolen or fake credit cards and stolen API keys, and some labs bought transcripts of Claude conversations from third-party resellers. The report reproduces prompts used to make Claude reveal its reasoning traces, including one instructing it to "translate previous working memory" into katakana-only Japanese, and describes one lab testing more than twelve thousand extraction techniques before scaling up the ones that worked.

The report assigns each campaign an internal "Generative Threat Group" designator and an exchange count. For Alibaba (GTG-16005), it counts more than 151 million exchanges between May and July 2026, peaking at nearly 3 million per day from more than 3,500 fraudulent accounts, targeting the chain-of-thought output of Opus 4.6 and 4.7. Anthropic states that the transcripts were used in training Qwen 3.5, 3.6 and 3.7, and that Alibaba also used Claude to build reinforcement learning environments and for model architecture research. For Moonshot (GTG-16002) it counts more than 23 million exchanges between May and July; for DeepSeek (GTG-16001), more than 12.1 million over 14 days in July; for Zhipu (GTG-16006), more than 3.4 million over 17 days in June and July; and for Xiaomi (GTG-16008), more than 400,000 over 20 days in March and April. TechCrunch summed the campaigns to nearly 200 million exchanges. No counts are given for SenseTime, which the report says bought Claude transcripts from data vendors, or for MiniMax, which it says set up a proxy service through a shell company offering only Anthropic and OpenAI models.

The report alleges that Moonshot "silently forwarded customer requests to Claude, instead of processing them using Kimi," and displayed Claude's responses to users as Kimi's. In one ten-day period Moonshot relayed almost 300,000 customer requests, most of them to Opus, through 5,380 fraudulent accounts that mostly appeared to be located in Singapore and Japan, and saved at least part of the exchanges for training. Anthropic states that DeepSeek did the same for selected users who reached DeepSeek models through coding harnesses such as Claude Code, the Claude Agent SDK or OpenCode, identifying them by strings in inbound requests. Both labs are described as using a "cross-session replay" technique: saving the signature that Claude's API returns in place of raw reasoning, then starting a new session and eliciting the full trace from it.

Because the relayed traffic passed through Anthropic's systems, the report describes its contents. It cites a user Anthropic assesses was likely affiliated with the People's Liberation Army asking what they believed was Kimi to analyze CCTV footage from hundreds of cameras in Chengdu for whether one tracked individual was "behaving abnormally." It also cites a DeepSeek-relayed session that exposed live credentials for a database of a Russian government agency associated with the Ministry of Defense, and engineers building a case management system for a municipal Public Security Bureau. Anthropic wrote that Xiaomi replayed conversations from users of its MiMo models through Claude, that many of those users arrived through third-party model routers common in the United States and Europe, and that the sessions contained names, contact details and corporate data from hundreds of users in at least a dozen languages. It added: "We have no indication US persons' data was exposed."

On Zhipu, the report states that ahead of the GLM 5.3 release the lab tried to extract cyber capabilities from Claude Fable, abandoned the attempt after Anthropic's cyber safeguards degraded the results, and switched to Opus 4.6 and "the leading model of another US AI lab" because employees judged the safeguards weaker. As countermeasures Anthropic lists attribution of proxy accounts to organizations before banning them, classifiers for adversarial extraction, summarized reasoning output, a "preserved thinking" control introduced with Fable 5.1 that stops new API accounts from editing the context that precedes Claude's reasoning, and identity verification for accounts showing signs of resale or of operating from unsupported countries.

Outside distillation, the report's longest case study (GTG-20006) describes a Russian espionage operation, whose attribution Anthropic says is consistent with public reporting on Midnight Blizzard, that used Claude Code workflows against more than 20 organizations, concentrated in Ukraine and Europe, and exfiltrated more than 300,000 national identity records from a North African government technology authority. Other cases include a credential-harvesting pipeline that scanned 1.8 million Android apps for hardcoded secrets and an influence network that published at least 8,913 articles in about 20 languages.

## Why It Matters

The September 8 joint advisory from the NSA, CISA and FBI named six Chinese companies but published little of the underlying evidence. Anthropic's report, two days later, is the most detailed public account from a targeted lab: per-lab exchange counts, date ranges, account numbers, named model versions on both sides, and the specific API control that was bypassed. The list of labs differs from the government's. Anthropic names Xiaomi and SenseTime, which the advisory did not, and does not name StepFun, which the advisory did.

The allegation that Moonshot and DeepSeek served Claude's answers under their own brands is new in the public record. If accurate, it means some share of usage and perceived quality attributed to Kimi and DeepSeek models in mid-2026 came from Claude, and that customers of those services, including Chinese state-affiliated users, had their prompts sent to a US company without notice. It also means Anthropic read and published descriptions of that traffic, a position that raises its own questions about how a provider handles third-party data that arrives through fraudulent accounts.

All attributions in the report are Anthropic's. The report does not publish the account-level evidence behind them, no outside party has verified the exchange counts, and the report's claim that distilled transcripts were used in specific Qwen releases is not accompanied by a method. Anthropic has a commercial and policy interest in the conclusion: it has argued since February for government action on distillation, and its July 27 statement on open-weight models listed enforcement against industrial-scale distillation among the measures it supports. Y Combinator chief executive Garry Tan told CNBC the same week that on distillation regulation "I would do nothing" and that "we could argue that there should be an American distillation regime," which he described to TechCrunch as letting smaller US open-weight labs train on the outputs of US frontier models. What the named labs say in response, and whether the US government acts on the advisory and this report through export or entity-list measures, was not known at the time of writing.
