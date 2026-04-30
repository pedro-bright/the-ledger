---
id: openai-microsoft-partnership-restructuring
title: "OpenAI-Microsoft Partnership Restructured: Exclusivity Ends, AGI Clause Removed"
date: 2026-04-27
category: industry
significance: notable
confidence: high
sources:
  - url: https://blogs.microsoft.com/blog/2026/04/27/the-next-phase-of-the-microsoft-openai-partnership/
    title: "The Next Phase of the Microsoft-OpenAI Partnership"
    type: official
    publisher: Microsoft
    date: 2026-04-27
    accessed: 2026-04-30
    archive_url: https://web.archive.org/web/*/https://blogs.microsoft.com/blog/2026/04/27/the-next-phase-of-the-microsoft-openai-partnership/
  - url: https://techcrunch.com/2026/04/27/openai-ends-microsoft-legal-peril-over-its-50b-amazon-deal/
    title: "OpenAI ends Microsoft legal peril over its $50B Amazon deal"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-04-27
    accessed: 2026-04-30
  - url: https://www.axios.com/2026/04/28/openai-microsoft-cloud-amazon
    title: "OpenAI breaks free of Microsoft's cloud"
    type: secondary_reporting
    publisher: Axios
    date: 2026-04-28
    accessed: 2026-04-30
  - url: https://simonwillison.net/2026/Apr/27/now-deceased-agi-clause/
    title: "Tracking the history of the now-deceased OpenAI Microsoft AGI clause"
    type: secondary_reporting
    publisher: Simon Willison
    date: 2026-04-27
    accessed: 2026-04-30
actors:
  - id: openai
    role: subject
  - id: microsoft
    role: subject
  - id: amazon
    role: counterparty
  - id: sam-altman
    role: executive
  - id: satya-nadella
    role: executive
regions: [US]
tags: [microsoft-openai, exclusivity, agi-clause, multi-cloud, commercial-restructuring, partnership-governance, aws]
threads: []
related: [openai-122b-round-852b]
state: published
revision:
  created: 2026-04-30
  last_reviewed: 2026-04-30
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On April 27, 2026, Microsoft and OpenAI announced a restructured commercial partnership that makes three material changes to the relationship in place since 2019: Microsoft's license to OpenAI intellectual property becomes non-exclusive through 2032, allowing OpenAI to distribute products on any cloud provider; the "AGI clause" — a contractual provision under which Microsoft's commercial rights would terminate if OpenAI declared it had achieved artificial general intelligence — is removed; and Microsoft ceases paying a revenue share to OpenAI, while OpenAI's revenue share payments to Microsoft continue through 2030 subject to a new cap. The proximate trigger was OpenAI's $50 billion Amazon Web Services partnership, which conflicted with the existing exclusivity terms.

## What Happened

The Microsoft-OpenAI commercial relationship began with Microsoft's $1 billion investment in 2019 and deepened through a series of multi-billion-dollar capital commitments culminating in a reported $13 billion invested by 2023. The partnership made Microsoft Azure OpenAI's exclusive cloud provider and gave Microsoft preferential rights to commercialize and resell OpenAI's models through Azure-hosted APIs. A non-public contractual provision — the "AGI clause" — specified that Microsoft's commercial IP rights would become void if OpenAI's board determined the company had achieved artificial general intelligence as defined in the agreement.

In early 2026, OpenAI signed a $50 billion investment and cloud partnership with Amazon Web Services, committing to deploy its models on Amazon's infrastructure and expanding an existing $38 billion AWS commitment by $100 billion over eight years. The AWS deal created a legal conflict: serving OpenAI products from AWS competed with the exclusive Azure terms Microsoft held. According to TechCrunch's reporting on the renegotiation, OpenAI's leadership was concerned the AWS partnership could expose the company to breach-of-contract liability under its existing Microsoft agreement. OpenAI CEO Sam Altman and Microsoft CEO Satya Nadella negotiated the restructured terms directly.

The Microsoft blog post of April 27 stated that Microsoft would retain its position as OpenAI's "primary cloud partner," with OpenAI products continuing to "ship first on Azure, unless Microsoft cannot and chooses not to support the necessary capabilities." This first-on-Azure preference replaced the prior exclusivity arrangement. Microsoft's license to OpenAI IP extended to 2032 but is now non-exclusive, allowing OpenAI to license its technology to other cloud providers and commercial partners. Microsoft will no longer pay revenue share on OpenAI products it resells. OpenAI continues paying Microsoft a revenue share through 2030 at the existing percentage, now subject to a total cap. Microsoft retains a major shareholder position in OpenAI.

As part of the same restructuring or closely following it, the AGI clause was removed. Simon Willison documented the clause's history on April 27: for years the provision had specified that achieving AGI — as determined by OpenAI's board — would terminate Microsoft's commercial IP rights. The clause had no publicly disclosed threshold definition for AGI, creating ambiguity about what milestone would trigger termination. The removal of the clause eliminates the mechanism entirely; the companies did not publicly state new terms governing the relationship between OpenAI's internal AGI milestones and Microsoft's commercial position.

Within approximately 24 hours of the restructuring announcement, OpenAI models became available in Amazon Bedrock: GPT-5.5 and GPT-5.4 in preview, and Codex in limited preview. Amazon Bedrock Managed Agents powered by OpenAI also entered limited preview, and Amazon separately disclosed it was investing up to $50 billion directly in OpenAI.

## Why It Matters

The Microsoft-OpenAI exclusive partnership, as structured from 2019 to 2026, was the primary distribution mechanism for frontier AI models reaching enterprise users at scale. Azure's enterprise sales infrastructure and OpenAI's model development were commercially co-dependent in a way that had no parallel in the industry. The restructuring changes the nature of that dependency: OpenAI gains the ability to reach all major cloud hyperscalers' customer bases, while Microsoft retains a preferred-but-not-exclusive position. For other frontier labs watching, the shift signals that exclusive lab-hyperscaler arrangements may not be the stable equilibrium: as labs grow large enough, multi-cloud distribution becomes commercially rational even at the cost of renegotiating foundational agreements.

The AGI clause removal has distinct governance implications. For seven years, the clause represented an unusual structural incentive embedded in a commercial contract. OpenAI's board faced an implicit disincentive to declare AGI, since doing so would terminate Microsoft's commercial rights and potentially destabilize OpenAI's most important commercial partnership. Removing the clause decouples the commercial relationship from OpenAI's internal AGI-declaration question, eliminating whatever distorting effect the clause had on that decision. What the companies now use to define and manage the threshold between current AI capabilities and systems they consider AGI — and whether any contractual reference to that threshold persists — is not known from public documents.

What this restructuring does not resolve: whether OpenAI's first-on-Azure obligation is materially enforceable when Microsoft "cannot and chooses not to" support a capability is undefined; the practical boundary between preferred and exclusive status will depend on how that phrase is applied as OpenAI's product roadmap develops. The commercial terms of the AGI clause removal — whether Microsoft received compensation for relinquishing it, or whether its removal was exchanged for other concessions in the overall restructuring — have not been publicly disclosed.
