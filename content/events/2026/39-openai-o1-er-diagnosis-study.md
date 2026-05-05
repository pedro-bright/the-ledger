---
id: openai-o1-er-diagnosis-study
title: "Harvard-BIDMC Study Finds OpenAI o1 Outperforms Physicians at Emergency Diagnosis, Published in Science"
date: 2026-04-30
category: research
significance: notable
confidence: high
sources:
  - url: https://www.science.org/doi/10.1126/science.adz4433
    title: "Performance of a large language model on the reasoning tasks of a physician"
    type: primary_document
    publisher: Science (AAAS)
    date: 2026-04-30
    accessed: 2026-05-05
    archive_url: https://web.archive.org/web/*/https://www.science.org/doi/10.1126/science.adz4433
  - url: https://techcrunch.com/2026/05/03/in-harvard-study-ai-offered-more-accurate-diagnoses-than-emergency-room-doctors/
    title: "In Harvard study, AI offered more accurate emergency room diagnoses than two human doctors"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-05-03
    accessed: 2026-05-05
actors:
  - id: openai
    role: subject
  - id: harvard-medical-school
    role: author
regions: [US]
tags: [clinical-ai, medical-diagnosis, emergency-medicine, openai-o1, peer-reviewed-study, science-journal]
threads: [ai-for-science]
related: [openai-gpt-rosalind]
state: published
revision:
  created: 2026-05-05
  last_reviewed: 2026-05-05
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On April 30, 2026, researchers at Harvard Medical School and Beth Israel Deaconess Medical Center published a study in Science finding that OpenAI's o1 model outperformed two attending physicians on emergency diagnosis tasks using 76 real, unprocessed cases drawn directly from the hospital's electronic health records. At initial triage, the model correctly identified the diagnosis or a very close equivalent in 67% of cases, against 55% and 50% for the two physicians. On five complex clinical management scenarios developed by 25 expert physicians, the model scored a median of 89%, compared to 34% for physicians using conventional resources including Google search. The authors call for prospective randomized trials before any clinical deployment.

## What Happened

The study (DOI: 10.1126/science.adz4433), published in Science Vol. 392, Issue 6797, was conducted by a team led by researchers at Harvard Medical School and Beth Israel Deaconess Medical Center (BIDMC), with collaborators from Stanford. It constitutes a peer-reviewed evaluation of clinical reasoning capability, designed to use real emergency department records rather than curated test sets.

The researchers constructed three evaluation frameworks. First, they identified 76 consecutive emergency department admissions at BIDMC and presented the data to both o1 and to two internal medicine attending physicians at three successive points of care: initial triage, first physician contact, and admission to a medical floor or ICU. The data was supplied without preprocessing — whatever existed in the electronic health record at each stage was what the AI and the physicians received. At initial triage, o1 correctly identified the diagnosis or a close equivalent in 67.1% of cases. The two attending physicians scored 55.3% and 50.0%. The gap narrowed at later stages as more information became available, but persisted throughout.

Second, the team evaluated clinical management reasoning using five complex case scenarios developed by a panel of 25 physician-experts from Massachusetts General Hospital, based on cases previously published in the New England Journal of Medicine. These scenarios tested decisions physicians describe as "management reasoning" — antibiotic selection, imaging workup, goals-of-care conversations. The model scored a median of 89% on these cases; physicians given the same cases and access to conventional aids including up-to-date Google search scored a median of 34%.

Third, the researchers compared o1 against earlier GPT-4o versions on standardized medical reasoning benchmarks, finding that o1 showed material improvements on tasks requiring multi-step clinical inference.

The study's limitations are explicitly foregrounded by the authors. The model worked from text alone; emergency physicians in practice draw on physical examination findings, vital sign trends, imaging, lab values available at bedside, nonverbal patient cues, and contextual factors absent from text records. The study evaluated reasoning in isolation from integrated care delivery. The authors did not claim AI is ready for clinical use and called explicitly for prospective randomized trials: "Our findings suggest an urgent need for prospective trials to evaluate these technologies in real-world patient care settings."

## Why It Matters

The publication of an AI-versus-physician clinical reasoning study in Science — one of the most selective research journals in any field — marks a threshold distinct from the large volume of white papers and preprints making similar claims that have accumulated since 2022. Publication in Science implies peer review by domain experts applying significant evidentiary scrutiny to study design, statistical methods, and the framing of conclusions. The peer review record provides a reputational anchor that authors and critics can cite in downstream debates about AI clinical deployment.

Two specific design choices make this study harder to dismiss than many antecedents. The researchers used real, unprocessed electronic health records — the same messy, incomplete, inconsistently formatted documentation that actual emergency physicians encounter — rather than curated case vignettes. And they measured performance at multiple sequential points of care rather than at a single optimized evaluation snapshot.

The scale of the management reasoning gap (89% vs. 34%) will be contested. The five scenarios were structured tests, not real-time clinical encounters, and were evaluated by expert panels rather than in operational settings. Whether the gap reflects genuine physician underperformance on structured tasks, artificial ceiling effects in the physician condition, or something about how the AI generates text resembling authoritative answers remains an open empirical question.

What the study does not establish: whether AI-assisted diagnosis improves patient outcomes (a randomized prospective trial question), whether performance generalizes beyond text-heavy specialties with strong diagnostic signal in the electronic record, whether the AI's error patterns differ from human errors in ways that matter clinically, and whether a text-only system is practically integrable into emergency workflows where information arrives in mixed modalities. The study's own authors are explicit about these limits. Its contribution is a peer-reviewed, high-scrutiny benchmark at a particular moment in the development of large-scale reasoning models — a data point the medical establishment will need to engage with as the field moves toward clinical deployment decisions.
