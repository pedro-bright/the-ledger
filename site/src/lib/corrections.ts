import type { ChallengeCase, ResolutionNote, SummaryRevision } from './content';

export type CorrectionTarget =
  | { kind: 'event'; title: string; href: string }
  | { kind: 'synthesis'; title: string };

export interface CorrectionRecord {
  kind: 'Challenge resolved' | 'Summary revision' | 'Challenge opened';
  date?: string;
  target: CorrectionTarget;
  reason: string;
}

interface CorrectionSources {
  events: Array<{ id: string; slug: string; title: string }>;
  revisions: SummaryRevision[];
  challenges: ChallengeCase[];
  resolutions: ResolutionNote[];
}

const plainWords = (value: string) => value.replace(/_/g, ' ');

// Same-day records list resolutions, then revisions, then challenges: the reverse of the
// event page's oldest-first order, where a challenge precedes a revision made the same day.
const KIND_ORDER: Record<CorrectionRecord['kind'], number> = {
  'Challenge resolved': 0,
  'Summary revision': 1,
  'Challenge opened': 2,
};

export function buildCorrectionRecords({ events, revisions, challenges, resolutions }: CorrectionSources): CorrectionRecord[] {
  const eventsById = new Map(events.map((e) => [e.id, e]));

  const targetFor = (id: string): CorrectionTarget => {
    const event = eventsById.get(id);
    return event
      ? { kind: 'event', title: event.title, href: `/events/${event.slug}#revision-history` }
      : { kind: 'synthesis', title: id };
  };

  const records: CorrectionRecord[] = [
    ...resolutions.map((r): CorrectionRecord => {
      const challenge = challenges.find((c) => c.id === r.case_id);
      if (!challenge) throw new Error(`Resolution ${r.id} names unknown challenge ${r.case_id}`);
      return {
        kind: 'Challenge resolved',
        date: r.issued_at,
        target: targetFor(challenge.target_claim_id),
        reason: [`Disposition: ${plainWords(r.disposition)}.`, ...r.findings].join(' '),
      };
    }),
    ...revisions.map((r): CorrectionRecord => ({
      kind: 'Summary revision',
      date: r.created_at,
      target: targetFor(r.target_summary_id),
      reason: r.reason,
    })),
    ...challenges.map((c): CorrectionRecord => ({
      kind: 'Challenge opened',
      date: c.opened_at,
      target: targetFor(c.target_claim_id),
      reason: `Alleges ${c.allegations.map(plainWords).join(', ')}.`,
    })),
  ];

  return records.sort((a, b) =>
    (b.date ?? '').localeCompare(a.date ?? '')
    || KIND_ORDER[a.kind] - KIND_ORDER[b.kind]
    || a.target.title.localeCompare(b.target.title));
}
