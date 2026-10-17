---
id: openai-employee-charged-executive-conference-room-recording-device
title: "OpenAI Engineer Charged With Planting a Recording Device in an Executive Conference Room"
date: 2026-10-13
category: policy
significance: notable
confidence: high
sources:
  - url: https://www.justice.gov/opa/pr/saudi-national-arrested-installing-surreptitious-audio-recording-device-openai
    title: "Saudi National Arrested for Installing Surreptitious Audio Recording Device at OpenAI"
    type: official
    publisher: U.S. Department of Justice, Office of Public Affairs
    date: 2026-10-13
    accessed: 2026-10-17
    archive_url: https://web.archive.org/web/20261017130150/https://www.justice.gov/opa/pr/saudi-national-arrested-installing-surreptitious-audio-recording-device-openai
  - url: https://x.com/OpenAINewsroom/status/2110095403198849132
    title: "OpenAI Newsroom statement on the recording device found in an OpenAI office"
    type: primary_recording
    publisher: OpenAI (X)
    date: 2026-10-13
    accessed: 2026-10-17
    archive_url: https://web.archive.org/web/20261014002107/https://x.com/OpenAINewsroom/status/2110095403198849132
  - url: https://techcrunch.com/2026/10/13/fbi-arrests-openai-employee-accused-of-planting-hidden-recording-device-in-conference-room/
    title: "FBI arrests OpenAI employee accused of planting hidden recording device in conference room"
    type: secondary_reporting
    publisher: TechCrunch
    date: 2026-10-13
    accessed: 2026-10-17
  - url: https://www.semafor.com/article/10/14/2026/saudi-national-arrested-over-alleged-planting-of-recording-device-at-openai
    title: "Saudi national arrested over alleged planting of recording device at OpenAI"
    type: secondary_reporting
    publisher: Semafor
    date: 2026-10-14
    accessed: 2026-10-17
  - url: https://www.bloomberg.com/news/articles/2026-10-14/arrested-openai-engineer-booked-a-one-way-ticket-to-saudi-arabia
    title: "Saudi National Charged in OpenAI Recording Case Booked One-Way Flight Out"
    type: secondary_reporting
    publisher: Bloomberg
    date: 2026-10-14
    accessed: 2026-10-17
actors:
  - id: openai
    role: subject
  - id: us-doj
    role: subject
  - id: us-fbi
    role: participant
regions: [US]
tags: [insider-threat, corporate-espionage, counterintelligence, federal-prosecution, lab-security]
threads: []
related: [trump-nspm-11-ai-national-security, nsa-cisa-fbi-distillation-advisory-aa26-251a, anthropic-threat-report-seven-chinese-labs-distillation]
state: published
revision:
  created: 2026-10-17
  last_reviewed: 2026-10-17
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On October 13, 2026, the Justice Department announced that Abdulrahman Alfozan, a 35-year-old Saudi national who had worked as an engineer at OpenAI since July 2025, had been arrested on October 9 and charged with using or attempting to use a device to intercept oral communications.
According to the complaint, OpenAI staff found a concealed audio recording device on or about September 30 in a USB port behind a television in an executive conference room at one of the company's San Francisco buildings.
OpenAI said it used its own models to analyze the device and identify the employee who planted it, referred the matter to the FBI, and found no indication that he had accessed or taken model weights, source code or customer data.
The charge carries a maximum of five years in prison; the allegations have not been proven in court.

## What Happened

The Justice Department release, issued by its Office of Public Affairs on the day of Alfozan's initial appearance in federal court in the Northern District of California, summarized a complaint unsealed that day.
According to the complaint, OpenAI determined that the device, which had been wrapped in toilet paper, was installed on or about September 28, and that its contents were encrypted.
Closed-circuit camera footage showed Alfozan near the room on multiple dates before the discovery, although he had no authority to enter it or attend its meetings, which the complaint said frequently covered proprietary research, product plans, government engagements and commercial relationships.

The release described two kinds of AI-related evidence.
Before September 28, Alfozan allegedly used a productivity tool to ask about OpenAI's building addresses, meeting rooms, room calendars, "leadership and exec" locations and external partner meetings.
Between September 24 and September 30, a chatbot account associated with his spouse, which the complaint said shared identifiers with his own account, allegedly submitted prompts about building, customizing, installing, testing, obfuscating and remotely accessing a device, including inquiries about "build[ing] a continuous audio recorder," "improv[ing] audio and live listening" and "encrypt[ing] the SD card," and on September 27 and 28 asked about the specific device's custom header and MAC address.
The release does not name the chatbot.
On or about October 5, Alfozan allegedly entered the conference room and looked behind the television, and on the same day OpenAI security opened a bag he had left unattended in another room and found his wallet, his identification and a second, similar recording device.

OpenAI's Newsroom account posted at 19:48 UTC on October 13 that it had discovered "a sophisticated recording device," that "We used our models to understand the device and where it had come from," and that the employee had been terminated.
An OpenAI spokesperson told TechCrunch that Alfozan worked on the product team and that the device had "advanced encryption, audio monitoring capabilities, and a mechanism for transferring data designed to evade monitoring."
Bloomberg reported on October 14 that Alfozan had booked a one-way flight out of the country.

The release quoted three officials.
FBI Director Kash Patel said Alfozan allegedly planted the device "to secretly capture sensitive communications about the company's super intelligence technology" and called protecting "American SI innovation" one of the FBI's "highest counterintelligence priorities."
Director of National Intelligence Jay Clayton said the case "underscores why winning the global super intelligence race is a national security prerogative" and cited President Trump's creation of the Super Intelligence Force; Semafor reported that Clayton chairs the White House AI task force, which was days from its first meeting.
U.S. Attorney Craig H. Missakian said, "For us it is a matter of national security."
Assistant U.S. Attorney Nicolas Parker is prosecuting the case with a trial attorney from the National Security Division's Counterintelligence and Export Control Section, and the release said the prosecution supports NSPM-11.

## Why It Matters

The case is a federal prosecution of alleged covert surveillance inside a frontier AI lab, and the government presented it in national security terms: the release came from the department's Office of Public Affairs, carried statements from the FBI Director and the Director of National Intelligence, and tied the case to NSPM-11.
It follows the September NSA, CISA and FBI advisory on distillation of US models and Anthropic's September threat report on the same practice, which treated model outputs as the target; here the alleged target was the spoken discussions of a lab's executives.

The case also shows AI systems on both sides of an insider investigation.
OpenAI says its own models helped trace the device to an employee, and the complaint, as summarized by prosecutors, relies in part on chatbot prompts about building and hiding a recorder.
How the investigators obtained and attributed those prompts, and whether the chatbot belonged to OpenAI, is not stated in the release.

Much remains unknown.
The complaint, as described in the release, charges a single interception offense; the release does not allege that Alfozan acted for a foreign government or company, and the purpose of the recordings and whether any were retrieved have not been disclosed.
