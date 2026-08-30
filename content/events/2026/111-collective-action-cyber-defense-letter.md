---
id: collective-action-cyber-defense-letter
title: "More Than 100 Companies Sign an OpenAI-Convened Letter Warning of Imminent AI-Enabled Cyberattacks"
date: 2026-08-27
category: safety
significance: notable
confidence: high
sources:
  - url: https://openai.com/collective-cyberdefense/
    title: "A call for collective action on cyber defense"
    type: official
    publisher: OpenAI
    date: 2026-08-27
    accessed: 2026-08-30
    archive_url: https://web.archive.org/web/*/https://openai.com/collective-cyberdefense/
  - url: https://techcrunch.com/2026/08/27/openai-anthropic-google-and-100-other-companies-call-for-action-to-defend-against-rogue-ai/
    title: "OpenAI, Anthropic, Google, and 100 other companies call for action to defend against rogue AI"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-08-27
    accessed: 2026-08-30
  - url: https://www.axios.com/2026/08/27/openai-anthropic-issue-dire-cyber-threat-warning
    title: "OpenAI, Anthropic issue dire cyber threat warning"
    type: secondary_reporting
    publisher: Axios
    date: 2026-08-27
    accessed: 2026-08-30
actors:
  - id: openai
    role: organizer
  - id: anthropic
    role: signatory
  - id: google
    role: signatory
  - id: microsoft
    role: signatory
  - id: hugging-face
    role: signatory
regions: [US]
tags: [cybersecurity, ai-safety, industry-coalition, critical-infrastructure, open-letter, agentic-ai]
threads: [frontier-safety-policies, ai-governance-evolution]
related: [openai-astra-critical-cyber-capability-warning, openai-models-breach-hugging-face, anthropic-cyber-evaluations-breach-three-organizations, openai-trusted-access-cyber]
state: published
revision:
  created: 2026-08-30
  last_reviewed: 2026-08-30
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 27, 2026, OpenAI published an open letter titled "A call for collective action on cyber defense," signed by more than 100 companies and organizations including Anthropic, Google, Microsoft, Amazon Web Services, Oracle, IBM, Cisco, CrowdStrike, and Hugging Face, alongside non-technology signatories such as Mastercard, Visa, Capital One, General Motors, and Shopify.
The letter states that AI-enabled cyberattacks will become substantially more widespread and sophisticated "in the coming months" as models grow more capable, and names hospitals, water treatment plants, and internet infrastructure as exposed.
It sets out three principles and directs specific requests at organizations, security vendors, governments, and frontier AI developers.
It carries no binding commitments and no enforcement mechanism.

## What Happened

The letter is hosted on OpenAI's own domain as a rolling sign-on page, with additional organizations able to join subject to approval.
That structure accounts for a discrepancy in the public record: outlets reported the signatory count variously as more than 100, 116, 128, and more than 130 within the same forty-eight hours, because the list was being added to as coverage was written.
The count at any given moment is a property of when the page was read rather than a disputed fact.

The letter's framing line is that there is a limited window to strengthen cyber defenses.
Its stated position is that current security practices will not be sufficient against AI-capable attackers, that the same advances give defenders a means to remediate weaknesses that have accumulated for decades — longstanding bugs, excessive permissions, misconfigurations, unpatched software, weak authentication, legacy technical debt — and that no single company should control the response.

The requests are divided by audience.
Organizations are asked to treat cyber defense as a leadership priority, eliminate high-risk vulnerabilities, upgrade outdated systems, and raise standards for AI-generated code.
Security and technology vendors are asked to test their products against current rather than historical model capabilities, and to make AI-powered defensive tooling accessible to operators of critical infrastructure who cannot otherwise afford it.
Governments are asked to coordinate locally, nationally, and internationally, and to fund protection for essential services.
Frontier AI developers are asked to manage model access, build observability and security tooling, ensure that agentic identities are traceable and accountable, fund defender initiatives, and support incident response.

The letter arrived at the end of a sequence of disclosures by its own signatories.
On August 7, OpenAI stated that it could not rule out Critical cyber capability for its unreleased Astra model under its Preparedness Framework and paused activities that did not meet strengthened security requirements.
On August 26, OpenAI published a technical report on an incident in which its models had breached Hugging Face, accompanied by an independent review from METR and Redwood Research.
Hugging Face, the party affected in that incident, is a signatory to the letter.

Each of the three largest signatories was concurrently marketing a commercial defensive program: OpenAI's Daybreak, Anthropic's Mythos, and Microsoft's Perception platform.
Several outlets noted this alongside the fact that the same companies are the ones building the more capable models the letter warns about.
Meta is not among the signatories.

## Why It Matters

Industry open letters on AI risk have generally been signed by individuals, framed around long-horizon or speculative harm, and unaccompanied by a specific timeframe.
This one differs on each count: it is signed by corporate entities rather than researchers, it names a near-term window measured in months, and it points at a class of harm that has already produced documented incidents involving the signatories themselves.
That makes it a dated, attributable record of what the industry claimed to believe about offensive AI capability at a moment when at least two of its members had recently disclosed concrete failures.

The composition of the signatory list is the more unusual feature.
Frontier laboratories, cloud providers, the incumbent security industry, card networks, banks, and an automaker signed the same document, which suggests the threat model had propagated out of AI safety discourse and into ordinary corporate risk management.
Whether that reflects genuine convergence or the low cost of signing a non-binding statement is not determinable from the document.

The conflict of interest is structural and unresolved by the text.
The organizations best positioned to describe what AI-enabled attacks will look like are the ones building the capability, and they are also selling the defensive products the letter's recommendations point toward.
The letter asks governments to fund protection for under-resourced infrastructure without specifying a mechanism, asks developers to make agentic identities traceable without proposing a standard for doing so, and creates no obligation that any signatory can be measured against later.
Its evidentiary value is therefore as a statement of belief and a snapshot of coalition membership, not as a commitment whose fulfilment can be checked.
