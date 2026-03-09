import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import yaml from 'js-yaml';

// ─── Types ────────────────────────────────────────────────────

export interface Source {
  url: string;
  archive_url?: string;
  title: string;
  publisher?: string;
  type: 'primary' | 'secondary' | 'commentary' | 'official';
  date?: string;
  accessed?: string;
}

export interface Actor {
  id: string;
  name: string;
  type: 'company' | 'government' | 'research-lab' | 'individual' | 'organization';
  founded?: number;
  website?: string;
  aliases?: string[];
}

export interface SignificanceEntry {
  level: string;
  date: string;
  reason: string;
}

export interface Contestation {
  status: 'uncontested' | 'contested' | 'superseded' | 'unresolved';
  challenge_window?: 'open' | 'closed';
  last_challenged?: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  end_date?: string;
  category: string;
  significance?: 'landmark' | 'major' | 'notable';
  confidence?: 'high' | 'medium' | 'low' | 'disputed';
  contestation?: Contestation;
  actors?: Array<{ id: string; role: string }>;
  regions?: string[];
  tags?: string[];
  threads?: string[];
  related?: string[];
  sources?: Source[];
  significance_history?: SignificanceEntry[];
  state?: string;
  content: string;
  htmlContent: string;
  slug: string;
}

export interface ThreadData {
  id: string;
  title: string;
  status?: 'active' | 'dormant';
  started?: string;
  core_question?: string;
  curator?: string;
  curator_scope?: string;
  contestation?: Contestation;
  last_updated?: string;
  events?: string[];
  controversies?: string[];
  content: string;
  htmlContent: string;
  slug: string;
}

export interface ControversyData {
  id: string;
  title: string;
  thread?: string;
  status?: 'active' | 'resolved' | 'dormant';
  polarity?: string;
  last_updated?: string;
  positions?: Array<{
    claim: string;
    proponents?: string[];
    sources?: Source[];
    confidence?: string;
  }>;
  content: string;
  htmlContent: string;
  slug: string;
}

// ─── Content directory root ───────────────────────────────────

const CONTENT_DIR = path.resolve(
  typeof import.meta !== 'undefined' && (import.meta as any).env?.CONTENT_DIR
    ? (import.meta as any).env.CONTENT_DIR
    : path.join(process.cwd(), '..', 'content')
);

// ─── Helpers ──────────────────────────────────────────────────

function safeReadDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function parseMarkdownFile(filePath: string): { data: Record<string, any>; content: string; htmlContent: string } {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const htmlContent = marked.parse(content, { async: false }) as string;
  return { data, content, htmlContent };
}

function parseYamlFile(filePath: string): Record<string, any> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as Record<string, any>;
}

// ─── Title formatting ─────────────────────────────────────────

const CONTROVERSY_TITLES: Record<string, string> = {
  'agi-timeline-disagreement': 'AGI Timeline Disagreement',
  'ai-training-copyright': 'AI Training & Copyright',
  'militarization-vs-safety': 'Military AI: Engagement vs. Safety',
  'open-weights-risk-benefit': 'Open Weights: Risks vs. Benefits',
  'scaling-laws-plateau': 'Are Scaling Laws Hitting a Plateau?',
};

