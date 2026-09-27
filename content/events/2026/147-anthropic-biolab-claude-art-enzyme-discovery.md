---
id: anthropic-biolab-claude-art-enzyme-discovery
title: "Anthropic Reports That Claude Agents Identified a New Family of Phage Reverse Transcriptases in Its Lab's First Result"
date: 2026-09-23
category: research
significance: notable
confidence: high
sources:
  - url: https://www.anthropic.com/news/claude-discovers-novel-enzyme-system
    title: "Claude discovers a novel enzyme system with CRISPR-like repeats"
    type: official
    publisher: Anthropic
    date: 2026-09-23
    accessed: 2026-09-27
    archive_url: https://web.archive.org/web/20260927022125/https://www.anthropic.com/news/claude-discovers-novel-enzyme-system
  - url: https://www-cdn.anthropic.com/22573675ada52a8ca8a97a1a4b4326b2f208a071.pdf
    title: "Autonomous AI agents discover reverse transcriptases with tandem repeat arrays"
    type: primary_document
    publisher: Anthropic
    date: 2026-09-23
    accessed: 2026-09-27
    archive_url: https://web.archive.org/web/20260925114528/https://www-cdn.anthropic.com/22573675ada52a8ca8a97a1a4b4326b2f208a071.pdf
  - url: https://x.com/DarioAmodei/status/2102831170299834652
    title: "Dario Amodei on X: the Claude-led discovery of a molecular machine"
    type: primary_recording
    publisher: Dario Amodei (personal)
    date: 2026-09-23
    accessed: 2026-09-27
    archive_url: https://web.archive.org/web/20260923184314/https://twitter.com/DarioAmodei/status/2102831170299834652
  - url: https://www.theverge.com/ai-artificial-intelligence/999470/anthropic-biolab-claude-crispr
    title: "Anthropic's biolab made a discovery it's comparing to Crispr"
    type: secondary_reporting
    publisher: The Verge
    date: 2026-09-23
    accessed: 2026-09-27
  - url: https://techcrunch.com/2026/09/23/anthropic-says-its-biology-lab-has-already-found-something-big/
    title: "Anthropic says its biology lab has already found something big"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-09-23
    accessed: 2026-09-27
actors:
  - id: anthropic
    role: subject
  - id: dario-amodei
    role: executive
regions: [US]
tags: [ai-for-science, genome-mining, reverse-transcriptase, crispr, agentic-research, interpretability]
threads: [ai-for-science]
related: [anthropic-model-hardware-standard, john-jumper-joins-anthropic, openai-mathematics-advisory-group-ias]
state: published
revision:
  created: 2026-09-27
  last_reviewed: 2026-09-27
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On September 23, 2026, Anthropic announced a life sciences research group with its own wet laboratory and published its first result: Claude agents, working from a single research brief, identified a family of reverse transcriptases in bacteriophages that sit next to an array of repeated DNA and a dedicated partner gene.
Anthropic named the family array-associated reverse transcriptases (ART) and compared the repeat layout to a CRISPR array, while stating that it does not yet know what the system does.
An accompanying technical report says the campaign ran on Claude Mythos 5 across 1.9 billion metagenomic protein clusters in 21.5 hours without human intervention, and Anthropic says human scientists performed all of the laboratory work.

## What Happened

The announcement said Anthropic formed the research group in the spring of 2026 and built a lab in the Bay Area, restricted to biosafety levels 1 and 2, that does not handle pathogens that can infect humans.
"All of the lab work is performed by human scientists," the post said.
The team works in Claude Science and Claude Code; the post said Anthropic has experimented with the Model Hardware Standard for agent-operated equipment, previewed in August, but that the approach is "less conducive" to the lab's ad hoc molecular biology workflows.

