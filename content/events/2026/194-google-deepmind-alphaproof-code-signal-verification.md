---
id: google-deepmind-alphaproof-code-signal-verification
title: "Google DeepMind's AlphaProof Code Agents Formally Verify Signal's Protocol Implementation at the Machine-Code Level"
date: 2026-11-10
category: research
significance: notable
confidence: high
sources:
  - url: https://deepmind.google/blog/introducing-alphaproof-code/
    title: "Introducing AlphaProof Code: a breakthrough in verifying complex software at depth"
    type: official
    publisher: Google DeepMind
    date: 2026-11-10
    accessed: 2026-11-13
    archive_url: https://web.archive.org/web/20261110121209/https://deepmind.google/blog/introducing-alphaproof-code/
  - url: https://deepmind.google/documents/36/Formal_Verification_of_Signal_4.pdf
    title: "AlphaProof Code: Verifying Signal's Security at the Machine-Code Level"
    type: primary_document
    publisher: Google DeepMind
    date: 2026-11-10
    accessed: 2026-11-13
    archive_url: https://web.archive.org/web/20261111193806/https://deepmind.google/documents/36/Formal_Verification_of_Signal_4.pdf
  - url: https://www.wired.com/story/a-new-ai-tool-from-google-deepmind-formally-verified-the-signal-protocol/
    title: "A New AI Tool From Google DeepMind Proved the Signal Protocol Is Secure"
    type: secondary_reporting
    publisher: WIRED
    date: 2026-11-10
    accessed: 2026-11-13
actors:
  - id: google-deepmind
    role: subject
  - id: signal-foundation
    role: participant
regions: [US, UK]
tags: [formal-verification, Lean, cryptography, AlphaProof, agentic-ai, software-security]
threads: [ai-for-science]
related: [alphaproof-nature-paper, gemini-deep-think-imo-2025-gold, anthropic-claude-mythos-cryptanalysis, openai-linux-kernel-948-root-exploits-pipeline]
state: published
revision:
  created: 2026-11-13
  last_reviewed: 2026-11-13
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On November 10, 2026, Google DeepMind announced AlphaProof Code, a system of AI agents that it used to prove key security properties of libsignal, the reference implementation of the Signal protocol, against the compiled machine code itself.
The agents generated "about 6.5 million lines of machine-checked Lean proof code," which cover Signal's post-quantum PQXDH handshake and Triple Ratchet; a team of five people did the work in four weeks.
DeepMind called the result "the first time the implementation of a widely deployed protocol like this has been formally verified by any method, with or without AI," and released the Lean development publicly.

## What Happened

DeepMind published the announcement, by Pushmeet Kohli and Swarat Chaudhuri, at 12:00 UTC on November 10, together with a technical paper by nine researchers from Google DeepMind and Google.
WIRED published a report by Lily Hay Newman at 05:01 UTC the same day.
The paper describes AlphaProof Code as "a human-guided agent for writing Lean specifications of code, a formal semantics of AArch64 machine code, and a team of autonomous prover agents whose proofs are accepted only if Lean's kernel checks them against the approved specification."

The target was libsignal v0.105.4, restricted to one-to-one sessions and compiled to ARM machine code.
According to the paper, the proofs establish "forward secrecy, authentication, post-compromise security, and handshake secrecy" for the PQXDH handshake and Triple Ratchet, and "are the first proofs connecting protocol-level security guarantees to the unmodified code of a widely used cryptographic protocol implementation."
The 6.5 million lines of proof rest on "about 26,000 lines of trusted specifications and AArch64 semantics," which the proofs assume to be correct.

Specifications were written through exchanges between the researchers and "agents powered by Gemini 4 Carbon and Claude Opus 5.5," and the announcement says human experts reviewed every one.
The paper states that "The proofs were produced entirely by agent teams powered by Gemini 4 Carbon," and that "none of the authors wrote any proof code."
A typical proof campaign "had 40 to 80 agents and ran on a single machine for 24 to 72 hours."
The announcement says the agents flagged "just one percent of the codebase" for a second human look.

To check that the system could tell correct code from flawed code, the researchers reapplied two previously fixed libsignal bugs, both originally found by Cheval, Jacomme and Richards, to an isolated copy of the code.
The announcement says that "In both cases, the system produced a machine-checked proof that the buggy version was insecure."
WIRED reported that the analysis found no new vulnerabilities in the parts of the protocol it examined.

The paper lists what the proofs do not cover, including "Computational secrecy, more than two parties, and SPQR's post-quantum healing" and "Quantum attackers, multi-device state"; group messaging is left as future work.
WIRED noted that the work "did not, for example, formally verify the entire Signal mobile app."
Signal's chief technology officer, Ehren Kret, said in a statement quoted by both DeepMind and WIRED: "While prior formal verification focused on smaller portions of the code, Google DeepMind's approach enables significant expansion."
WIRED reported that DeepMind did the analysis free of charge as a research project, that Google declined to share its cost, and that the company declined to say whether it plans a commercial verification product.

## Why It Matters

Formal verification has been limited by its cost.
The paper cites the seL4 microkernel, which "took twenty person-years to verify," and the CompCert C compiler, which took six.
AlphaProof Code applies the agent-generated Lean proofs that DeepMind's AlphaProof used for competition mathematics in 2024 to production software, and reports a four-week effort by five people on the reference implementation of a protocol that, in DeepMind's words, protects "billions of private conversations in apps like Signal and Google Messages."

DeepMind presents the work as a defense against "agent-driven cyber threats."
It follows a year in which the Ledger has recorded AI systems finding and exploiting flaws at scale, including OpenAI's agent pipeline that produced 948 working Linux root exploits and Anthropic's report that Claude Mythos Preview helped develop improved attacks on cryptographic schemes.
The paper notes that a proof "rules out every bug or attack that would violate those properties"; that guarantee holds only within the stated scope and only if the trusted specifications are correct.

The claims of priority are DeepMind's own, and no independent group had checked the proofs by the time of writing; the released Lean development makes that possible.
The cost of the compute used was not disclosed, so it is not yet known whether the method is affordable for other organizations.
Chaudhuri told WIRED that "there is a long distance to go before we are able to scale this to all the software of the world."