function formatControversyTitle(id: string): string {
  if (CONTROVERSY_TITLES[id]) return CONTROVERSY_TITLES[id];
  // Fallback: convert kebab-case to Title Case
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Loaders ──────────────────────────────────────────────────

export function loadEvents(): EventData[] {
  const eventsDir = path.join(CONTENT_DIR, 'events');
  const events: EventData[] = [];

  // Events are stored in year subdirectories
  for (const yearDir of safeReadDir(eventsDir)) {
    const yearPath = path.join(eventsDir, yearDir);
    let stat;
    try { stat = fs.statSync(yearPath); } catch { continue; }
    if (!stat.isDirectory()) continue;

    for (const file of safeReadDir(yearPath)) {
      if (!file.endsWith('.md')) continue;
      try {
        const { data, content, htmlContent } = parseMarkdownFile(path.join(yearPath, file));
        events.push({
          id: data.id || file.replace('.md', ''),
          title: data.title || 'Untitled Event',
          date: data.date?.toString() || '',
          end_date: data.end_date?.toString(),
          category: data.category || 'uncategorized',
          significance: data.significance,
          confidence: data.confidence,
          contestation: data.contestation,
          actors: data.actors,
          regions: data.regions,
          tags: data.tags,
          threads: data.threads,
          related: data.related,
          sources: data.sources,
          significance_history: data.significance_history,
          state: data.state,
          content,
          htmlContent,
          slug: data.id || file.replace('.md', ''),
        });
      } catch (e) {
        console.warn(`Failed to parse event file ${file}:`, e);
      }
    }
  }

  // Sort by date descending (newest first)
  events.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return events;
}

export function loadThreads(): ThreadData[] {
  const threadsDir = path.join(CONTENT_DIR, 'threads');
  const threads: ThreadData[] = [];

  for (const file of safeReadDir(threadsDir)) {
    if (!file.endsWith('.md')) continue;
    try {
      const { data, content, htmlContent } = parseMarkdownFile(path.join(threadsDir, file));
      threads.push({
        id: data.id || file.replace('.md', ''),
        title: data.title || 'Untitled Thread',
        status: data.status,
        started: data.started?.toString(),
        core_question: data.core_question,
        curator: data.curator,
        curator_scope: data.curator_scope,
        contestation: data.contestation,
        last_updated: data.last_updated?.toString(),
        events: data.events,
        controversies: data.controversies,
        content,
        htmlContent,
        slug: data.id || file.replace('.md', ''),
      });
    } catch (e) {
      console.warn(`Failed to parse thread file ${file}:`, e);
    }
  }

  return threads;
}

export function loadControversies(): ControversyData[] {
  const contDir = path.join(CONTENT_DIR, 'controversies');
  const controversies: ControversyData[] = [];

  for (const file of safeReadDir(contDir)) {
    if (!file.endsWith('.md')) continue;
    try {
      const { data, content, htmlContent } = parseMarkdownFile(path.join(contDir, file));
      const cId = data.id || file.replace('.md', '');
      controversies.push({
        id: cId,
        title: data.title || formatControversyTitle(cId),
        thread: data.thread,
        status: data.status,
        polarity: data.polarity,
        last_updated: data.last_updated?.toString(),
        positions: data.positions,
        content,
        htmlContent,
        slug: cId,
      });
    } catch (e) {
      console.warn(`Failed to parse controversy file ${file}:`, e);
    }
  }

  return controversies;
}

export function loadActors(): Actor[] {
  const actorsDir = path.join(CONTENT_DIR, 'actors');
  const actors: Actor[] = [];

  for (const file of safeReadDir(actorsDir)) {
    if (!file.endsWith('.yml') && !file.endsWith('.yaml')) continue;
    try {
      const data = parseYamlFile(path.join(actorsDir, file));
      actors.push({
        id: data.id || file.replace(/\.(yml|yaml)$/, ''),
        name: data.name || data.id || file,
        type: data.type || 'organization',
        founded: data.founded,
        website: data.website,
        aliases: data.aliases,
      });
    } catch (e) {
      console.warn(`Failed to parse actor file ${file}:`, e);
    }
  }

  return actors;
}

// ─── Derived data ─────────────────────────────────────────────

export function groupEventsByYear(events: EventData[]): Map<number, EventData[]> {
  const groups = new Map<number, EventData[]>();
  for (const event of events) {
    const year = new Date(event.date).getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(event);
  }
  return new Map([...groups.entries()].sort((a, b) => b[0] - a[0]));
}

export function getCategories(): Array<{ id: string; label: string; color: string }> {
  return [
    { id: 'policy', label: 'Policy', color: '#6366F1' },
    { id: 'models', label: 'Models', color: '#F59E0B' },
    { id: 'research', label: 'Research', color: '#10B981' },
    { id: 'industry', label: 'Industry', color: '#8B5CF6' },
    { id: 'safety', label: 'Safety', color: '#EF4444' },
    { id: 'culture', label: 'Culture', color: '#EC4899' },
    { id: 'open-source', label: 'Open Source', color: '#06B6D4' },
  ];
}

export function getCategoryColor(category: string): string {
  const cat = getCategories().find((c) => c.id === category);
  return cat?.color || '#6B7280';
}

export function getSignificanceOrder(sig?: string): number {
  switch (sig) {
    case 'landmark': return 3;
    case 'major': return 2;
    case 'notable': return 1;
    default: return 0;
  }
}

// Build a map of thread IDs to their events
export function buildThreadEventMap(events: EventData[]): Map<string, EventData[]> {
  const map = new Map<string, EventData[]>();
  for (const event of events) {
    if (event.threads) {
      for (const threadId of event.threads) {
        if (!map.has(threadId)) map.set(threadId, []);
        map.get(threadId)!.push(event);
      }
    }
  }
  return map;
}

// Build a map of actor IDs to their events
export function buildActorEventMap(events: EventData[]): Map<string, EventData[]> {
  const map = new Map<string, EventData[]>();
  for (const event of events) {
    if (event.actors) {
      for (const actor of event.actors) {
        if (!map.has(actor.id)) map.set(actor.id, []);
        map.get(actor.id)!.push(event);
      }
    }
  }
  return map;
}

// Get summary/excerpt from content
export function getExcerpt(content: string, maxLength = 200): string {
  // Get the first paragraph after any heading
  const lines = content.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  const text = lines.join(' ').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}