The technical report, by six Anthropic researchers with Nicholas T. Perry and Matthew G. Durrant as corresponding authors, describes the search.
The agents wrote their own sequence profiles, recovered about 200,000 reverse transcriptase clusters, sorted them into nine classes, sampled about 11,000 loci, and scored 3,564 protein families that recurred near those loci as candidate partner genes.
The full campaign comprised 119 tasks and 949 agent sessions, or 77 agent-hours and 215.6 million tokens over 21.5 hours of wall-clock time; the announcement rounded these to roughly 950 agents, 210 million tokens and 21 hours.
Of the 17 candidate partner families the agents promoted, the report says "only three were confirmed as previously unreported RT associations," and the other 14 were rejected or set aside as annotation artifacts, parts of previously described systems, or genes that were general neighbors rather than dedicated partners.

ART came from an observation outside that scoring.
While reading raw DNA next to one reverse transcriptase, an agent wrote: "[The DNA next to the RT] is spectacular: I can see by eye a tandem repeat array … that's a CRISPR-like … repeat array?!"
The report defines ART as jumbo-phage reverse transcriptases coupled with an array of units of about 200 nucleotides and a partner gene, finds 95 distinct clusters in cultured jumbo phages and predicted viral contigs, 28 of them with a detectable array, and places the enzymes in a clade next to retrons.
The underlying enzyme had been described before: the original genome report for phage MarsHill identified the reverse transcriptase but, according to Anthropic, "described neither the repeats nor the partner gene."
Published RNA data from a Staphylococcus phage infection show the arrays highly expressed, and Anthropic's first experiments show them expressed as a set of distinct short RNAs, which the report reads as "suggesting an RT system directed by a repertoire of distinct RNAs."

The report adds two analyses of the model itself.
Rerunning the discovery as a benchmark across seven Claude models, 3,500 attempts in total, it found a gap between Opus 5.5, Mythos 5.1, Mythos 5 and Opus 5 and the other three, Opus 4.6, Opus 4.8 and Sonnet 5.
Using interpretability methods on the original session transcript, it attributes the agent's recognition of the repeats to "specific Mythos 5 internal signals that respond to repeated DNA."

Anthropic quoted Feng Zhang of MIT and the Broad Institute, who reviewed the pre-print, calling the association of RNA-repeat arrays with reverse transcriptases "genuinely intriguing" and saying it "merits further investigation."
In a post on X at 18:43 UTC, Dario Amodei wrote that the system's "precise function, biotechnological utility (if any), or level of significance is not yet clear," that the work was done "mostly, though not entirely, by Claude," and that a Stanford team had independently described a reverse transcriptase system "in some ways similar to the one Claude found, though they are distinct systems that evolved independently from each other."
He also wrote that Claude might eventually run experiments by "autonomously controlling lab equipment, with appropriate safeguards in place, but we aren't doing that today."

## Why It Matters

Anthropic presented the result as evidence about method rather than about the enzyme: an agent reading sequence data directly flagged a feature that a predefined pipeline would not have scored, and that an earlier human genome report had missed.
The report's own counts bound that claim.
Seventeen promoted candidates yielded three confirmed new associations, ART surfaced from a side observation, every analysis after the campaign was directed by Anthropic's scientists with Claude writing and running the code, and the laboratory work was done by people.

What is not known is most of what would decide the result's weight.
The function of ART has not been established, the findings are a company-hosted pre-print without peer review, and Anthropic's statement that Claude was first to notice the system's defining features rests on its own literature search, alongside the independent Stanford work Amodei acknowledged.
The Verge called the announcement "admittedly premature" and noted it came as Anthropic prepares to go public; TechCrunch wrote that it "will be up to the broader research community to validate how big, or new, this discovery actually is."

The Verge placed the announcement among AI companies' efforts to use scientific research to show the value of their models, citing OpenAI's recent mathematics results, and TechCrunch noted that it followed statements by Amodei and other AI chief executives that the industry must slow down.
Anthropic's announcement also set out constraints specific to biology: a lab limited to biosafety levels 1 and 2, experiments performed by people, and an explicit statement that autonomous control of lab equipment is a future possibility rather than current practice.
