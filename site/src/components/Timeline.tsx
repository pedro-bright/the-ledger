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
        <NoMatchesState
          activeCategories={activeCategories}
          activeSignificance={activeSignificance}
          onClear={resetFilters}
          onClearCategories={() => setActiveCategories(new Set())}
          onClearSignificance={() => setActiveSignificance(new Set())}
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-rule" />

          {Array.from(yearGroups.entries()).map(([year, yearEvents]) => (
            <div key={year} className="relative">
              {/* Year marker */}
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-[15px] h-[15px] rounded-full bg-page-bg border-2 border-rule-strong z-10 flex-shrink-0" />
                <h2
                  className="font-display text-4xl font-medium text-ink tabular-nums"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 0, 'WONK' 0", letterSpacing: '-0.018em' }}
                >
                  {year}
                </h2>
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

function NoMatchesState({
  activeCategories,
  activeSignificance,
  onClear,
  onClearCategories,
  onClearSignificance,
}: {
  activeCategories: Set<string>;
  activeSignificance: Set<string>;
  onClear: () => void;
  onClearCategories: () => void;
  onClearSignificance: () => void;
}) {
  const hasCat = activeCategories.size > 0;
  const hasSig = activeSignificance.size > 0;
  const activeCatList = Array.from(activeCategories).join(', ');
  const activeSigList = Array.from(activeSignificance).join(', ');

  return (
    <div className="py-14 px-4 max-w-xl mx-auto text-center">
      <p
        className="font-display italic text-lg text-ink-mid mb-2 leading-snug"
        style={{ fontVariationSettings: "'opsz' 14, 'SOFT' 0, 'WONK' 0" }}
      >
        No entries match this combination.
      </p>
      {hasCat && hasSig && (
        <p className="text-sm text-ink-muted mb-5 leading-relaxed font-sans">
          No {activeSigList} events are tagged {activeCatList}. Try widening one axis.
        </p>
      )}
      {hasCat && !hasSig && (
        <p className="text-sm text-ink-muted mb-5 leading-relaxed font-sans">
          No events match {activeCatList}. Try dropping the category filter.
        </p>
      )}
      {!hasCat && hasSig && (
        <p className="text-sm text-ink-muted mb-5 leading-relaxed font-sans">
          No events at {activeSigList} significance yet. Try all significance levels.
        </p>
      )}
      <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-sans">
        {hasCat && (
          <button
            type="button"
            onClick={onClearCategories}
            className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
          >
            Clear category
          </button>
        )}
        {hasSig && (
          <button
            type="button"
            onClick={onClearSignificance}
            className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
          >
            Clear significance
          </button>
        )}
        {(hasCat || hasSig) && (
          <button
            type="button"
            onClick={onClear}
            className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 px-4 max-w-xl mx-auto text-center">
      <p className="label-eyebrow mb-3">§ Nothing here yet</p>
      <p
        className="font-display text-2xl font-medium text-ink mb-3 leading-tight"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 0, 'WONK' 0" }}
      >
        The ledger is empty.
      </p>
      <p className="text-sm text-ink-muted mb-6 leading-relaxed font-sans">
        Entries are loaded from markdown files in <code className="font-mono text-xs text-ink bg-wiki-surface px-1 py-0.5 rounded-sm">content/events/</code>. The fastest way to help: drop a source link via a GitHub issue.
      </p>
      <a
        href="https://github.com/pedro-bright/the-ledger/issues/new?template=source-tip.yml"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-wiki-link font-sans"
      >
        Submit a source tip →
      </a>
    </div>
  );
}
