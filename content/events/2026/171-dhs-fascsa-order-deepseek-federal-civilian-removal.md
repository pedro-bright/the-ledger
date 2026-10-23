---
id: dhs-fascsa-order-deepseek-federal-civilian-removal
title: "DHS Orders Federal Civilian Agencies to Exclude and Remove DeepSeek Products Under the Supply Chain Security Act"
date: 2026-10-19
category: policy
significance: notable
confidence: high
sources:
  - url: https://www.federalregister.gov/documents/2026/10/20/2026-21447/notice-of-order-regarding-exclusion-and-removal-of-deepseek-products-from-federal-civilian-executive
    title: "Notice of Order Regarding Exclusion and Removal of DeepSeek Products From Federal Civilian Executive Branch Information Technology Systems and Procurements"
    type: primary_document
    publisher: Federal Register (U.S. Department of Homeland Security)
    date: 2026-10-20
    accessed: 2026-10-23
    archive_url: https://web.archive.org/web/20261023130314/https://www.federalregister.gov/documents/2026/10/20/2026-21447/notice-of-order-regarding-exclusion-and-removal-of-deepseek-products-from-federal-civilian-executive
  - url: https://www.wsj.com/tech/ai/dhs-orders-deepseek-technology-removed-from-federal-civilian-it-systems-060b6d3d
    title: "DHS Orders Federal Civilian Agencies to Remove China's DeepSeek AI"
    type: secondary_reporting
    publisher: The Wall Street Journal
    date: 2026-10-19
    accessed: 2026-10-23
    archive_url: https://web.archive.org/web/20261019193313/https://www.wsj.com/tech/ai/dhs-orders-deepseek-technology-removed-from-federal-civilian-it-systems-060b6d3d
  - url: https://www.bloomberg.com/news/articles/2026-10-19/us-moves-to-bar-deepseek-from-federal-agencies-and-contracts
    title: "US Moves to Bar China's DeepSeek From Federal Agency Systems"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-10-19
    accessed: 2026-10-23
  - url: https://techcrunch.com/2026/10/20/us-orders-federal-agencies-to-remove-chinas-deepseek-ai-from-their-systems/
    title: "US orders federal agencies to remove China's DeepSeek AI from their systems"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-20
    accessed: 2026-10-23
  - url: https://www.nbcnews.com/world/asia/china-defends-deepseek-us-ban-ai-government-systems-rcna604721
    title: "China defends DeepSeek after U.S. ban of its AI from government systems"
    type: secondary_reporting
    publisher: NBC News (The Associated Press)
    date: 2026-10-20
    accessed: 2026-10-23
actors:
  - id: us-dhs
    role: regulator
  - id: deepseek
    role: subject
  - id: us-cisa
    role: related-body
  - id: chinese-government
    role: counterparty
regions: [US, CN]
tags: [fascsa, federal-procurement, national-security, us-china, chinese-ai]
threads: []
related: [deepseek-china-restrictions, nsa-cisa-fbi-distillation-advisory-aa26-251a, deepseek-r1-release]
state: published
revision:
  created: 2026-10-23
  last_reviewed: 2026-10-23
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 19, 2026, the Department of Homeland Security made public an order under the Federal Acquisition Supply Chain Security Act that bars federal civilian agencies from buying DeepSeek products and directs them to remove DeepSeek products, and third-party products and services "developed using DeepSeek implementations," from their IT systems. The order, Exclusion and Removal Order #2026-01, was signed by Secretary of Homeland Security Markwayne Mullin and carries an original release date of July 24, 2026, nearly three months before its notice appeared in the Federal Register. It applies to civilian executive branch agencies except for their national security systems and secure compartmented information systems.

## What Happened

The notice, FR Doc. 2026-21447 under docket DHS-2026-0628, was filed for public inspection at 8:45 a.m. on Monday, October 19, and published in the Federal Register on October 20 (91 FR 66346). It was signed by DHS General Counsel James H. Percival II and reproduces the four-page signed order as a scanned appendix. The order is addressed from Mullin, with Office of Management and Budget Director Russell Vought copied, and states that the Secretary acted "following review of the Federal Acquisition Security Council Recommendation and affiliated evidence." The 2018 act, codified at 41 U.S.C. 1321-1328, lets the Secretary of Homeland Security issue exclusion and removal orders for civilian agency systems, while the Defense Department and the Director of National Intelligence hold the equivalent authority for their own systems.

