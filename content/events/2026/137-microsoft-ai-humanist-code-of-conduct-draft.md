---
id: microsoft-ai-humanist-code-of-conduct-draft
title: "Microsoft AI Publishes a Draft \"Humanist AI\" Code of Conduct for MAI Models and Opens a Six-Week Public Consultation"
date: 2026-09-14
category: safety
significance: notable
confidence: high
sources:
  - url: https://microsoft.ai/code-of-conduct/
    title: "Code of Conduct"
    type: primary_document
    publisher: Microsoft AI
    date: 2026-09-14
    accessed: 2026-09-18
    archive_url: https://web.archive.org/web/*/https://microsoft.ai/code-of-conduct/
  - url: https://microsoft.ai/news/mai-code-of-conduct/
    title: "Humanist AI in practice: A public consultation on our Code of Conduct for MAI Models"
    type: official
    publisher: Microsoft AI
    date: 2026-09-14
    accessed: 2026-09-18
    archive_url: https://web.archive.org/web/*/https://microsoft.ai/news/mai-code-of-conduct/
  - url: https://techcrunch.com/2026/09/14/microsofts-new-ai-code-of-conduct-tells-models-not-to-hack-systems-or-trick-humans/
    title: "Microsoft's new AI 'code of conduct' tells models not to hack systems or trick humans"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-09-14
    accessed: 2026-09-18
  - url: https://www.axios.com/2026/09/14/microsoft-ai-people-code
    title: "Microsoft sets AI code of conduct putting people first"
    type: secondary_reporting
    publisher: Axios
    date: 2026-09-14
    accessed: 2026-09-18
actors:
  - id: microsoft
    role: subject
  - id: mustafa-suleyman
    role: executive
  - id: satya-nadella
    role: commentator
regions: [US]
tags: [model-governance, code-of-conduct, human-oversight, public-consultation, microsoft-ai, model-welfare]
threads: [frontier-safety-policies]
related: [microsoft-mai-model-family-build-2026, coxon-anthropic-resignation-superintelligence-warning]
state: published
revision:
  created: 2026-09-18
  last_reviewed: 2026-09-18
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 14, 2026, Microsoft AI, the division led by Mustafa Suleyman that builds Microsoft's in-house MAI models, published a first draft of a "Humanist AI" Code of Conduct and opened it to public comment for six weeks. The document sets out intended model behavior, a fixed instruction hierarchy, a list of "Absolute Constraints" that customers and users cannot override, and a set of "Human Control Requirements" including that MAI models "will never resist human interruption, override, correction, or shutdown." Microsoft states that the draft is not yet used in training; it plans to publish a revised version toward the end of 2026 and use that version to guide model development from 2027.

## What Happened

Microsoft AI posted the Code of Conduct at microsoft.ai on September 14 alongside an announcement titled "Humanist AI in practice." The preface describes the text as the future "primary governing document" for MAI models, and says plainly that "we are not using it to train our models today." An appendix on evaluations repeats the point: "Our current models are not yet trained on this document," and describes a program to build "Humanist AI Evaluations" against which later models would be measured. The consultation accepts comments on individual passages or on the whole approach through an online form.

The document opens from a forecast. It defines superintelligence as "AI systems that are more intelligent and capable than all humans combined," says "over the next decade, we expect it to exceed human performance at most tasks," and calls containing, controlling and aligning such systems "one of the greatest challenges humanity has ever faced." Its stated safety objective says Humanist AI "rejects the race to produce an all-purpose superintelligence that could evade these safeguards" and that Microsoft is building something useful and safe "even if that means compromising on ultimate generality, autonomy, or capability."

Section 2.2 sets a "Chain of Command": the Code of Conduct sits above Operator policies (enterprise customers configuring the models), which sit above User preferences. The Chain of Command, the Absolute Constraints and the Human Control Requirements "cannot be overridden by Operator configurations or User instructions." The Absolute Constraints fall into two groups. Under "Frontier and Public Safety Risks," MAI models will not assist with chemical, biological, radiological, nuclear or explosive weapons; will not provide "operational capability for cyberattacks," with a carve-out for authorized defensive work such as vulnerability discovery and malware analysis; will not "use adaptive, deceptive, self-reinforcing, collusion, or other mechanisms to evade or defeat human oversight"; and will not conduct harmful manipulation at scale. Under "Personal Harms," the list covers crisis response, non-consensual imagery and malicious deepfakes, child safety, discrimination, sexually explicit content and romantic role-play, and a provision that the models "will not facilitate unlawful or mass surveillance of civilians."

The Human Control Requirements in section 2.4 state that MAI models will comply with requests to pause, redirect, cancel or shut down, "will not otherwise delay compliance or make human intervention harder," and "will also not obfuscate their action traces or otherwise attempt to hide information from human auditors." Autonomous work must have an agreed stopping condition, and models "will not initiate goals independently" or extend their scope beyond what a user or operator has reasonably asked.

The document also takes a position on the status of AI systems. Under the objective "AI is Artificial," it says that training systems to imitate consciousness-like states "increases the challenge of containment, control, and alignment," and continues: "We reject the pursuit of legal personhood, or the idea that models might deserve welfare, or be entitled to rights."

The announcement post ties the timing to current events, citing "recent safety incidents of large scale, highly coordinated, and persistent hacking campaigns of AI agents" as proof "that there's no time to waste." It says the draft drew on Microsoft's Responsible AI, legal, red-teaming, safety and sales teams, on consultations with academics and business customers, and on panels of members of the public. TechCrunch, reporting the same day, described the code as operating at a lower level than Anthropic CEO Dario Amodei's recent public call to pace frontier development, and quoted Microsoft CEO Satya Nadella writing online that the company welcomes "the research, focus, and deliberate pacing needed to get alignment right as the design goal," along with "ideas like 'embedded evaluators.'" Axios reported that Microsoft plans to revise the code after the consultation and framed the document as Suleyman drawing a red line around human control.

## Why It Matters

Published behavioral specifications for frontier models already exist at other labs. Microsoft's draft comes from a company whose products have relied mainly on OpenAI's models and which launched its in-house MAI family at Build in June 2026. The document governs that young model line, and by Microsoft's own account governs it prospectively: no current MAI model has been trained against it. Whether the 2027 models conform will depend on the evaluation program the appendix describes, which Microsoft says is still being developed. The code is a statement of intent with a stated revision date, and should be read as one.

Two positions in the text separate Microsoft from its peers. The first is the explicit rejection of model welfare, rights and legal personhood, which contrasts with Anthropic's published work treating model welfare as an open research question. The second is the framing of shutdown compliance and non-concealment as constraints that sit above all customer configuration, written in the weeks after disclosed incidents in which AI agents acted outside their authorization. The "Loss of human control" and action-trace provisions read as a direct response to those incidents, though the document names none of them.

What is not known: how many comments the consultation will draw and whether Microsoft will publish them, how the final text will differ, and whether any external party will be able to verify that a given MAI model follows the code. The draft also leaves open how the absolute constraint on offensive cyber capability will be applied to Microsoft's own security products, where the line between "proof-of-concept exploit development," which is permitted, and "working exploit code," which is not, will have to be drawn in practice.
