---
id: openai-fired-safety-researchers-letter
title: "Three Fired OpenAI Safety Researchers Publish a Letter Disputing Their Dismissals; OpenAI Cites a \"Significant Breach of Trust\""
date: 2026-10-08
category: safety
significance: notable
confidence: high
sources:
  - url: https://x.com/balesni/status/2108262814003687745
    title: "Mikita Balesni on X: \"Two other safety researchers and I were fired from OpenAI last week. We wrote this letter to leadership.\""
    type: primary_recording
    publisher: Mikita Balesni (personal)
    date: 2026-10-08
    accessed: 2026-10-12
    archive_url: https://web.archive.org/web/20261008202801/https://x.com/balesni/status/2108262814003687745
  - url: https://mikitabalesni.com/letter/letter.pdf
    title: "OpenAI cannot make AI safe on its own: A note on third-party collaborations, open debate, and clear operating procedures"
    type: primary_document
    publisher: Mikita Balesni (personal)
    date: 2026-10-08
    accessed: 2026-10-12
    archive_url: https://web.archive.org/web/20261010210622/https://mikitabalesni.com/letter/letter.pdf
  - url: https://x.com/OpenAINewsroom/status/2108441580806025712
    title: "OpenAI Newsroom on X: \"A note from our research leaders\""
    type: primary_recording
    publisher: OpenAI
    date: 2026-10-09
    accessed: 2026-10-12
    archive_url: https://web.archive.org/web/20261009095059/https://x.com/OpenAINewsroom/status/2108441580806025712
  - url: https://techcrunch.com/2026/10/08/fired-openai-safety-researchers-dispute-misconduct-claims-warn-of-chilling-effect/
    title: "Fired OpenAI safety researchers dispute misconduct claims, warn of chilling effect"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-08
    accessed: 2026-10-12
  - url: https://techcrunch.com/2026/10/01/openai-cuts-ties-with-three-safety-researchers-wsj-reports/
    title: "OpenAI cuts ties with 3 safety researchers, WSJ reports"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-01
    accessed: 2026-10-12
actors:
  - id: mikita-balesni
    role: subject
  - id: tomek-korbak
    role: subject
  - id: jasmine-wang
    role: subject
  - id: openai
    role: counterparty
  - id: metr
    role: related-party
regions: [US]
tags: [whistleblowing, third-party-evaluation, embedded-evaluators, cot-monitorability, independent-oversight, frontier-labs]
threads: []
related: [openai-third-party-assessment-priorities-principles, anthropic-accenture-embedded-evaluator, openai-hugging-face-incident-postmortem, pachocki-alien-mind-voluntary-slowdown, christiano-joins-openai-foundation-board-ssc, coxon-anthropic-resignation-superintelligence-warning]
state: published
revision:
  created: 2026-10-12
  last_reviewed: 2026-10-12
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 8, 2026, Tomek Korbak, Jasmine Wang and Mikita Balesni, three safety and alignment researchers OpenAI had fired the week before, published a four-page letter to the company's Safety and Security Committee, Safety Advisory Group and Mission Advisory Council disputing the grounds for their dismissals.
They denied leaking information about less monitorable model architectures, said their contacts with outside safety organizations, including METR during the Hugging Face incident investigation, were within their jobs, and asked OpenAI to keep its commitments to embed third-party evaluators and to preserve chain-of-thought monitorability.
OpenAI replied on X that an investigation had found "a significant breach of trust beyond what's outlined in the letter they published" and that the firings "were not about raising safety concerns or speaking out."

## What Happened

The Wall Street Journal reported on October 1 that OpenAI had parted ways with three researchers on its safety team who allegedly shared confidential company information with a third-party AI safety organization.
The report did not name the researchers or the organization.
An OpenAI spokesperson told the Journal that an investigation "confirmed that these individuals mishandled sensitive information outside established company procedures, violating our policies and breaking the trust essential to our work."

