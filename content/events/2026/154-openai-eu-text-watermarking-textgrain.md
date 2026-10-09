---
id: openai-eu-text-watermarking-textgrain
title: "OpenAI Watermarks ChatGPT and Codex Text in the EU Only and Limits Its Detector to Approved Researchers"
date: 2026-10-05
category: policy
significance: notable
confidence: high
sources:
  - url: https://openai.com/index/eu-text-provenance/
    title: "Our approach to EU text provenance rules"
    type: official
    publisher: OpenAI
    date: 2026-10-05
    accessed: 2026-10-09
    archive_url: https://web.archive.org/web/20261005170359/https://openai.com/index/eu-text-provenance/
  - url: https://cdn.openai.com/pdf/e9508624-d767-41b6-a26d-e34ca798ada6/textgrain-entropy-calibrated-watermarking-for-language-model-text.pdf
    title: "textGrain: Entropy-Calibrated Watermarking for Language Model Text"
    type: primary_document
    publisher: OpenAI
    date: 2026-10-05
    accessed: 2026-10-09
    archive_url: https://web.archive.org/web/*/https://cdn.openai.com/pdf/e9508624-d767-41b6-a26d-e34ca798ada6/textgrain-entropy-calibrated-watermarking-for-language-model-text.pdf
  - url: https://techcrunch.com/2026/10/05/openai-will-start-watermarking-chatgpts-text-in-the-eu/
    title: "OpenAI will start watermarking ChatGPT's text in the EU"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-05
    accessed: 2026-10-09
  - url: https://techcrunch.com/2024/08/04/openai-says-its-taking-a-deliberate-approach-to-releasing-tools-that-can-detect-writing-from-chatgpt/
    title: "OpenAI says it's taking a 'deliberate approach' to releasing tools that can detect writing from ChatGPT"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2024-08-04
    accessed: 2026-10-09
actors:
  - id: openai
    role: subject
  - id: eu
    role: regulator
  - id: european-commission
    role: regulatory-context
  - id: anthropic
    role: context
  - id: google-deepmind
    role: context
regions: [EU, US]
tags: [watermarking, eu-ai-act, transparency, provenance, content-authentication, textgrain]
threads: []
related: [anthropic-claude-text-watermarking, eu-ai-act-gpai-obligations-force]
state: published
revision:
  created: 2026-10-09
  last_reviewed: 2026-10-09
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 5, 2026, OpenAI said it would add an invisible watermark to text produced by ChatGPT and Codex for users in the European Union, citing the EU AI Act's requirement that generated text be identifiable in a machine-readable way.
Outside the EU the watermark is not applied by default; API customers anywhere can opt in for select models.
OpenAI limited access to its detector to approved researchers and expert organizations, and published test results in which replacing 10% of a passage's words with synonyms cut detection from about 92% to 66%.
The watermarking method, called textGrain, was described in a technical report co-written with researchers from the University of Pennsylvania and Yale.

## What Happened

The AI Act's transparency obligations for generative systems took effect on August 2, 2026.
In a post titled "Our approach to EU text provenance rules," OpenAI described a three-part rollout.
API customers globally could opt in to text watermarking for select models starting that day, with watermarking left "off by default in the API."
"Over the coming weeks," the company wrote, it would add the watermark to eligible ChatGPT and Codex output in the EU, "across all plans in the EU only," adding that it was "not making text watermarking a global default at launch."
It also opened applications for its detector, which it said would initially be granted case by case under the EU Code of Practice on AI-generated content.

textGrain alters the model's sampling of each next token using pseudorandom values derived from a secret key and the preceding text.
The 20-page technical report, dated October 5 and authored by five OpenAI researchers and four from Penn and Yale, says the detector "requires only the generated text and the secret key."
OpenAI wrote that textGrain matched or exceeded the other approaches it tested, including Google DeepMind's SynthID for text, and said it planned to release the technology as open source.

The company published figures on the method's limits.
At a target false positive rate of 1%, the detector found watermarks in about 80% of 200-token passages and about 95% of 400-token passages on psychology content, with "substantially lower" rates on mathematics, where word choice is more constrained.
In 400-token passages, replacing 10% of words with synonyms reduced detection from about 92% to 66%, and replacing 25% reduced it to 17%.
OpenAI said these results were part of why it was not making the detector public at launch.
On eight benchmarks run with GPT-6 Astra, watermarked output scored higher than unwatermarked output on five and lower on three; the largest decline was on DeepSWE v1.1, from 72.80% to 71.68%.

The post listed what a detection result does not establish.
A watermark "does not measure human contribution," "does not establish ownership or responsibility," "does not identify the user," and "does not verify accuracy."
"The absence of a detected watermark does not prove human authorship," OpenAI wrote, because text may be too short, edited, translated, or generated by another company's tools.

## Why It Matters

Two of the largest frontier labs answered the same EU obligation in opposite ways.
Anthropic, in August, applied its text watermark to Claude output worldwide because it lacked "a durable way to scope it by region"; OpenAI confined its consumer watermark to the EU and left the rest of the world opt-in.
Users outside the EU therefore receive marked text from one major assistant and unmarked text from the other, which bears on any future attempt to use watermark detection as evidence of AI use across jurisdictions.

The announcement departs from the position OpenAI stated in 2024.
In August 2024, after The Wall Street Journal reported that OpenAI had built a text watermark and was debating its release, the company said it was taking a "deliberate approach," citing "susceptibility to circumvention by bad actors and the potential to disproportionately impact groups like non-English speakers."
The 2026 post attributes the rollout to the AI Act's requirements, and its own editing results confirm the circumvention concern the company raised two years earlier.

What remains unknown is how the detector will be used once access widens.
OpenAI did not say when, or under what criteria, it would open detection beyond approved researchers, and its published editing results mean a negative result says little about text that a user has reworded to avoid detection.
Whether EU regulators regard a watermark that OpenAI's own tests show can be largely removed by replacing a quarter of the words as satisfying the Act's machine-readability requirement has not been tested.
