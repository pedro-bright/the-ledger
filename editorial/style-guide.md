# Style Guide

*Writing standards for The Ledger.*

**Version:** 1.0 | **Last updated:** 2026-03-08

---

## Voice and Tone

### What we aim for

- **Precise but readable.** Technical accuracy without jargon where possible. When technical terms are necessary, use them — but explain them on first use if the audience might not know them.
- **Confident but not arrogant.** State what is known clearly. Acknowledge what is uncertain. Never bluff.
- **Analytical but not cold.** The Ledger documents events that affect real people, real livelihoods, and real futures. Write with the appropriate gravity.
- **Opinionated about significance, humble about interpretation.** We take positions on what matters. We hold our interpretations lightly and revise them when evidence warrants.

### What we avoid

- **Corporate blandness.** "We're excited to announce" belongs in press releases, not historical records.
- **Breathless hype.** "Revolutionary," "game-changing," and "unprecedented" are almost always overstatements. Use them only when literally true.
- **False balance.** Not every claim has two equal sides. When evidence strongly favors one reading, say so — while documenting dissenting views.
- **Passive voice for attribution avoidance.** "The policy was changed" obscures who changed it. "OpenAI changed the policy" is better.

## Structure

### Event files

Every event follows this structure:

1. **Summary** (2-4 sentences): The canonical summary — what readers see first. Written in past tense. Should be self-contained: a reader who reads only the summary should understand what happened and why it matters.

2. **What Happened** (3-8 paragraphs): Detailed narrative of the event. Chronological where possible. Sourced claims. Present specific details: dates, numbers, names, quotes where relevant.

3. **Why It Matters** (2-5 paragraphs): Analysis and significance. Labeled as editorial interpretation. Connects the event to broader trends and threads. This is where the value of The Ledger emerges — not just documenting events but interpreting their significance.

4. **Timeline** (optional): For multi-day events, a chronological list of key moments.

5. **Analysis** (optional): Deeper editorial analysis for landmark events. Must be signed by the author.

### Thread files

1. **Canonical Synthesis**: The signed narrative synthesis. Updated when significant events are added.
2. **The Arc**: Historical progression of the thread, organized by period.
3. **Interpretations**: 2-4 competing readings, each with identified proponents.
4. **Open Questions**: 3-6 unresolved questions.

## Formatting Conventions

### Dates

- In prose: "March 14, 2023" or "on March 14"
- In frontmatter: ISO 8601 format (`2023-03-14`)
- Relative dates (e.g., "last year") should never appear — they become meaningless over time

### Numbers

- Spell out numbers below 10 in prose
- Use numerals for technical measurements, scores, and statistics
- Use standard abbreviations for large numbers: $13 billion, 10^26 FLOP, 405B parameters
- Percentages: "76.5%" (numeral + symbol in technical context)

### Model names

- Use official capitalization: GPT-4, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1
- On first reference in an event, include the developing company: "OpenAI's GPT-4"
- On subsequent references within the same file, the model name alone is sufficient

### Company and organization names

- Use the most common name: "OpenAI" not "OpenAI LP" or "OpenAI Global LLC"
- On first reference, include relevant context if needed: "Anthropic, the AI safety company founded by former OpenAI researchers"
- Government bodies: use common names, not formal titles: "the Pentagon" is fine, "DoD" after first reference

### Quotes

- Use direct quotes sparingly and only when the exact wording matters
- Attribute all quotes to specific individuals, not organizations
- Format: Sam Altman stated, "quote here."

### Links

- In markdown body: use descriptive link text, not raw URLs
- Sources in frontmatter: include both `url` and `title` fields

## Quality Checklist

Before submitting an event:

- [ ] Summary is self-contained and could stand alone
- [ ] All factual claims have sources
- [ ] Analysis is labeled and distinguished from factual reporting
- [ ] Dates are specific and accurate
- [ ] Actor references match entries in the actor registry
- [ ] Thread connections are identified
- [ ] Frontmatter is complete (id, title, date, category, sources)
