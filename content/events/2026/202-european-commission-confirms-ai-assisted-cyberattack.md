---
id: european-commission-confirms-ai-assisted-cyberattack
title: "European Commission Confirms It Was Hit by an AI-Assisted Cyberattack First Detected October 22"
date: 2026-11-19
category: safety
significance: notable
confidence: high
sources:
  - url: https://audiovisual.ec.europa.eu/en/media/video/I-298222
    title: "EC Midday press briefing of 19/11/2026 - CYBERSECURITY - Cyber campaign against the European Commission: Q&A"
    type: primary_recording
    publisher: European Commission Audiovisual Service
    date: 2026-11-19
    accessed: 2026-11-23
    archive_url: https://web.archive.org/web/20261123092805/https://audiovisual.ec.europa.eu/en/media/video/I-298222
  - url: https://www.cert.europa.eu/blog/from-penetration-testing-to-cyber-threat-beware-of-artex
    title: "From Penetration Testing to Cyber Threat: Beware of ARTEX"
    type: official
    publisher: CERT-EU
    date: 2026-11-05
    accessed: 2026-11-23
    archive_url: https://web.archive.org/web/20261116043214/https://www.cert.europa.eu/blog/from-penetration-testing-to-cyber-threat-beware-of-artex
  - url: https://apnews.com/article/cyberattack-european-union-artificial-intelligence-ai-79705095e8141cd650196dbff1cf3c70
    title: "A cyberattack using artificial intelligence targeted the EU in October, official says"
    type: secondary_reporting
    publisher: The Associated Press
    date: 2026-11-19
    accessed: 2026-11-23
  - url: https://www.bloomberg.com/news/articles/2026-11-19/eu-executive-branch-suffered-ai-driven-cyber-attack-in-october
    title: "European Commission Hit by AI-Driven Cyber-Attack, Systems Shut Down for Review"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-11-19
    accessed: 2026-11-23
actors:
  - id: european-commission
    role: subject
  - id: cert-eu
    role: related-body
regions: [EU]
tags: [cybersecurity, cyber-incident, agentic-attacks, eu-institutions, autonomous-exploitation]
threads: [ai-agents-era]
related: [google-gtig-fbi-agentic-attack-frameworks]
state: published
revision:
  created: 2026-11-23
  last_reviewed: 2026-11-23
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 19, 2026, European Commission spokesperson Thomas Regnier confirmed at the Commission's midday press briefing that an intrusion first detected on October 22 had been carried out with AI tools, and that the Commission had taken several applications offline as a precaution.
"Indeed we can confirm that this was done with AI tools," he said, according to the Associated Press, which described it as the first time the EU had reported a cyberattack using an AI tool.
The Commission did not name the tool or the attackers.
Two weeks earlier, CERT-EU, the cybersecurity service for the EU institutions, had said it had observed "AI-driven activities against its constituency" that "highly likely involved the use of ARTEX," an open-source AI penetration-testing framework.

## What Happened

Politico Europe reported the attack early on November 19.
According to the AP's account of that report, Politico said the attack lasted at least 10 days and affected the Commission's translation and reimbursement tools and databases used for salaries and timesheets; Regnier declined to confirm those details.

At the midday briefing in Brussels later that day, which the Commission's Audiovisual Service published as a separate clip titled "Cyber campaign against the European Commission: Q&A," Regnier said that "AI-assisted tools can be used and especially misused to detect vulnerabilities" and confirmed that AI tools had been used in this case.
He said the Commission first detected the incident on October 22, opened an investigation and imposed "preventative measures."
"We temporarily took down several applications, and most of them have since then been restored," he said, adding that "we have not detected any evidence of a data breach affecting commission staff as a whole."
He did not say who was behind the attack or which tool was used.
The AP reported that the European Council and the European Parliament had not reported similar incidents.
Bloomberg's report the same day said the Commission had shut systems down for review.

CERT-EU had published a blog post on November 5, "From Penetration Testing to Cyber Threat: Beware of ARTEX."
It said that "in recent weeks" CERT-EU had seen "several threat actors around the world" use ARTEX "to automate their campaigns," that it "rapidly identifies and exploits misconfigurations in addition to targeting traditional software vulnerabilities," and that "CERT-EU has observed similar instances of AI-driven activities against its constituency. These activities highly likely involved the use of ARTEX."
The post described ARTEX as "an open-source, LLM-driven autonomous penetration testing platform" with no model of its own, noted that its original author had made the repository unavailable in October 2026 after reports of misuse, and assessed that its public availability "will likely accelerate adoption by threat actors, resulting in more frequent, faster, and more scalable automated attacks with a higher success rate."
The post did not name the Commission or any other EU body as a target, and the Commission's November 19 statements did not mention ARTEX.

## Why It Matters

According to the AP, it was the first time the EU had reported a cyberattack using an AI tool.
It came six days after the FBI's alert on ARTEX and three days after Google Threat Intelligence Group reported attackers running AI exploit pipelines with no human in the loop, and it moves that pattern from private-sector and law-enforcement reporting to an acknowledged incident at the EU's executive branch.
CERT-EU had warned in an April 2026 post that autonomous offensive capabilities would progressively reach a wider range of actors, and its November post called ARTEX "a concrete example of that shift materialising."

Much remains unknown.
The Commission has not said whether the attackers obtained any data, how long they had access, which systems were affected, or whether the tool involved was ARTEX; the link between CERT-EU's November 5 observations and the Commission incident is not confirmed in either body's published statements.
The Commission also did not say what "done with AI tools" meant in practice, whether AI was used to find vulnerabilities, to carry out the intrusion, or both.
