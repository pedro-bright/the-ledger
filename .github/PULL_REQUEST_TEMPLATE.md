## Summary

<!-- What does this PR do? If adding/editing events, which ones? -->

## Type of Change

- [ ] 📰 New event(s)
- [ ] 🧵 New or updated thread
- [ ] ⚖️ New or updated controversy
- [ ] 📝 Canonical synthesis (new or updated)
- [ ] 🔄 Reinterpretation / retrospective
- [ ] ⚙️ Schema or tooling change
- [ ] 📚 Editorial / documentation
- [ ] 🐛 Fix / correction

## Review Checklist

### All Content Changes
- [ ] YAML frontmatter passes schema validation (`npm run validate`)
- [ ] All source URLs are accessible and correctly typed
- [ ] Dates are accurate (ISO 8601 format)
- [ ] IDs follow kebab-case convention

### Events
- [ ] At least one source with `type: primary` or `type: secondary`
- [ ] Category is appropriate
- [ ] 72-hour rule respected (event is at least 72h old)
- [ ] Summary section is concise and factual
- [ ] Claims are attributed, not asserted as fact

### Threads & Syntheses
- [ ] Thread has a named curator
- [ ] Synthesis is signed (author + date)
- [ ] Competing interpretations are fairly represented
- [ ] Core question is clearly stated

### Enrichment (Tier 2)
- [ ] Actor references exist in `content/actors/`
- [ ] Thread connections are bidirectional (event lists thread, thread lists event)
- [ ] Significance level is justified
- [ ] Confidence level reflects source quality

### Editorial
- [ ] No silent rewrites of published content
- [ ] AI assistance disclosed where applicable
- [ ] Bias disclosures included where relevant

## Related Issues

<!-- Link any related issues: Fixes #123, Relates to #456 -->

## Notes for Reviewers

<!-- Any context that would help reviewers? -->
