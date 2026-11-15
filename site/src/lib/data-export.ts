import {
  getThreadEvents, loadActors, loadChallenges, loadControversies, loadEvents, loadResolutions, loadSummaryRevisions,
  loadThreads,
} from './content';
import { plainParagraphs } from './markdown';

// Bump when a field is renamed or removed; adding a field does not need a bump.
const SCHEMA_VERSION = 1;
const SITE = 'https://the-ledger.net';
const generatedAt = new Date().toISOString();

export const CSV_COLUMNS = [
  'id', 'date', 'title', 'category', 'significance', 'confidence',
  'regions', 'threads', 'actors', 'source_count', 'url', 'date_added', 'tags',
];

const pageUrl = (section: string, id: string) => new URL(`/${section}/${id}/`, SITE).href;
const revisionHistoryUrl = (eventId: string) => `${pageUrl('events', eventId)}#revision-history`;

/** A loaded record without its body and routing fields, plus the URL of its page. */
function exportRecord<T extends { slug: string; content: string; htmlContent: string }>(item: T, section: string) {
  const { content, htmlContent, slug, ...fields } = item;
  return { ...fields, url: pageUrl(section, slug) };
}

/** Wrap records in the shared envelope and serialize them. */
function envelope(key: string, records: unknown[]): string {
  const body = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    license: 'CC-BY-SA-4.0',
    attribution: `The Ledger (${SITE}). Cite The Ledger and link the entry you use.`,
    [key]: records,
  };
  // YAML reads unquoted dates as Date objects; write them as YYYY-MM-DD, as the pages show them.
  const replacer = function (this: Record<string, unknown>, name: string, value: unknown) {
    const raw = this[name];
    return raw instanceof Date ? raw.toISOString().slice(0, 10) : value;
  };
  return `${JSON.stringify(body, replacer, 2)}\n`;
}

const csvField = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

const loadedEvents = loadEvents();
const events = loadedEvents.map((event) => {
  const { url, ...fields } = exportRecord(event, 'events');
  return { ...fields, summary: plainParagraphs(event.content, 'Summary').join(' '), url };
});
const actors = loadActors().map((actor) => ({ ...actor, url: pageUrl('actors', actor.id) }));
// A thread lists the entries its Event timeline shows, oldest first.
const threads = loadThreads().map((thread) => {
  const { url, ...fields } = exportRecord(thread, 'threads');
  const ids = getThreadEvents(thread, loadedEvents).map((event) => event.id);
  return { ...fields, events: ids, event_count: ids.length, url };
});
const controversies = loadControversies().map((controversy) => exportRecord(controversy, 'controversies'));
const revisions = loadSummaryRevisions().map((revision) => ({
  ...revision,
  url: revisionHistoryUrl(revision.target_summary_id),
}));
const loadedChallenges = loadChallenges();
const challenges = loadedChallenges.map((challenge) => ({
  ...challenge,
  url: revisionHistoryUrl(challenge.target_claim_id),
}));
// The corrections page already fails the build when a resolution names an unknown challenge.
const resolutions = loadResolutions().map((resolution) => ({
  ...resolution,
  url: revisionHistoryUrl(loadedChallenges.find((c) => c.id === resolution.case_id)!.target_claim_id),
}));

const eventRows = events.map((event) => [
  event.id,
  event.date,
  event.title,
  event.category,
  event.significance ?? '',
  event.confidence ?? '',
  (event.regions ?? []).join('|'),
  (event.threads ?? []).join('|'),
  (event.actors ?? []).map((actor) => actor.id).join('|'),
  String(event.sources?.length ?? 0),
  event.url,
  event.revision?.created ?? '',
  (event.tags ?? []).join('|'),
]);

const JSON_TYPE = 'application/json; charset=utf-8';

/** Every file under /data/, serialized once per build so the data page can report their sizes. */
export const dataFiles = [
  { name: 'events.json', type: JSON_TYPE, count: events.length, body: envelope('events', events) },
  {
    name: 'events.csv',
    type: 'text/csv; charset=utf-8',
    count: events.length,
    body: `\uFEFF${[CSV_COLUMNS, ...eventRows].map((row) => `${row.map(csvField).join(',')}\r\n`).join('')}`,
  },
  { name: 'actors.json', type: JSON_TYPE, count: actors.length, body: envelope('actors', actors) },
  { name: 'threads.json', type: JSON_TYPE, count: threads.length, body: envelope('threads', threads) },
  { name: 'controversies.json', type: JSON_TYPE, count: controversies.length, body: envelope('controversies', controversies) },
  { name: 'revisions.json', type: JSON_TYPE, count: revisions.length, body: envelope('revisions', revisions) },
  { name: 'challenges.json', type: JSON_TYPE, count: challenges.length, body: envelope('challenges', challenges) },
  { name: 'resolutions.json', type: JSON_TYPE, count: resolutions.length, body: envelope('resolutions', resolutions) },
];

export function dataResponse(name: string): Response {
  const file = dataFiles.find((f) => f.name === name)!;
  return new Response(file.body, { headers: { 'Content-Type': file.type } });
}
