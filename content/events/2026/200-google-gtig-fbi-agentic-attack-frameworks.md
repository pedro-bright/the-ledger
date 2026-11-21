---
id: google-gtig-fbi-agentic-attack-frameworks
title: "Google Reports Attackers Running AI Exploit Pipelines With No Human in the Loop, Days After FBI Alert on ARTEX"
date: 2026-11-16
category: safety
significance: notable
confidence: high
sources:
  - url: https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold
    title: "GTIG AI Threat Tracker: Agentic Threat Activity Crosses a Significant Threshold"
    type: official
    publisher: Google Threat Intelligence Group
    date: 2026-11-16
    accessed: 2026-11-21
    archive_url: https://web.archive.org/web/20261116144950/https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold
  - url: https://www.ic3.gov/CSA/2026/261113.pdf
    title: "FLASH-20261113-001: Threat Overview of ARTEX Autonomous Penetration Testing Framework"
    type: primary_document
    publisher: Federal Bureau of Investigation
    date: 2026-11-13
    accessed: 2026-11-21
    archive_url: https://web.archive.org/web/20261119002238/https://www.ic3.gov/CSA/2026/261113.pdf
  - url: https://techcrunch.com/2026/11/16/fbi-says-artex-ai-open-source-hacking-tool-used-to-breach-networks-in-under-three-hours/
    title: "FBI says Artex AI open source hacking tool used to breach networks in 'under three hours'"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-11-16
    accessed: 2026-11-21
  - url: https://www.axios.com/2026/11/18/ai-hacking-tools-artex-cairn
    title: "The terrifying rise of free AI hacking tools"
    type: secondary_reporting
    publisher: Axios
    date: 2026-11-18
    accessed: 2026-11-21
actors:
  - id: google
    role: author
  - id: us-fbi
    role: author
  - id: deepseek
    role: context
  - id: anthropic
    role: context
  - id: openai
    role: context
regions: [US, global]
tags: [cybersecurity, agentic-attacks, threat-intelligence, autonomous-exploitation, open-source-tools, cybersecurity-advisory]
threads: [ai-agents-era]
related: [openai-linux-kernel-948-root-exploits-pipeline, nsa-cisa-fbi-distillation-advisory-aa26-251a, google-gemini-flash-cyber-fairwind-program, openai-astra-critical-cyber-designation]
state: published
revision:
  created: 2026-11-21
  last_reviewed: 2026-11-21
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 16, 2026, Google Threat Intelligence Group (GTIG) and Mandiant published a report in which GTIG said that in the preceding quarter it had, "for the first time," identified threat actors "using LLM frameworks to fully automate vulnerability discovery and exploitation without a human in the loop."
The report described criminal and suspected Chinese state-linked groups using or testing open-source multi-agent attack frameworks, including ARTEX, CAIRN, CyberStrikeAI and PentAGI, in live intrusions.
It came three days after the FBI issued a FLASH alert on ARTEX, which said some intrusions using the tool had progressed "from initial targeting to privileged access in under three hours" and that more than 1,600 ARTEX consoles were exposed on the internet.

## What Happened

The FBI published FLASH-20261113-001, "Threat Overview of ARTEX Autonomous Penetration Testing Framework," on November 13.
It described ARTEX as "an open-source, large language model (LLM)-driven agentic platform that threat actors have weaponized to automate multiple phases of cyber intrusions at machine speed, from reconnaissance through data exfiltration."
According to the alert, a developer using the name "Autumn-27" released ARTEX on GitHub in July 2026, it reached an estimated 1,500 to 2,000 GitHub stars within 10 weeks, and the developer made the repository unavailable on October 8 after reports of abuse; forks, mirrors and a commercial "ARTEX PRO" version kept it in circulation.
The FBI said attackers had used ARTEX since at least August 2026 against financial services, government, technology, defense, semiconductor, energy, healthcare, manufacturing, telecommunications and legal organizations, including attacks on South Korean financial institutions that exposed personal information of about 67,000 people.

