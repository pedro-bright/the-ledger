---
id: seattle-times-newsday-v-openai-microsoft
title: "The Seattle Times and Newsday Sue OpenAI and Microsoft for Copyright Infringement, DMCA Violations and Trademark Dilution"
date: 2026-09-04
category: industry
significance: notable
confidence: high
sources:
  - url: https://storage.courtlistener.com/recap/gov.uscourts.nysd.672142/gov.uscourts.nysd.672142.11.0.pdf
    title: "Complaint, The Seattle Times Company and Newsday LLC v. OpenAI, Inc. et al., No. 1:26-cv-07644 (S.D.N.Y.), ECF No. 11"
    type: primary_document
    publisher: CourtListener
    date: 2026-09-08
    accessed: 2026-09-10
    archive_url: https://web.archive.org/web/20260910130645/https://storage.courtlistener.com/recap/gov.uscourts.nysd.672142/gov.uscourts.nysd.672142.11.0.pdf
  - url: https://www.courtlistener.com/docket/74754553/the-seattle-times-company-v-openai-inc/
    title: "The Seattle Times Company v. OpenAI Inc., 1:26-cv-07644 - Docket"
    type: primary_document
    publisher: CourtListener
    date: 2026-09-04
    accessed: 2026-09-10
    archive_url: https://web.archive.org/web/*/https://www.courtlistener.com/docket/74754553/the-seattle-times-company-v-openai-inc/
  - url: https://www.reuters.com/legal/government/seattle-times-newsday-sue-openai-microsoft-alleging-copyright-infringement-2026-09-05/
    title: "Seattle Times, Newsday sue OpenAI, Microsoft, alleging copyright infringement"
    type: secondary_reporting
    publisher: Reuters
    date: 2026-09-05
    accessed: 2026-09-10
  - url: https://techcrunch.com/2026/09/05/seattle-times-and-newsday-are-the-latest-publications-to-sue-openai-and-microsoft/
    title: "Seattle Times and Newsday are the latest publications to sue OpenAI and Microsoft"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-09-05
    accessed: 2026-09-10
actors:
  - id: seattle-times
    role: plaintiff
  - id: newsday
    role: plaintiff
  - id: openai
    role: defendant
  - id: microsoft
    role: defendant
regions: [US]
tags: [copyright, litigation, news-publishers, training-data, rag, dmca, trademark, local-news]
threads: [ai-copyright-wars]
related: [doj-statement-of-interest-openai-fair-use, openai-copyright-mdl-3143-consolidation, nyt-openai-mtd-ruling-2025, openai-mdl-output-infringement-ruling, nyt-tribune-v-perplexity-copyright]
state: published
revision:
  created: 2026-09-10
  last_reviewed: 2026-09-10
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 4, 2026, The Seattle Times Company and Newsday LLC filed a joint complaint in the Southern District of New York against nine OpenAI entities and Microsoft, alleging that the companies scraped their websites, including paywalled articles, to train and ground the models behind ChatGPT, Copilot and Bing.
The 38-page complaint pleads seven counts: direct and vicarious copyright infringement, two Digital Millennium Copyright Act claims for removing and distributing works stripped of copyright management information, and federal, Washington and New York trademark dilution claims based on AI output misattributed to the papers.
The plaintiffs demand a jury trial and ask the court to order the impoundment or destruction of all copies of their works and of "all LLMs and training datasets" that incorporate them.
The case was assigned to Judge Jed S. Rakoff rather than to the OpenAI copyright multidistrict litigation before Judge Sidney Stein, and it was filed three days after the Justice Department's statement of interest supporting OpenAI's fair-use defense in that proceeding.

## What Happened

The complaint, signed by Lance Koonce and Brendan Kehoe of Klaris Law PLLC and dated September 4, was docketed as No. 1:26-cv-07644.
The clerk flagged the first filing as a deficient pleading for a signature error, and a corrected copy was entered as docket entry 11 on September 8.
The named defendants are OpenAI, Inc., OpenAI GP, LLC, OpenAI, LLC, OpenAI OpCo, LLC, OpenAI Global LLC, OAI Corporation, OpenAI Holdings, LLC, the OpenAI Foundation, OpenAI Group PBC and Microsoft Corporation.
The pleading walks through OpenAI's October 2025 restructuring, values the company at $852 billion after its March 2026 raise, and notes its confidential IPO filing in June 2026 and its report in August 2026 that ChatGPT advertising had reached a $1 billion annualized run rate.
It lists as accused models every OpenAI release from GPT-1 through GPT-6 Astra and the GPT-5.6 Sol, Terra, Luna and Cyber variants, plus the Daybreak Red and Daybreak Blue models.

