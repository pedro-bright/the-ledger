---
id: google-gemini-robotics-2
title: "Google DeepMind Introduces Gemini Robotics 2 for Whole-Body Robot Control"
date: 2026-07-30
category: models
significance: notable
confidence: high
sources:
  - url: https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots
    title: "Gemini Robotics 2 brings whole body intelligence to robots"
    type: official
    publisher: Google DeepMind
    date: 2026-07-30
    accessed: 2026-08-03
    archive_url: https://web.archive.org/web/*/https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots
  - url: https://www.bloomberg.com/news/articles/2026-07-30/google-unveils-gemini-ai-for-robots-struggling-with-dexterity
    title: "Google Unveils Gemini AI for Robots Struggling With Dexterity"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-07-30
    accessed: 2026-08-03
  - url: https://arstechnica.com/ai/2026/07/google-reveals-gemini-robotics-2-0-promising-improved-dexterity-and-safety/
    title: "Google reveals Gemini Robotics 2.0, promising improved dexterity and safety"
    type: secondary_reporting
    publisher: Ars Technica
    date: 2026-07-30
    accessed: 2026-08-03
actors:
  - id: google-deepmind
    role: subject
regions: [US]
tags: [robotics, embodied-ai, humanoid-robots, vision-language-action, dexterous-manipulation, physical-ai]
threads: []
related: [nvidia-cosmos-3-release]
state: published
revision:
  created: 2026-08-03
  last_reviewed: 2026-08-03
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On July 30, 2026, Google DeepMind introduced the Gemini Robotics 2 model family, which combined embodied reasoning with action models for humanoid, dual-arm, and smaller research robots.
Google said that, for the first time in its robotics program, the system could control an entire humanoid body rather than concentrating on upper-body manipulation.
The reasoning model became available through Google AI Studio, while the principal action models remained restricted to early-access partners and trusted testers.

## What Happened

The release contained three related systems.
Gemini Robotics 2 was a cloud-based vision-language-action model for translating instructions into robot movement, Gemini Robotics-ER 2 handled embodied reasoning and task planning, and Gemini Robotics On-Device 2 was designed for lower-latency local execution.
Google described the family as a shared approach to controlling different robot embodiments rather than a model tied to one machine.

On Apptronik's Apollo 2 humanoid, Google demonstrated walking, crouching, stretching, reaching, and object manipulation with both Inspire and SharpaWave multi-finger hands.
The company also tested the models on the Franka Duo dual-arm platform and used SO101, Dexmate, and Trossen hardware in on-device adaptation work.
Apptronik, Boston Dynamics, and Agile Robots participated as hardware or testing partners.

Google reported that the system could execute multistep tasks lasting several minutes and involving hundreds of decisions.
Gemini Robotics-ER 2 interpreted scenes, planned actions, monitored progress, and revised a plan after failures, while demonstrations also showed different robot types coordinating parts of a shared task.
The on-device model could be adapted to a new task with fewer than 200 demonstrations collected over several hours, according to the company.

Vendor-reported success rates varied substantially by task.
On Apollo 2 with Inspire hands, the model achieved 68.4% for picking objects from a table, 45.7% from the floor, and 76.3% from a shelf.
With SharpaWave hands, it achieved 92% for unscrewing a bulb but 36% for screwing a bulb and 44% for tying a trash bag.
On Franka Duo, Google reported 74.2% for general pick-and-place tasks, 78.9% for tool kitting, and 89.6% for precise insertion.

Google also introduced the ASIMOV-Agentic benchmark for evaluating how embodied agents follow safety instructions and respond to uncertainty.
The company reported 97.9% accuracy on safety-instruction following and 93% accuracy when classifying whether a person was within one meter of the robot.
These results were published by Google and had not been independently replicated at the time of the release.

Gemini Robotics-ER 2 was made available through Google AI Studio, with an enterprise private preview also announced.
Gemini Robotics 2 and the on-device action model remained limited to selected partners through a trusted-tester program.
Google's model documentation advised against safety-critical deployment in healthcare, transportation, or other settings where a malfunction could cause injury, death, or property damage.

## Why It Matters

Gemini Robotics 2 extended Google's general-model strategy from perception and upper-body manipulation to coordinated whole-body control across several robot forms.
The combination of high-level planning, cloud action generation, and on-device execution placed reasoning and motor control within one named model family, rather than treating them as separate research systems.

The release also documented how far the systems remained from reliable general deployment.
Several dexterous tasks succeeded in fewer than half of trials, movement speed remained below human performance, and the main action models were not publicly available for independent testing.
The strongest claims therefore described a broader control architecture and new demonstrations, not a production-ready humanoid worker.