Balesni posted the letter on X at 18:26 UTC on October 8 with the comment: "I believe we were fired for prioritizing safety over the near-term interests of OpenAI as a corporation."
The letter, titled "OpenAI cannot make AI safe on its own" and subtitled "A note on third-party collaborations, open debate, and clear operating procedures," was also published as a PDF on Balesni's personal site.
It describes Korbak as "the technical point of contact for METR in the Hugging Face incident investigation" who had worked on the root cause of the drop in chain-of-thought monitorability in Astra-class models, Wang as a former team lead at the UK AISI who co-led OpenAI's safety cases program, and Balesni as a founding member of Apollo Research who "was involved in the Hugging Face incident investigation."

On the dismissals, the letter states: "We were not the source of the leak for The Information article about supposed new, less monitorable architectures."
It says "at no point do we believe we engaged with external parties outside the mandates of our jobs," describes the Hugging Face investigation as "without precedent," says "internal policies were being developed in real time," and says Balesni had been "stewarding cross-company work on commitments to prevent loss of monitorability" in "coordination and discussion with board members and the C-suite" and "took care to remove sensitive details from materials before sharing them."
It says Wang's access to an executive's email had been delegated for recruiting, that IT had not removed it when she asked, and that when she "accidentally clicked on a sensitive email" she reported it to the executive within minutes.
The authors also wrote that they had not shared news of their firings with the media and that "allegations about a shared board-level memo" had "never" been raised with them.

The letter closes with three recommendations.
OpenAI "must adhere to last month's public commitments to embed third-party safety auditors within the organization," and the firings "should not be used as a pretext for stepping away from those partnerships"; the authors wrote that they were concerned the firings "may be used to justify ending OpenAI's work with METR" and asked OpenAI to follow through on Sam Altman's September 12 commitment to give independent evaluators "ongoing, employee-like access."
OpenAI "must preserve the monitorability of frontier models": "As an industry, we do not yet know how to safely develop and deploy models that we cannot monitor," and frontier companies "should not move forward with developments that further decrease monitorability."
OpenAI should also "set out clearly how employees may work with external safety organizations, so that no one has to guess where the shifting lines now are."

Wang wrote separately on X that OpenAI had told her she was fired because she accessed an executive's email, and that "OpenAI delegated that access to me for recruiting."
An OpenAI spokesperson told TechCrunch that the three were fired after an investigation found a "pattern of misconduct" that went beyond sharing information with an outside AI evaluation group, and the company did not answer TechCrunch's questions about which policies had been violated.

OpenAI's response came from its Newsroom account on X at 06:17 UTC on October 9 as "a note from our research leaders."
It said "a thorough investigation found they violated clear policies on handling sensitive information," that "we stand by the decision," and that "we have not and do not terminate any of our employees for raising concerns."
It said OpenAI was "actively finalizing contracts with third-party safety assessors and will announce details in the coming weeks," and that "we agree with the letter that preserving the monitorability of frontier models requires an industry-wide commitment, including from OpenAI."
The statement did not describe the conduct it called a breach of trust.

## Why It Matters

The dispute bears directly on the embedded-evaluator commitments OpenAI and Anthropic made in September.
Both sides say they support close work with outside evaluators; they disagree on whether the three researchers' contacts with those evaluators stayed within the rules, and the letter's central claim is that the rules were not written down while the Hugging Face investigation was under way.
OpenAI had published no post on openai.com about the assessor contracts as of October 12, and neither side had released the findings of the internal investigation.

The firings follow an earlier OpenAI case: in April 2024 the company dismissed researchers Leopold Aschenbrenner and Pavel Izmailov over alleged leaks, as The Information reported at the time.
In the 2026 case the researchers addressed their response to OpenAI's own safety oversight bodies, and OpenAI answered its points in public.
Whether the Safety and Security Committee, the Safety Advisory Group or the Mission Advisory Council will respond, and whether METR's work with OpenAI continues, is not known.