The Seattle Times, owned by the Blethen family since 1896, told the court it has roughly 108,000 digital-only subscribers, about 100,000 print subscribers and 11 Pulitzer Prizes, and that its metered paywall, introduced in 2013 with 15 free pageviews, now allows one.
Newsday, based in Melville, New York, reported more than 60,000 digital subscribers, 19 Pulitzer Prizes and a complete hard paywall since August 2022.
Both papers' terms of service prohibit using their content to train or ground AI systems, and Newsday's robots.txt file disallows both OpenAI's crawlers and Common Crawl.
The complaint states that seattletimes.com ranked 221st among the top 1,000 domains in the WebText dataset OpenAI published for GPT-2, and alleges on information and belief that the papers' articles were also ingested through WebText2, Common Crawl's WARC files and a copy of the Bing search index that Microsoft provided to OpenAI along with bespoke crawlers.

On outputs, the plaintiffs say that when prompted with only a headline, date and URL, OpenAI's models reproduced 88 consecutive words of a Seattle Times article from its Pulitzer-winning Boeing 737 MAX series, and they set out side-by-side comparisons of Newsday passages on FEMA aid to Puerto Rico, Long Island employment data and Kate Spade's company.
They allege that OpenAI's use of the "Dragnet" and "Newspaper" extraction tools stripped titles, bylines and copyright notices from training copies, that both companies continue to make new copies through retrieval-augmented generation for current-events queries, and that the products "hallucinate" content misattributed to the papers, which the trademark counts characterize as tarnishment of incontestable marks.
The willfulness section cites the New York Times, Ziff Davis, U.S. News and Center for Investigative Reporting suits as notice, and points to OpenAI's licensing agreements with the Associated Press, News Corp, Axios, Axel Springer, The Atlantic, the Financial Times, Dotdash Meredith and Vox Media, three of which it says reportedly total more than $300 million.
The harm section cites industry data that search referral traffic to mid-sized regional publishers fell about 47% between December 2024 and December 2025, against about 22% for national publishers.

Reuters reported that Seattle Times president and chief executive Alan Fisco told employees that "we feel strongly that we must defend our content - which we spend millions of dollars a year to produce - from being used without our consent or compensation."
An OpenAI spokesperson told Reuters that its models are trained on publicly available data and grounded in fair use, without addressing the suit directly.
A Microsoft spokesperson said, "While we're surprised by the lawsuit, we appreciate the importance of local journalism and we're always happy to sit down and explore solutions to this type of dispute."
TechCrunch noted that Microsoft and OpenAI have funded some of The Seattle Times's journalism projects and fellowships.

The filing landed in the middle of a procedural reshuffle in the consolidated OpenAI copyright litigation.
On September 1 the Justice Department filed a statement of interest in that MDL arguing that training on copyrighted works is transformative fair use, and Judge Stein had ordered the New York Times to show cause by September 11 why its own case should not be stayed pending summary judgment in the other member cases.
The complaint's jurisdiction section recites that the defendants have accepted venue in the Times, Raw Story, Intercept and Daily News cases now consolidated in No. 25-md-3143, but the new action was not filed into the MDL and the docket shows no transfer or related-case designation as of September 10.

## Why It Matters

This is the first news-publisher complaint against OpenAI filed after the federal government took a public position on the training question, and it is written to answer that position.
The Justice Department told Judge Stein that a licensing requirement would function as a subsidy for large legacy outlets; the two mid-sized metros respond with a pleaded licensing market, named counterparties and a referral-traffic decline they say falls hardest on regional papers.
The theory also extends beyond training in ways the earlier publisher cases have been converging on: retrieval-augmented output as an ongoing act of copying, DMCA claims for stripped copyright notices, and trademark dilution for misattributed or fabricated output, the same combination the New York Times and Chicago Tribune used against Perplexity in December 2025.

The procedural fork is the thing to watch.
Assignment to Judge Rakoff means the case is, for now, outside the MDL where the summary-judgment record and the government's brief sit, and whether it is transferred as a tag-along action or proceeds separately will determine whether these plaintiffs get their own ruling on fair use.
The number of registered works at issue is not public, because the exhibits listing them are not on the docket, and most of the training allegations are pleaded on information and belief and lean on what discovery has produced in the Times case.
Microsoft's statement that it is "happy to sit down" and the complaint's own emphasis on the licensing market leave open the possibility that this suit, like several publisher disputes before it, ends in a license rather than a judgment.
