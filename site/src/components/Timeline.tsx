import React, { useState, useMemo } from 'react';
import EventCard from './EventCard';
import FilterBar from './FilterBar';

interface EventData {
  id: string;
  title: string;
  date: string;
  category: string;
  significance?: 'landmark' | 'major' | 'notable';
  confidence?: string;
  contestation?: { status?: string };
  summary: string;
  slug: string;
}

interface Category {
  id: string;
  label: string;
  color: string;
}

interface Props {
  events: EventData[];
  categories: Category[];
}

function groupByYear(events: EventData[]): Map<number, EventData[]> {
  const groups = new Map<number, EventData[]>();
  for (const event of events) {
    const year = new Date(event.date).getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(event);
  }
  return new Map([...groups.entries()].sort((a, b) => b[0] - a[0]));
}

const SIGNIFICANCE_LEVELS = ['landmark', 'major', 'notable'];

export default function Timeline({ events, categories }: Props) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeSignificance, setActiveSignificance] = useState<Set<string>>(new Set());

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (activeCategories.size > 0 && !activeCategories.has(e.category)) return false;
      if (activeSignificance.size > 0 && e.significance && !activeSignificance.has(e.significance)) return false;
      if (activeSignificance.size > 0 && !e.significance) return false;
      return true;
    });
  }, [events, activeCategories, activeSignificance]);

  const yearGroups = useMemo(() => groupByYear(filteredEvents), [filteredEvents]);

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSignificance = (level: string) => {
    setActiveSignificance((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const resetFilters = () => {
    setActiveCategories(new Set());
    setActiveSignificance(new Set());
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          categories={categories}
          activeCategories={activeCategories}
          onToggleCategory={toggleCategory}
          significanceLevels={SIGNIFICANCE_LEVELS}
          activeSignificance={activeSignificance}
          onToggleSignificance={toggleSignificance}
          onReset={resetFilters}
          eventCount={events.length}
          filteredCount={filteredEvents.length}
        />
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <EmptyState />
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ledger-text-muted text-sm">No events match the current filters.</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-sm text-category-policy hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-ledger-border" />

          {Array.from(yearGroups.entries()).map(([year, yearEvents]) => (
            <div key={year} className="relative">
              {/* Year marker */}
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-[15px] h-[15px] rounded-full bg-ledger-bg border-2 border-ledger-border-light z-10 flex-shrink-0" />
                <h2 className="text-2xl font-bold font-mono text-white">{year}</h2>
              </div>

              {/* Events */}
              <div className="pl-10 space-y-3 mb-10">
                {yearEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.slug}
                    title={event.title}
                    date={event.date}
                    category={event.category}
                    significance={event.significance}
                    summary={event.summary}
                    confidence={event.confidence}
                    contestation={event.contestation?.status}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ledger-surface border border-ledger-border mb-6">
        <svg className="w-7 h-7 text-ledger-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-ledger-text mb-2">No events yet</h3>
      <p className="text-sm text-ledger-text-muted max-w-md mx-auto mb-6">
        The timeline is empty. Events are loaded from markdown files in the <code className="font-mono text-xs bg-ledger-surface px-1.5 py-0.5 rounded">content/events/</code> directory.
      </p>
      <a
        href="https://github.com/terrytang/the-ledger"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-category-policy rounded-lg hover:bg-category-policy/80 transition-colors"
      >
        Contribute on GitHub
      </a>
    </div>
  );
}
