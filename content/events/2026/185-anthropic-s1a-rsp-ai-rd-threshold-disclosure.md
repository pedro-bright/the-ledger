---
id: anthropic-s1a-rsp-ai-rd-threshold-disclosure
title: "Anthropic's Amended S-1 Says It May Imminently Meet Its Responsible Scaling Policy Threshold for AI-Driven Acceleration of AI Research"
date: 2026-11-02
category: safety
significance: notable
confidence: high
sources:
  - url: https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm
    title: "Anthropic, PBC - Form S-1/A Registration Statement"
    type: primary_document
    publisher: U.S. Securities and Exchange Commission
    date: 2026-11-02
    accessed: 2026-11-06
    archive_url: https://web.archive.org/web/20261102155140/https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm
  - url: https://www.anthropic.com/responsible-scaling-policy
    title: "Anthropic's Responsible Scaling Policy (Version 3.4, effective July 8, 2026)"
    type: official
    publisher: Anthropic
    date: 2026-07-08
    accessed: 2026-11-06
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/responsible-scaling-policy
  - url: https://techcrunch.com/2026/11/02/anthropic-warns-that-its-very-close-to-rsi-capability-aka-self-building-ai/
    title: "Anthropic warns that it's very close to RSI capability, aka self-building AI"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-11-02
    accessed: 2026-11-06
  - url: https://www.axios.com/2026/11/02/anthropic-spending-revenue-surge
    title: "Anthropic's spending commitments surge to nearly $900 billion"
    type: secondary_reporting
    publisher: Axios
    date: 2026-11-02
    accessed: 2026-11-06
actors:
  - id: anthropic
    role: subject
regions: [US]
tags: [responsible-scaling-policy, recursive-self-improvement, ai-rd-automation, sec-filing, risk-disclosure, ipo]
threads: [frontier-safety-policies]
related: [anthropic-public-s1-filing-founder-voting-control, anthropic-second-risk-report-misalignment, anthropic-rsp-v3, anthropic-coordinated-pause-call]
state: published
revision:
  created: 2026-11-06
  last_reviewed: 2026-11-06
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 2, 2026, Anthropic filed an amended registration statement (Form S-1/A) for its initial public offering that added a risk-factor disclosure stating that "our internal estimates and our expectations regarding future models, rather than our current models, indicate that we may imminently meet our Responsible Scaling Policy's definition of 'dramatically accelerated progress attributable to AI.'"
The filing says Anthropic has not designated any current model as exceeding the threshold and will publish further reports under the policy.
It also added a statement that Anthropic does not expect to be able to safely let Claude design and build later frontier models fully autonomously, and that it is considering policy updates "to keep humans in control of frontier model development."
None of these passages appeared in the original S-1 filed on October 26.

## What Happened

The SEC accepted the amended filing (accession 0001628280-26-068676, registration number 333-299633) at 9:24 a.m. Eastern time on November 2, one week after the public S-1.
Most of the amendment updated the financial statements through September 30, 2026: revenue of $33.24 billion for the first nine months of the year, against $2.545 billion a year earlier, and a nine-month net loss of $104.04 billion, of which $94.32 billion was the change in fair value of convertible notes, derivative liabilities, and SAFEs.
It also reported purchase commitments and leases with an aggregate committed spend of about $895.4 billion, "substantially all of which is related to compute and infrastructure," including about $447.5 billion expected before December 31, 2030.

The new risk-factor text sits in a passage about Anthropic's use of its own models in research.
It says that "our increasing use of AI systems to accelerate our own research and development may cause the capabilities of our models to advance more rapidly than our ability to develop, validate, and implement corresponding safety, alignment, and security measures," that much of the company's evidence on the pace of that acceleration "is derived from lagging indicators," and that "we have in the past not identified, and may in the future not identify, a significant acceleration in our rate of development until after it has occurred."
It then gives the threshold statement as an example, adds "We have not designated any of our current models as exceeding this threshold, and we continue to assess the underlying data," and says Anthropic is "evaluating the implications of meeting the AI research and development capability threshold and will release further reports in the future as we set forth in our Responsible Scaling Policy."

The threshold is defined in version 3.4 of the Responsible Scaling Policy, effective July 8, 2026, whose changelog says the update revised "our threshold for automated R&D."
The policy treats the threshold as met if Anthropic determines either that its models "would be able to fully substitute for our entire set of Research Scientists and Research Engineers, at competitive costs (i.e., within a factor of 5)," or that there is "dramatic acceleration" of the pace of AI progress likely related to the automation of AI R&D.
The second condition applies where Anthropic observes or expects "double the rate of progress" in aggregate AI capabilities compared with both the expected rate and the fastest extended rate seen without significant AI contributions, and where the doubling is plausibly attributable to automated research or engineering.

In the business section, the amendment kept the original filing's description of a "recursive dynamic" it calls "closing the loop," in which each Claude model helps build the next, and its statement that using AI to build more capable AI "could also pose a considerable safety risk, particularly if it sharply accelerates the pace of progress."
It added that "we do not anticipate being able to safely use Claude to fully autonomously design and build successive generations of frontier models without meaningful human supervision or understanding, if and when that becomes technically possible."
A separate new sentence says Anthropic is considering measures, "including updates to our Responsible Scaling Policy, to require human review and approval of certain decisions in our research and development processes as our models perform an increasing share of that work."

Axios first published its story on the amendment at 15:06 UTC; its updated version listed the self-improvement language among three things in the amended paperwork "that were not previously known."
TechCrunch's Julie Bort reported the risk factor that evening, describing it as a warning that Anthropic may soon meet its own definition of recursive self-improvement and noting that "an S-1 functions as both disclosure and marketing."

## Why It Matters

Anthropic's second risk report, published on August 14, kept its automated-R&D risk rating at "low" and said internal AI research was faster with AI assistance "but not yet by a factor of 2," while warning that its task-based evaluations had saturated.
The November amendment moves the company's public position from that measurement to an expectation that the doubling condition may be met soon, and it does so in a registration statement, where statements carry liability under the Securities Act of 1933, rather than in a voluntary safety publication.
The admission that past accelerations were recognized only after the fact bears directly on whether a threshold defined by observed rates of progress can trigger safeguards before it is crossed.

The filing does not name the future models it refers to, give a date, or say which safeguards the policy would require once the threshold is met.
The promised human-control update to the Responsible Scaling Policy had not been published when the amendment was filed, and no external body has assessed the internal estimates behind the statement.
Whether Anthropic formally designates a model as meeting the threshold, and what it publishes when it does, will determine whether this disclosure is read as an early warning or as risk language written for prospective investors.
