import type { ChallengeCase, ResolutionNote, SummaryRevision } from './content';

export type RevisionHistoryEntry =
  | { kind: 'challenge'; date?: string; challenge: ChallengeCase }
  | { kind: 'revision'; date?: string; revision: SummaryRevision }
  | { kind: 'resolution'; date?: string; resolution: ResolutionNote };

interface RevisionHistorySources {
  challenges: ChallengeCase[];
  revisions: SummaryRevision[];
  resolutions: ResolutionNote[];
}

// On one day a challenge is opened before the summary is revised, and resolved after it.
const KIND_ORDER: Record<RevisionHistoryEntry['kind'], number> = {
  challenge: 0,
  revision: 1,
  resolution: 2,
};

/** The correction records that concern one event, oldest first. */
export function buildRevisionHistory(eventId: string, { challenges, revisions, resolutions }: RevisionHistorySources): RevisionHistoryEntry[] {
  const eventChallenges = challenges.filter((c) => c.target_claim_id === eventId);
  const caseIds = new Set(eventChallenges.map((c) => c.id));
  const entries: RevisionHistoryEntry[] = [
    ...eventChallenges.map((c): RevisionHistoryEntry => ({ kind: 'challenge', date: c.opened_at, challenge: c })),
    ...revisions
      .filter((r) => r.target_summary_id === eventId)
      .map((r): RevisionHistoryEntry => ({ kind: 'revision', date: r.created_at, revision: r })),
    ...resolutions
      .filter((r) => caseIds.has(r.case_id))
      .map((r): RevisionHistoryEntry => ({ kind: 'resolution', date: r.issued_at, resolution: r })),
  ];
  return entries.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
}
