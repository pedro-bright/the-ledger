import {
  loadActors, loadControversies, loadEvents, loadThreads, splitArticleLead, type EventData,
} from './content';
import { plainText } from './markdown';

// Bump when a field is renamed or removed; adding a field does not need a bump.
const SCHEMA_VERSION = 1;
const SITE = 'https://the-ledger.net';
const generatedAt = new Date().toISOString();

export const CSV_COLUMNS = [
  'id', 'date', 'title', 'category', 'significance', 'confidence',
  'regions', 'threads', 'actors', 'source_count', 'url',
];

const pageUrl = (section: string, id: string) => new URL(`/${section}/${id}/`, SITE).href;

/** A loaded record without its body and routing fields, plus the URL of its page. */
function exportRecord<T extends { slug: string; content: string; htmlContent: string }>(item: T, section: string) {
  const { content, htmlContent, slug, ...fields } = item;
  return { ...fields, url: pageUrl(section, slug) };
}

/** The text of the entry's Summary section, the opening section of its page. */
function summary(event: EventData): string {
  return plainText(splitArticleLead(event.htmlContent).lead.replace(/^\s*<h2[^>]*>[\s\S]*?<\/h2>/, ''));
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

const events = loadEvents().map((event) => {
  const { url, ...fields } = exportRecord(event, 'events');
  return { ...fields, summary: summary(event), url };
});
const actors = loadActors().map((actor) => ({ ...actor, url: pageUrl('actors', actor.id) }));
const threads = loadThreads().map((thread) => exportRecord(thread, 'threads'));
const controversies = loadControversies().map((controversy) => exportRecord(controversy, 'controversies'));

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
]);

const JSON_TYPE = 'application/json; charset=utf-8';

/** Every file under /data/, serialized once per build so the data page can report their sizes. */
export const dataFiles = [
  { name: 'events.json', type: JSON_TYPE, count: events.length, body: envelope('events', events) },
  {
    name: 'events.csv',
    type: 'text/csv; charset=utf-8',
    count: events.length,
    body: [CSV_COLUMNS, ...eventRows].map((row) => `${row.map(csvField).join(',')}\r\n`).join(''),
  },
  { name: 'actors.json', type: JSON_TYPE, count: actors.length, body: envelope('actors', actors) },
  { name: 'threads.json', type: JSON_TYPE, count: threads.length, body: envelope('threads', threads) },
  { name: 'controversies.json', type: JSON_TYPE, count: controversies.length, body: envelope('controversies', controversies) },
];

export function dataResponse(name: string): Response {
  const file = dataFiles.find((f) => f.name === name)!;
  return new Response(file.body, { headers: { 'Content-Type': file.type } });
}
