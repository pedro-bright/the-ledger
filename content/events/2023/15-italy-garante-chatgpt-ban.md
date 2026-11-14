---
id: italy-garante-chatgpt-ban
title: "Italy's Data Protection Authority Orders a Temporary Halt to ChatGPT's Processing of Italian Users' Data"
date: 2023-03-31
category: policy
confidence: high
sources:
  - url: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9870847
    title: "Artificial intelligence: stop to ChatGPT by the Italian SA. Personal data is collected unlawfully, no age verification system is in place for children"
    type: official
    publisher: Garante per la protezione dei dati personali
    date: 2023-03-31
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230331094245/https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9870847
  - url: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9870832
    title: "Provvedimento del 30 marzo 2023 [9870832]"
    type: primary_document
    publisher: Garante per la protezione dei dati personali
    date: 2023-03-30
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230331111511/https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9870832
  - url: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9881490
    title: "ChatGPT: OpenAI reinstates service in Italy with enhanced transparency and rights for european users and non-users"
    type: official
    publisher: Garante per la protezione dei dati personali
    date: 2023-04-28
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230428175522/https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9881490
  - url: https://www.bbc.com/news/technology-65139406
    title: "ChatGPT banned in Italy over privacy concerns"
    type: secondary_reporting
    publisher: BBC News
    date: 2023-03-31
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230331132444/https://www.bbc.com/news/technology-65139406
  - url: https://www.bbc.com/news/technology-65431914
    title: "ChatGPT accessible again in Italy"
    type: secondary_reporting
    publisher: BBC News
    date: 2023-04-28
    accessed: 2026-11-14
    archive_url: https://web.archive.org/web/20230428210205/https://www.bbc.com/news/technology-65431914
actors:
  - id: italy-garante
    role: regulator
  - id: openai
    role: target
regions: [IT, EU]
tags: [data-protection, GDPR, ChatGPT, privacy, age-verification, regulator-action]
threads: [ai-governance-evolution]
related: [gpt-4-release, eu-ai-act-provisional-agreement]
state: published
revision:
  created: 2026-11-14
  last_reviewed: 2026-11-14
  draft_assistance: ai-assisted
---

## Summary

On March 31, 2023, Italy's data protection authority, the Garante, announced an order imposing an immediate temporary limitation on OpenAI's processing of Italian users' personal data, and ChatGPT became unavailable in Italy.
The Garante said OpenAI appeared to have no legal basis for the mass collection of personal data to train its models, gave users no information about that processing and had no age checks for children.
OpenAI restored the service on April 28 after adding privacy notices, an opt-out from training and an age gate; BBC News described Italy as the first Western country to block the chatbot.

## What Happened

The Garante's order was dated March 30, 2023, and the authority announced it on March 31 with immediate effect.
The authority said it had imposed "an immediate temporary limitation on the processing of Italian users' data by OpenAI" and had opened an inquiry.
It cited a data breach reported on March 20 that exposed ChatGPT users' conversations and payment information of subscribers.

The order made four findings under the EU's General Data Protection Regulation.
OpenAI gave no information notice to users and other people whose data it collected.
There appeared to be "no legal basis underpinning the massive collection and processing of personal data in order to 'train' the algorithms on which the platform relies."
ChatGPT's answers did not always match the facts, so the service processed inaccurate personal data.
Although OpenAI's terms limited the service to users over 13, there was no age verification, which the Garante said exposed children to "absolutely inappropriate" responses.
OpenAI, which had no establishment in the EU but had a representative in the European Economic Area, was given 20 days to report the measures it had taken, under threat of a fine of up to 20 million euros or 4% of global annual turnover.

ChatGPT was unavailable to users in Italy from the start of April.
BBC News described Italy as the first Western country to block the chatbot.
On April 11 the Garante issued a further order setting the conditions for lifting the limitation.

On April 28 the Garante announced that OpenAI had reinstated access for Italian users.
According to the authority, OpenAI had published a notice explaining how personal data was used to train its models, given everyone in Europe, including non-users, a form to object to that processing, let users exclude their conversations from training, offered a way to delete inaccurate information while stating it could not yet correct it, and added a date-of-birth check at sign-up that blocked users under 13 and required parental consent for minors.
The Garante said it welcomed the changes, asked OpenAI to implement a proper age verification system and an information campaign in Italy, and said its investigation would continue alongside a task force of the European Data Protection Board.

## Why It Matters

The Garante took a generative AI service off a national market using existing data protection law, with no AI-specific statute in force.
It showed that the GDPR already reached the core of how large language models were built, because training on scraped personal data needs a legal basis and models can produce inaccurate statements about real people.

The suspension forced OpenAI to change its practices within a month.
The training notice and the opt-out form that OpenAI introduced to satisfy the Garante applied to people across Europe, not only in Italy.
The episode also set a pattern in European AI governance in which data protection, consumer protection and platform regulators acted on AI systems before the AI Act itself applied.
