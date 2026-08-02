---
id: anthropic-claude-mythos-cryptanalysis
title: "Anthropic Reports AI-Assisted Advances Against HAWK and Reduced-Round AES"
date: 2026-07-28
category: research
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/research/discovering-cryptographic-weaknesses
    title: "Discovering cryptographic weaknesses with Claude"
    type: official
    publisher: Anthropic
    date: 2026-07-28
    accessed: 2026-08-02
    archive_url: https://web.archive.org/web/*/https://www.anthropic.com/research/discovering-cryptographic-weaknesses
  - url: https://www.nytimes.com/2026/07/28/us/politics/anthropic-ai-encryption-security-aes.html
    title: "Anthropic AI Model Finds Flaws in Tough-to-Crack Encryption Algorithms"
    type: secondary_reporting
    publisher: The New York Times
    date: 2026-07-28
    accessed: 2026-08-02
actors:
  - id: anthropic
    role: subject
regions: [US]
tags: [cryptanalysis, post-quantum-cryptography, aes, ai-for-science, dual-use, mathematical-discovery]
threads: [frontier-safety-policies]
related: [anthropic-claude-opus-5-release, anthropic-glasswing-expansion-june-2026, openai-patch-the-planet]
state: published
revision:
  created: 2026-08-02
  last_reviewed: 2026-08-02
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On July 28, 2026, Anthropic reported that Claude Mythos Preview had helped develop improved attacks against HAWK, a post-quantum digital-signature scheme, and seven-round AES, a reduced research variant of the widely deployed encryption standard.
Anthropic estimated that the HAWK-256 attack reduced the required work from approximately 2^64 to 2^38 operations and that a separate method called Möbius Bridge improved prior attacks on seven-round AES by 200 to 800 times.
The reported results did not break production AES or deployed cryptographic systems, and both projects required substantial computing expenditure and human validation.

## What Happened

Anthropic organized long-running research workflows around Claude Mythos Preview and gave the model access to code execution, mathematical references, and tools for testing candidate attacks.
The company said the HAWK project ran for approximately 60 hours, cost about $100,000 in model usage, and involved occasional human guidance focused primarily on project management.

HAWK is a post-quantum digital-signature construction that had been considered in standardization work.
Anthropic reported that the model-assisted effort found a previously unknown symmetry that improved key recovery against HAWK-256, lowering the estimated computational requirement from approximately 2^64 to 2^38 operations.
The company stated that larger HAWK parameter sets remained impractical to attack and that the result did not compromise deployed production systems.

A separate effort targeted seven-round AES rather than the full AES-128 standard, which uses 10 rounds.
Claude developed a fingerprinting method called Möbius Bridge that Anthropic said made the reduced-round attack 200 to 800 times faster than previous techniques.
The initial discovery took approximately one week and generated about one billion output tokens, while researchers then spent several hundred hours checking the result and preparing the technical account.

Anthropic also reported attacks or improvements involving reduced-round versions of LEA, Serpent-128, Salsa20, Poseidon, and SHA-1.
These results varied in scope and practicality, and none was presented as a break of the full production versions of the affected cryptographic systems.

The company said it followed coordinated disclosure procedures before publication.
Anthropic notified HAWK's designers, consulted academic cryptographers, and provided advance material to US government and industry specialists.
It released technical papers, demonstration code, and a cryptanalysis benchmark alongside the public account.

## Why It Matters

The work provided a concrete case of a frontier model contributing to new mathematical cryptanalysis rather than only summarizing known attacks or generating implementation code.
The strongest claims remained dependent on Anthropic's research setup and validation process, but the reported methods were specific enough to be examined by outside cryptographers and the HAWK result changed the estimated security of a named construction.

The projects also showed the resources hidden behind claims of autonomous scientific discovery.
The model runs cost roughly $100,000 per major effort, required custom scaffolding and tool access, and were followed by extensive human verification that took longer than the initial discovery.
This makes the event evidence of a new research workflow rather than evidence that cryptographic research had become fully autonomous.

The dual-use implications remain unresolved.
Methods that accelerate defensive review of proposed standards can also reduce the time required to search for exploitable weaknesses, while the distinction between reduced-round research results and practical attacks can be lost in public descriptions.
The event therefore records both an advance in AI-assisted mathematical research and the continuing need for expert validation, coordinated disclosure, and precise statements about what was not broken.
