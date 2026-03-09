# Epistemic Status Guide

*How The Ledger classifies and communicates the reliability of its claims.*

**Version:** 1.0 | **Last updated:** 2026-03-08

---

## Overview

A single "confidence" label is insufficient for a system that claims epistemic rigor. The Ledger uses an orthogonal status model with six independent dimensions. Each dimension captures a different aspect of a claim's reliability.

## The Six Dimensions

### 1. Publication Status

The claim's lifecycle state.

| Value | Meaning |
|-------|---------|
| `draft` | Under preparation, not yet public |
| `published` | Live and visible to readers |
| `withdrawn` | Removed by author or editorial decision |

### 2. Contestation Status

Whether the claim has been formally challenged.

| Value | Meaning |
|-------|---------|
| `unchallenged` | No formal challenge filed |
| `challenged` | A formal challenge is active |
| `disputed` | Challenge has been substantiated but not resolved |
| `resolved` | Challenge has been resolved (may result in revision or dismissal) |

**Important:** `unchallenged` does NOT imply `corroborated`. The absence of objection is not validation.

### 3. Evidence Level

The strength of evidence supporting the claim.

| Value | Meaning |
|-------|---------|
| `unsupported` | No sources provided |
| `single_source` | Supported by one source |
| `corroborated` | Supported by ≥2 independent sources of type `primary_document`, `primary_recording`, or `secondary_reporting` |
| `strongly_corroborated` | Supported by ≥3 independent sources with at least 2 primary sources |

Sources sharing an `independence_group` count as one source for corroboration purposes. For example, three articles from the same newspaper covering the same event count as one source.

### 4. Editorial Review

Whether an editor has reviewed and accepted the claim.

| Value | Meaning |
|-------|---------|
| `unreviewed` | Not yet reviewed by an editor |
| `editorially_accepted` | Reviewed and accepted |
| `editorially_rejected` | Reviewed and rejected |

### 5. Consensus Level

The degree of agreement among informed observers.

| Value | Meaning |
|-------|---------|
| `no_position` | Insufficient engagement to assess consensus |
| `emerging_consensus` | Most informed observers agree, but significant minority dissent exists |
| `consensus` | Broad agreement among independent sources + editorial acceptance + no unresolved material challenge |
| `minority_view` | The claim represents a position held by a credible minority |

`consensus` requires ≥3 independent sources + editorial acceptance + no unresolved material challenge.

### 6. Temporal Status

Whether the claim represents current understanding.

| Value | Meaning |
|-------|---------|
| `current` | Reflects the current best understanding |
| `superseded` | Historically recorded but no longer the preferred reading |
| `retracted` | Affirmatively invalid due to correction, fabrication, or error |

## How Dimensions Interact

The dimensions are independent and can be queried in combination. Some informative combinations:

- **Published + unchallenged + corroborated + editorially_accepted + consensus + current** → The strongest possible status: a well-established claim
- **Published + challenged + single_source + editorially_accepted + minority_view + current** → A claim under active dispute with limited evidence
- **Published + unchallenged + unsupported + unreviewed + no_position + current** → A newly submitted claim that hasn't been evaluated yet

## Reader-Facing Display

| Reader View | Simplified Badge | Criteria |
|-------------|-----------------|----------|
| "Established" | ✓ | Corroborated + editorially accepted + unchallenged/resolved |
| "Contested" | ⚡ | Any active challenge or dispute |
| "Emerging" | ○ | Published but not yet fully corroborated |
| "Superseded" | ↻ | Temporal status is superseded |
| "Retracted" | ✗ | Temporal status is retracted |

The analyst view shows all six dimensions. The auditor view shows status change history with timestamps.

## Guidelines for Editors

1. **Never conflate unchallenged with validated.** A claim nobody has objected to may simply be a claim nobody has reviewed.
2. **Evidence trumps consensus.** A well-sourced claim from a minority position is more valuable than a poorly sourced claim with broad agreement.
3. **Update temporal status promptly.** When new evidence materially changes a claim's validity, update the temporal status within 7 days.
4. **Document status transitions.** Every change in any dimension should be accompanied by a brief note explaining why.
