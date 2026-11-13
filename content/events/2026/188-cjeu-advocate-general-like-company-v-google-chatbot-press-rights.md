---
id: cjeu-advocate-general-like-company-v-google-chatbot-press-rights
title: "CJEU Advocate General Says AI Chatbot Answers Built From News Articles Can Infringe Press Publishers' Rights, in the Court's First Generative AI Case"
date: 2026-11-03
category: policy
significance: notable
confidence: high
sources:
  - url: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62025CC0250
    title: "Opinion of Advocate General Szpunar delivered on 3 November 2026, Case C-250/25, Like Company v Google Ireland Limited"
    type: primary_document
    publisher: EUR-Lex
    date: 2026-11-03
    accessed: 2026-11-07
    archive_url: https://web.archive.org/web/20261107140538/https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62025CC0250
  - url: https://curia.europa.eu/site/upload/docs/application/pdf/2026-11/cp260155en.pdf
    title: "Press release No 155/26: Opinion of the Advocate General in Case C-250/25 Like Company"
    type: official
    publisher: Court of Justice of the European Union
    date: 2026-11-03
    accessed: 2026-11-07
    archive_url: https://web.archive.org/web/20261107140228/https://curia.europa.eu/site/upload/docs/application/pdf/2026-11/cp260155en.pdf
  - url: https://www.reuters.com/world/googles-use-press-by-ai-chatbot-may-infringe-copyright-rules-eu-court-adviser-2026-11-03/
    title: "Google's use of press by AI chatbot may infringe copyright rules, EU court adviser says"
    type: secondary_reporting
    publisher: Reuters
    date: 2026-11-03
    accessed: 2026-11-07
actors:
  - id: court-of-justice-eu
    role: subject
  - id: like-company
    role: plaintiff
  - id: google
    role: defendant
regions: [EU, HU]
tags: [copyright, press-publishers-right, retrieval-augmented-generation, text-and-data-mining, gemini, cjeu]
threads: [ai-copyright-wars]
related: [uk-drops-tdm-opt-out-ai-copyright, getty-v-stability-ai-uk-ruling, shared-robots-txt-ai-training-signal]
state: published
revision:
  created: 2026-11-07
  last_reviewed: 2026-11-07
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 3, 2026, Advocate General Maciej Szpunar advised the Court of Justice of the European Union that an AI chatbot which retrieves a news article in real time and reuses it to answer a user can, in certain circumstances, infringe the press publishers' right in Article 15(1) of the 2019 Digital Single Market copyright directive.
The court's press release describes Case C-250/25, Like Company v Google Ireland, as "the first generative AI case to reach the Court of Justice."
Szpunar proposed that the court decline to answer the referred questions on training Google's Gemini models, while stating that training is "as a rule" permitted under the directive's text and data mining exception.
The opinion is not binding on the court, which will give its judgment at a later date.

## What Happened

Like Company Kft., a Hungarian operator of web portals, sued Google Ireland before the Budapest Regional Court (Budapest Környéki Törvényszék).
It claimed that Google had used its articles to train the Gemini large language models and had reproduced them and made them available to the public through the Gemini chatbot between 13 June 2023 and 31 May 2024.
The Hungarian court stayed the case and referred four questions to Luxembourg: two on whether LLM training falls under the publisher's reproduction right or is permitted under the text and data mining (TDM) exception in Article 4 of the directive, and two on whether the chatbot's answers can fall under the reproduction right or the right of making available to the public.

Szpunar advised the court to declare the two training questions inadmissible as hypothetical.
The opinion gives two reasons: nothing in the request for a preliminary ruling supported the assumption that Like Company's articles were used to train the Gemini models, and training is not an "online use" of a press publication, so it falls outside the press publishers' right altogether.
He addressed training anyway, and the press release summarizes his view that "the use of works and other subject matter protected under copyright and the related right to train an LLM is, as a rule, freely permitted under the text and data mining exception."
The opinion says that on these hypothetical matters he would "sometimes express a provisional view only, reserving the right to refine the latter in future cases."

On the chatbot's answers, which the dispute turns on, the proposed ruling says acts of reproduction occur if the chatbot "has accessed that publication unlawfully, in particular by circumventing effective technical measures designed to restrict access to, or the scraping of, that publication," or if "the form of expression in all or part of the press publication at issue is recognisable in the answer provided to the user by the chatbot, to such an extent that the user, by reading that answer, can dispense with accessing the original publication entirely."
Making available to the public occurs if that form of expression is "systematically recognisable" in the chatbot's answers to related queries.
According to the press release, the right "does not protect the mere facts reported in press publications, but only the specific form of expression of those publications."
The chatbot provider is responsible for such acts where they "are inherent to that provider's business model," or where it has not put in place the measures "that can be expected from a reasonably diligent operator in its situation" to counter them.

Google argued that a publisher that leaves its articles freely accessible, without a paywall or measures against scraping, should be regarded as having "implicitly consented to the reuse of those publications to ground the answers provided by LLM-powered online chatbots."
Szpunar rejected the argument: "I do not think that is the case."
He wrote that a paywall "is a significant commercial choice," that anti-scraping measures "do not always adequately distinguish between the purposes for which a website is accessed by bots," and that "In the case of Google, it seems that the same bots serve both functions," meaning search indexing and grounding chatbot answers.
Reuters reported the opinion the same day.

## Why It Matters

Advocates General advise the Court of Justice but do not decide cases, and the court can depart from the opinion.
The judgment that follows will be the court's first interpretation of EU copyright and related rights in a generative AI dispute, and under the preliminary ruling procedure it will bind the Budapest court and other national courts that face the same question.
The opinion moves the focus from model training, which Szpunar treats as largely covered by the TDM exception, to retrieval-augmented generation, the real-time fetching of web pages that chatbots use to answer questions about the news.

The same distinction runs through recent publisher controls.
The shared robots.txt signal that OpenAI, Google, Microsoft and Anthropic said they would honor on October 30 covers AI training only, and the opinion's remark that Google uses the same bots for search indexing and grounding goes to whether publishers can refuse one use without losing the other.
Szpunar's training view is expressly provisional, the date of the judgment is not known, and the Budapest court will still decide whether Gemini's answers actually reproduced Like Company's articles.
