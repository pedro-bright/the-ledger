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
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-ledger-border" />

          {Array.from(yearGroups.entries()).map(([year, yearEvents]) => (
            <div key={year} className="relative">
              {/* Year marker */}
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-[15px] h-[15px] rounded-full bg-ledger-bg border-2 border-ledger-border-light z-10 flex-shrink-0" />
                <h2
                  className="font-display text-4xl font-normal text-white tracking-display-tight tabular-nums"
                  style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 0, 'WONK' 0" }}
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
    <div className="py-16 px-4 max-w-xl mx-auto text-center">
      <p
        className="font-display italic text-xl text-ledger-text-muted mb-2 leading-snug"
        style={{ fontVariationSettings: "'opsz' 14, 'SOFT' 0, 'WONK' 0" }}
      >
        Nothing matches that combination.
      </p>
      {hasCat && hasSig && (
        <p className="text-sm text-ledger-text-muted mb-5 leading-relaxed">
          No {activeSigList} events are tagged {activeCatList}. Try widening one axis.
        </p>
      )}
      {hasCat && !hasSig && (
        <p className="text-sm text-ledger-text-muted mb-5 leading-relaxed">
          No events match {activeCatList}. Try dropping the category filter.
        </p>
      )}
      {!hasCat && hasSig && (
        <p className="text-sm text-ledger-text-muted mb-5 leading-relaxed">
          No events at {activeSigList} significance yet. Try all significance levels.
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2 text-sm font-mono">
        {hasCat && (
          <button
            type="button"
            onClick={onClearCategories}
            className="px-3 py-1 rounded-sm border border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text transition-colors"
          >
            clear category
          </button>
        )}
        {hasSig && (
          <button
            type="button"
            onClick={onClearSignificance}
            className="px-3 py-1 rounded-sm border border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text transition-colors"
          >
            clear significance
          </button>
        )}
        {(hasCat || hasSig) && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-1 rounded-sm border border-category-policy/30 text-category-policy hover:border-category-policy/60 hover:bg-category-policy/10 transition-colors"
          >
            clear all filters →
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-24 px-4 max-w-xl mx-auto text-center">
      <p className="label-eyebrow mb-3">§ Nothing here yet</p>
      <p
        className="font-display text-3xl font-normal text-ledger-text mb-3 leading-tight"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 0, 'WONK' 0" }}
      >
        The ledger is empty.
      </p>
      <p className="text-sm text-ledger-text-muted mb-6 leading-relaxed">
        Entries are loaded from markdown files in <code className="font-mono text-xs text-ledger-text">content/events/</code>. The fastest way to help: drop a source link via a GitHub issue.
      </p>
      <a
        href="https://github.com/pedro-bright/the-ledger/issues/new?template=source-tip.yml"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-category-policy rounded-md hover:bg-category-policy/80 transition-colors"
      >
        Submit a source tip
      </a>
    </div>
  );
}
