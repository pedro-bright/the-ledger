---
id: nyt-tribune-papers-v-brave-search-index
title: "New York Times and Three Tribune Papers Sue Brave, Calling Its Search API a Supplier of Scraped News to AI Labs"
date: 2026-11-02
category: industry
significance: notable
confidence: high
sources:
  - url: https://storage.courtlistener.com/recap/gov.uscourts.nysd.676306/gov.uscourts.nysd.676306.1.0.pdf
    title: "Complaint, The New York Times Co. v. Brave Software, Inc., No. 1:26-cv-09549 (S.D.N.Y.)"
    type: primary_document
    publisher: CourtListener
    date: 2026-11-02
    accessed: 2026-11-06
    archive_url: https://web.archive.org/web/20261106140446/https://storage.courtlistener.com/recap/gov.uscourts.nysd.676306/gov.uscourts.nysd.676306.1.0.pdf
  - url: https://www.theverge.com/tech/1024588/brave-lawsuit-ai-scraping-new-york-times
    title: "The New York Times sues Brave web browser for AI scraping and bypassing paywalls"
    type: secondary_reporting
    publisher: The Verge
    date: 2026-11-02
    accessed: 2026-11-06
  - url: https://techcrunch.com/2026/11/02/new-york-times-and-other-outlets-sue-web-browser-brave-over-alleged-content-scraping/
    title: "New York Times and other outlets sue web browser Brave over alleged content scraping"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-11-02
    accessed: 2026-11-06
actors:
  - id: new-york-times
    role: plaintiff
  - id: chicago-tribune
    role: plaintiff
  - id: brave-software
    role: defendant
  - id: anthropic
    role: related-party
  - id: perplexity
    role: related-party
  - id: mistral
    role: related-party
  - id: xai
    role: related-party
  - id: cohere
    role: related-party
regions: [US]
tags: [copyright, litigation, news-publishers, search-index, rag, paywalls]
threads: [ai-copyright-wars]
related: [nyt-tribune-v-perplexity-copyright, shared-robots-txt-ai-training-signal, seattle-times-newsday-v-openai-microsoft]
state: published
revision:
  created: 2026-11-06
  last_reviewed: 2026-11-06
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 2, 2026, The New York Times sued Brave Software, maker of the Brave browser and Brave Search, in the Southern District of New York, and the New York Daily News, the Chicago Tribune, and the Orlando Sentinel filed a separate suit in the same court the same day.
The Times complaint describes Brave as "the supplier, dealer, and distributor of stolen copyrighted content for its own users and many of the most prominent GenAI companies, including Anthropic, Perplexity, Mistral, xAI, and Cohere," which it says buy access to Brave's search index through the Brave Search API.
None of the AI companies is a defendant.
The suits move news publishers' AI copyright litigation from model developers and answer engines to a company that sells web data to them.

## What Happened

The Times complaint (No. 1:26-cv-09549), assigned to Judge Lewis A. Kaplan, was filed by Rothwell, Figg, Ernst & Manbeck, the firm whose attorney Steven Lieberman also filed the second suit, according to The Verge.
It alleges that Brave built its own index by copying web pages without identifying its crawler, citing Brave's statement that the index holds "over 30 billion webpages, with millions of new pages indexed each day."
According to the complaint, Brave "has never disclosed the name of its 'bot'" that crawls the web, so site owners had no way to block it, and Brave's refusal to name the crawler is one of the grounds it gives for calling the infringement willful.

The complaint says Brave turned the index into revenue in two ways.
Its "Ask Brave" feature answers search queries with content retrieved from the index through retrieval-augmented generation, which Brave calls "AI Grounding."
Through the Brave API, it says, "other AI companies pay Brave to provide them with real-time online content from the Brave Index" and use it "to train their own AI models, or to access content they use to respond to specific user queries (through the RAG process), or both."
In support, it quotes Brave's own marketing pages and a November 2023 Brave blog post stating that "Anthropic used Brave's Search API to train their latest model, Claude 2."
The complaint also targets the Brave browser's "Paywall blocker" setting, which it says Brave promotes as a way to "Bypass Paywalls," and Brave's practice of blocking publishers' ads while showing its own.

The Times pleads direct, contributory, and vicarious copyright infringement, circumvention of technical protection measures under Section 1201 of the Digital Millennium Copyright Act, and unjust enrichment under New York law.
It seeks statutory and actual damages, restitution of profits, and a permanent injunction, and demands a jury trial.
The Verge, which published first among whitelisted outlets at 17:51 UTC citing an earlier Reuters report, quoted a Times spokesperson saying the suit was meant "to hold Brave accountable for stealing our content to power its own products and to provide it to some of the most prominent and well resourced generative AI companies in the world."
Perplexity's chief communications officer, Jesse Dwyer, told The Verge that "The New York Times is overpaying its attorneys and underpaying its journalists."
The Verge reported that Brave did not immediately reply to a request for comment.

## Why It Matters

Earlier news-publisher suits targeted model developers (the Times and other papers against OpenAI and Microsoft) or AI answer engines (the Times and the Chicago Tribune against Perplexity in December 2025).
This complaint targets an intermediary, and its theory is that the AI companies named as Brave's customers are "knowing receivers" of infringing copies, which places the commercial search APIs used for grounding and training inside the copyright dispute.
The suits came three days after the shared robots.txt training signal, and the Times' willfulness theory rests on the same practical point: a publisher can only refuse a crawler it can identify.

The AI companies named in the complaint are not parties; the complaint cites Brave's own pages for its claims about Anthropic, Cohere, Mistral, and Perplexity, but gives no source for naming xAI.
The Daily News, Tribune, and Sentinel complaint was not readable on CourtListener when this entry was written, so its claims are described here only through press accounts.
Whether a court treats a search index sold to third parties differently from an index used for a search engine's own results is the open legal question.