The order's "Summary of Risks from Source" identifies the company as Hangzhou DeepSeek Artificial Intelligence Basic Technology Research Co., Ltd. and states that "DeepSeek's models present multiple threat vectors." It lists DeepSeek's servers being located in China, a Chinese legal system that "permits extensive authority to government cyber and intelligence functions to access private company infrastructure," an account process for DeepSeek-hosted models that collects personally identifiable information "and may also track and digitally fingerprint users," and the possibility that prompts from government employees or vendors could transfer sensitive data to China. It adds that "the models themselves may contain malware or other security vulnerabilities" and that security research found multiple critical vulnerabilities in DeepSeek's iOS app. The footnotes cite public material: DeepSeek's privacy policy, an April 2025 report by the House Select Committee on the Chinese Communist Party, a 2020 DHS data security advisory, a February 2025 NowSecure analysis of the iOS app, a Stanford Cyber Policy Center paper, a TechTarget explainer and a company profile by Exovera.

The order requires civilian agencies to exclude DeepSeek, its affiliates and their products from procurement "effective immediately after issuance," including agency-approved product lists, service provider equipment lists and e-commerce markets, and to remove products from DeepSeek, its affiliates and third parties "developed using DeepSeek implementations" from agency systems immediately, or to seek an exception. Exception requests had to be submitted in writing within 60 days of issuance, with a "compelling justification" such as impact on mission-critical functions, and CISA reviews them and gives written approval or disapproval. Until removal is complete, agencies are encouraged to monitor traffic, add logging and data exfiltration controls, and flag anomalous activity. CISA may give technical help to agencies that cannot comply on their own, and the Secretary must review the order within one year and annually after that.

The Wall Street Journal reported the order at 14:44 UTC on October 19, and Bloomberg reported the same day that the notice had been posted on the Federal Register website. TechCrunch reported on October 20 that a law passed in December 2025 had already targeted DeepSeek's use in intelligence national security systems, and that the new order extended restrictions to civilian agencies for both new purchases and existing systems. On October 20, Foreign Ministry spokesperson Mao Ning said China "will resolutely safeguard the legitimate rights and interests of Chinese companies" and "consistently opposes the overstretching of the concept of national security," according to the Associated Press. The AP reported that China's Ministry of Commerce expressed "strong dissatisfaction and firm opposition" that evening, said the United States had disregarded the consensus reached between Xi Jinping and Donald Trump, and said China would "take all necessary measures to firmly defend its legitimate rights and interests." DeepSeek did not immediately respond to the AP's request for comment.

## Why It Matters

In early 2025, after DeepSeek R1's release, restrictions on DeepSeek in the US government were adopted agency by agency, with the House, the Navy and NASA among the bodies that barred its use. Order #2026-01 replaces that pattern for civilian agencies with one order covering both procurement and installed systems. It follows the September 8, 2026 joint advisory AA26-251A, in which the NSA, CISA and the FBI named DeepSeek among six Chinese companies said to have distilled US frontier models, though the order's own risk summary rests on data access and software security and does not mention distillation.

The order's risk summary describes DeepSeek-hosted services, such as servers in China and account data collection, but its removal scope extends to third-party products and services built with "DeepSeek implementations." DeepSeek releases its models as open weights, which can be run on infrastructure with no connection to the company, and the difference between the hosted service and the weights was already a point of confusion in the 2025 bans. The published text does not define "DeepSeek implementations," so it does not say whether a US vendor's product running DeepSeek weights on US servers, or a model fine-tuned or distilled from them, falls within scope.

Several facts are not public. DHS has not said why the notice was published almost three months after the July 24 release date, how many agencies used DeepSeek products, or how many exceptions were requested. If the 60-day exception window ran from July 24, it closed on September 22, a month before the order became public; that date is Ledger arithmetic from the order's terms, not a DHS statement. The Federal Acquisition Security Council recommendation the order relies on has not been published, and the order's first annual review is due by July 2027.
