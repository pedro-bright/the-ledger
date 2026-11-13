import { getExcerpt, type EventData } from './content';

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
    eventSlugs: events.map((event) => event.slug),
  };
}
