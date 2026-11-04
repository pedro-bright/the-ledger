---
id: shared-robots-txt-ai-training-signal
title: "OpenAI, Google, Microsoft and Anthropic Back a Shared robots.txt Signal for AI Training Preferences"
date: 2026-10-30
category: policy
significance: notable
confidence: high
sources:
  - url: https://developers.google.com/search/blog/2026/10/ai-training-control
    title: "Supporting a shared AI training control for websites"
    type: official
    publisher: Google Search Central
    date: 2026-10-30
    accessed: 2026-11-04
    archive_url: https://web.archive.org/web/20261104140233/https://developers.google.com/search/blog/2026/10/ai-training-control
  - url: https://openai.com/index/helping-websites-express-ai-training-preferences/
    title: "Making it easier for websites to express AI training preferences"
    type: official
    publisher: OpenAI
    date: 2026-10-30
    accessed: 2026-11-04
    archive_url: https://web.archive.org/web/*/https://openai.com/index/helping-websites-express-ai-training-preferences/
  - url: https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/
    title: "Machine-Readable Training Preference Signal (draft-kelley-aipref-training-preference-signal-00)"
    type: primary_document
    publisher: Internet Engineering Task Force
    date: 2026-10-30
    accessed: 2026-11-04
    archive_url: https://web.archive.org/web/*/https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/
  - url: https://www.theverge.com/tech/1023763/openai-google-microsoft-ai-scraping-standard-opt-out
    title: "The biggest names in AI are backing a new way to opt out of scraping"
    type: secondary_reporting
    publisher: The Verge
    date: 2026-10-30
    accessed: 2026-11-04
actors:
  - id: anthropic
    role: author
  - id: google
    role: subject
  - id: openai
    role: subject
  - id: microsoft
    role: subject
  - id: meta
    role: commentator
  - id: ietf
    role: related-body
regions: [US, EU]
tags: [robots-txt, ai-training-data, publishers, web-standards, opt-out, aipref]
threads: [ai-copyright-wars]
related: [eu-ai-act-gpai-obligations-force, nyt-tribune-v-perplexity-copyright, seattle-times-newsday-v-openai-microsoft]
state: published
revision:
  created: 2026-11-04
  last_reviewed: 2026-11-04
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 30, 2026, OpenAI, Google, Microsoft and Anthropic said they would honor a single robots.txt entry that lets a website state whether its content may be used to train generative AI models, replacing the need to set a separate rule for each company.
The entry, a "policy token" named `__usage_ai-training`, is defined in an individual Internet-Draft written by Anthropic's Kevin Kelley and posted the same day for discussion in the IETF's AI Preferences (aipref) working group.
Anthropic had already adopted the signal, according to The Verge; Google said it aims to support it in 2027, Microsoft planned to support it next year, and OpenAI said it would implement it in the coming months.
The draft is an individual submission with no formal IETF standing.

## What Happened

The Internet-Draft, "Machine-Readable Training Preference Signal," is dated 30 October 2026, lists Kelley's affiliation as Anthropic, and is intended for the Standards Track.
It works by reusing ordinary robots.txt syntax: a site writes a group whose User-Agent line is `__usage_ai-training` and uses Disallow and Allow lines to mark the paths where it objects to, or permits, AI training.
The draft "introduces no new directive names and no new grammar," so existing crawler parsers ignore the group as they would any unknown user agent.
It specifies that "wildcard groups (i.e., User-Agent: *) MUST NOT be interpreted as matching the policy token," and that a file with no `__usage_ai-training` group expresses no preference at all.

The token takes its meaning from the aipref working group's vocabulary, which defines AI training as "Using an asset to modify the learned parameters of a generative AI model" and excludes models used only for classification, ranking or scoring.
The draft separates the preference from access control: "This policy token is not a directive for crawling behavior," and sites that want to limit crawling are told to keep using crawler-specific rules.
It also states that "Private agreements MAY override preferences expressed via this mechanism," and that preferences attach to the robots.txt file in effect when a page was retrieved.

Google's announcement, posted on its Search Central blog by John Mueller, said that when a site uses the token to opt out of training and does not separately address Google-Extended, "Google plans to interpret that as if the publisher had disallowed Google-Extended," the training control Google has offered since 2023.
Company-specific controls would keep working alongside the shared signal.
Google described the proposal as reflecting feedback from "publishers, civil society groups, regulators and other stakeholders" and as "consistent with the EU Code of Practice for General Purpose AI (GPAI) Model Providers," which recognizes robots.txt as a primary way for publishers to state machine-readable preferences.
OpenAI published its own post the same day under the title "Making it easier for websites to express AI training preferences."

The Verge reported that Microsoft would also offer separate controls for AI training and for AI grounding, the use of web content to support generated answers, and that sites would remain in Bing search results whatever they chose.
Meta said it supported the idea but did not say whether it would honor the token.
Its communications head, Andy Stone, told The Verge, "We believe creating a common signal that conveys such preferences to multiple providers at once is an important step."

## Why It Matters

Until this announcement, a publisher that wanted to keep its pages out of AI training had to find and block each developer's own crawler or token, and the rules differed by company.
A single token honored by four of the largest US model developers gives sites one place to state that preference, and it builds on work in a formal standards body.
It arrived as publishers were pursuing the issue through other means, including lawsuits that cite robots.txt (such as The New York Times and Chicago Tribune suits against Perplexity) and Cloudflare's decision to block AI crawlers by default.

The commitment is limited in several ways.
The signal states a preference and includes no enforcement mechanism; the draft says it does not govern crawling and that private agreements can override it.
It covers training only; use of content to ground AI answers is handled by separate, company-specific controls such as Microsoft's grounding setting.
Three of the four companies had not yet implemented it, the draft can still change or lapse in the working group, and Meta had not said whether it would honor it.