ARTEX ships without a model of its own.
The FBI said it connects to outside providers, "including frontier models (Anthropic Claude, OpenAI GPT) and open-source or Chinese-origin models (DeepSeek, GLM, Grok, Kimi)," and that on attacker-controlled instances "DeepSeek Flash family models" dominated usage "due to their balance of capabilities, relatively low cost, and lack of observable guardrails when framed for penetration testing."
The alert calls the framework's agents "superintelligence (SI) agents."
A version of the PDF posted on November 17 changed the description of a supply-chain compromise of ConnectWise Cloud Backup customers from one that "enabled access to more than 2,250 downstream tenants" to one that "resulted in attempted sign-ins to more than 2,250 downstream tenants."
TechCrunch, which reported the alert on November 16, quoted a ConnectWise spokesperson as saying the company did not have the visibility to confirm the number of affected environments cited by the FBI.

GTIG's quarterly AI threat report, "Agentic Threat Activity Crosses a Significant Threshold," appeared on Google Cloud's threat-intelligence blog the same day TechCrunch's story ran, with a byline listing Aurora Blum, Kelli Vanderlee, Jess Xia and David Mainor.
It said GTIG had observed CAIRN and PentAGI "deployed in the wild" and experimentation with CyberStrikeAI and HexStrike AI, that CAIRN had been used "against targets including in the aerospace sector in the US," and that a group tracked from late August to early October 2026 had used a customized PentAGI-based platform for reconnaissance and vulnerability scanning against organizations in Asia.
It also reported "evidence that a PRC-nexus group was developing its own automated attack framework for likely use in cyber espionage operations."

The "first time" finding rested on an exposed staging server hosting a multi-agent framework that GTIG called exploit_agent, which "integrates with multiple frontier and local LLMs."
According to the report, the framework continuously compares popular web application code before and after patch announcements, identifies potential vulnerabilities, drafts exploits and "automatically executes them without human intervention"; victim telemetry pointed to French websites in media and entertainment and in education.
A configuration file on the server carried Russian-language comments describing an "exploit_agent pilot." Google did not attribute the operation to a named group.
The report also said overall vulnerability disclosures and exploits "nearly doubled between January and August 2026," while zero-day exploits went from a 2025 average of eight a month to 11 a month in 2026 before reaching 22 in August.

Axios covered both reports on November 18 under the headline "The terrifying rise of free AI hacking tools."

## Why It Matters

GTIG's previous quarterly report had described "nascent efforts" by attackers, including "partially automated vulnerability scanning and exploitation attack sequences."
In this report Google said it had found an attacker's exploitation pipeline running end to end without a person in the loop, 12 days after OpenAI reported that its own models had produced 948 Linux kernel root exploits in an automated pipeline.
Together, the two reports give named campaigns, victim counts and indicators for AI-run intrusion tooling, from a federal agency and from a threat-intelligence team drawing on incident-response work.

The scope of the claim is narrower than the headline.
exploit_agent turned already-patched ("n-day") flaws into exploits by comparing code versions; the report does not say it found unknown vulnerabilities, and GTIG said attackers may find it more efficient to use LLMs on patched flaws than to search for zero-days.
GTIG also said the frameworks "currently trade stealth for velocity," leaving noisy traffic and code traces, while the FBI revised its ConnectWise description within four days and ConnectWise said it could not confirm the number of affected environments.

The FBI's list of models behind ARTEX puts commercial frontier systems from Anthropic and OpenAI alongside Chinese models that, by the FBI's account, showed no observable guardrails when the request was framed as penetration testing.
That finding bears on the policy dispute over open-weight releases and on the September 8 joint advisory by the NSA, CISA and FBI on Chinese model distillation.
Neither document establishes how much of the observed damage depended on the AI components rather than on the compromised credentials and unpatched systems that GTIG said the attackers still relied on.
