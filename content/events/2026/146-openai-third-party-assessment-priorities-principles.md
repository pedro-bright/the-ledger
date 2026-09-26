---
id: openai-third-party-assessment-priorities-principles
title: "OpenAI Sets Out Four Priority Areas and Seven Principles for Third-Party Safety Assessments Across Training and Deployment"
date: 2026-09-22
category: safety
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/priorities-principles-third-party-assessments/
    title: "Priorities and principles for effective third party assessments"
    type: official
    publisher: OpenAI
    date: 2026-09-22
    accessed: 2026-09-26
    archive_url: https://web.archive.org/web/20260923195810/https://openai.com/index/priorities-principles-third-party-assessments/
  - url: https://x.com/OpenAI/status/2102447425243828347
    title: "OpenAI on X: independent assessments with deep levels of access"
    type: primary_recording
    publisher: OpenAI
    date: 2026-09-22
    accessed: 2026-09-26
    archive_url: https://web.archive.org/web/*/https://x.com/OpenAI/status/2102447425243828347
  - url: https://www.bloomberg.com/news/articles/2026-09-22/openai-to-let-outside-groups-evaluate-ai-models-at-earlier-phase
    title: "OpenAI to Let Outside Groups Evaluate AI Models at Earlier Phase"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-09-22
    accessed: 2026-09-26
  - url: https://techcrunch.com/2026/09/16/anthropic-and-openai-want-to-embed-safety-evaluators-will-they-really-be-independent/
    title: "Anthropic and OpenAI want to embed safety evaluators. Will they really be independent?"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-09-16
    accessed: 2026-09-26
actors:
  - id: openai
    role: subject
  - id: sam-altman
    role: context
  - id: anthropic
    role: context
  - id: metr
    role: related-party
  - id: apollo-research
    role: related-party
regions: [US]
tags: [third-party-evaluation, independent-oversight, safety-cases, preparedness-framework, misalignment-incidents, red-teaming]
threads: [frontier-safety-policies]
related: [anthropic-accenture-embedded-evaluator, openai-misalignment-reporting-framework-six-reports, openai-us-led-global-frontier-ai-standards-rsi, pachocki-alien-mind-voluntary-slowdown, openai-hugging-face-incident-postmortem]
state: published
revision:
  created: 2026-09-26
  last_reviewed: 2026-09-26
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 22, 2026, OpenAI published "Priorities and principles for effective third party assessments," committing to support independent assessments "with deep levels of access across training, evaluation, and deployment" as part of what it called its efforts "to pace the frontier."
The document names four areas for outside assessment (safety cases, safeguards, capability and alignment evaluations, and investigations of misalignment incidents) and seven principles covering scope, access, independence, security and publication.
It does not name any assessor, budget or start date; OpenAI said only that it was "in conversation with multiple third parties" about proposals.

## What Happened

The post, authored by Lama Ahmad and announced from OpenAI's X account at 17:18 UTC, followed Sam Altman's statement earlier in September that OpenAI would join Anthropic in committing to embedded third-party evaluators, as reported by TechCrunch on September 16.
OpenAI wrote that it had previously given assessors "information about our technical safeguards, visible chain of thought access, and unprecedented levels of confidential data and internal deployment access for incident response and monitor red teaming."
The document covers private and non-profit assessment organizations only and says work with governments on testing "may call for different approaches."
It describes the assessments as "generally longer-term and launch-agnostic," lasting from weeks to several months, and distinct from pre-deployment testing.

The four priority areas are: independent assessment of safety cases "spanning training, evaluation, internal deployment and external deployment"; assessment of critical safeguards, including misalignment monitors and chain-of-thought monitoring, across internal and external deployments; assessment of capability evaluations in the Preparedness Framework's risk categories (chemical and biological, cybersecurity, and AI self-improvement) and of alignment evaluations; and independent investigation of critical misalignment incidents, citing the Hugging Face incident as a case where bringing in a third party was "beneficial."
Among the questions OpenAI listed for assessors were whether monitoring "cannot easily be disabled," whether chain-of-thought monitoring stays reliable "as model capabilities improve," and whether evaluations are refreshed when models "consistently achieve the highest scores."

The seven principles require claims to be "pre-registered before assessment activities begin" within a mutually agreed scope, and access that is "proportionate" and bounded by "legal, security, and IP constraints."
Assessors must disclose conflicts of interest and meet security requirements, with access on "company-managed devices or premises" where needed.
Labs "should have a reasonable period to remediate issues before publication," may request redactions, and where full public disclosure is not possible, findings can go confidentially to "governance bodies or boards of companies"; assessors "should maintain editorial independence" and can note where substantive redactions were made.

Bloomberg reported the same day that OpenAI plans to let outside groups vet its models for safety risks in earlier phases of development, including training.
The post links to OpenAI's September 21 standards proposal and to its September 16 misalignment reporting framework, and closes by calling for "shared international standards" for third-party assessment "both through future laws and private governance institutions."

## Why It Matters

The document is OpenAI's written counterpart to the embedded-evaluator commitment that Anthropic turned into a named partnership with Accenture's Faculty four days earlier.
It extends outside assessment from finished models to training runs, internal deployments and incident investigations, the areas where OpenAI's summer incidents occurred and where, by OpenAI's own account, "safety and security standards are still nascent."

The terms also record where control remains with the laboratory.
Scope is mutually agreed, access is proportionate to OpenAI's legal and IP constraints, OpenAI can remediate before publication and request redactions, and confidential reporting can go to its own board.
Evaluators quoted by TechCrunch before the post had described exactly these points (restrictive NDAs, developer control over publication, and short access windows such as the roughly one week METR and Redwood Research had on premises after the Hugging Face incident and the three days Apollo Research had to test GPT-6 Astra) as the test of whether assessors would be independent or vendors on company terms.

What remains unknown is which organizations OpenAI will sign, what each will be allowed to see, who pays them, and whether any assessment report is published without OpenAI's edits.
