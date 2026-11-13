import { getExcerpt, type EventData } from './content';

const DAY_MS = 86_400_000;

/** Shared by the static home page and its view-time index. */
export function buildHomeIndex(events: EventData[]) {
  const significant = events
    .filter((event) => event.significance === 'landmark' || event.significance === 'major')
    .slice(0, 12);
  const pool = significant.length > 0 ? significant : events;
  const summary = ({ slug, title, date, category }: EventData) => ({ slug, title, date, category });
  const eventsByMonthDay: Record<string, ReturnType<typeof summary>[]> = {};
  for (const event of events) {
    (eventsByMonthDay[event.date.slice(5, 10)] ??= []).push(summary(event));
  }
  return {
    featuredPool: pool.map((event) => ({
      ...summary(event),
      significance: event.significance,
      excerpt: getExcerpt(event.content, 320),
    })),
    eventsByMonthDay,
  };
}

type HomeIndex = ReturnType<typeof buildHomeIndex>;

/** The featured entry and the anniversaries from other years for one YYYY-MM-DD day. */
function selectHomeDay({ featuredPool, eventsByMonthDay }: HomeIndex, iso: string) {
  return {
    featured: featuredPool[(Date.parse(iso) / DAY_MS) % featuredPool.length],
    onThisDay: (eventsByMonthDay[iso.slice(5)] ?? [])
      .filter((event) => event.date.slice(0, 4) !== iso.slice(0, 4))
      .slice(0, 5),
  };
}

/**
 * Selections embedded in the home page, keyed by day: the build day in UTC, the day
 * before and the seven days after. That covers every reader's time zone at build time
 * and a site that has not been rebuilt for a week.
 */
export function buildHomeWindow(index: HomeIndex, buildIso: string) {
  const start = Date.parse(buildIso) - DAY_MS;
  return Object.fromEntries(
    Array.from({ length: 9 }, (_, offset) => {
      const iso = new Date(start + offset * DAY_MS).toISOString().slice(0, 10);
      return [iso, selectHomeDay(index, iso)];
    }),
  );
}
