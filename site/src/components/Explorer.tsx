import React, { useState, useMemo } from 'react';
import { getSignificanceOrder } from '../lib/content';

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
  tags?: string[];
  threads?: string[];
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

type SortOption = 'newest' | 'oldest' | 'significance';

const categoryHex: Record<string, string> = {
  policy: '#6366F1',
  models: '#F59E0B',
  research: '#10B981',
  industry: '#8B5CF6',
  safety: '#EF4444',
  culture: '#EC4899',
  'open-source': '#06B6D4',
};

export default function Explorer({ events, categories }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSignificance, setSelectedSignificance] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Compute available years from events (desc). Memoized over the events prop.
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const e of events) {
      const y = new Date(e.date).getFullYear();
      if (!Number.isNaN(y)) years.add(y);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [events]);

  const filtered = useMemo(() => {
    const result = events.filter((e) => {
      if (selectedCategory && e.category !== selectedCategory) return false;
      if (selectedSignificance && e.significance !== selectedSignificance) return false;
      if (selectedYear !== null) {
        const eventYear = new Date(e.date).getFullYear();
        if (eventYear !== selectedYear) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const searchable = `${e.title} ${e.summary} ${(e.tags || []).join(' ')}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });

    // Sort based on current option. Events arrive sorted newest-first from the loader,
    // but we sort explicitly here so `oldest` and `significance` are correct.
    const sorted = [...result];
    if (sortOption === 'oldest') {
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOption === 'significance') {
      sorted.sort((a, b) => {
        const diff = getSignificanceOrder(b.significance) - getSignificanceOrder(a.significance);
        if (diff !== 0) return diff;
        // Tie-break by date desc
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else {
      // newest (default)
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return sorted;
  }, [events, search, selectedCategory, selectedSignificance, selectedYear, sortOption]);

  if (events.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ledger-surface border border-ledger-border mb-6">
          <svg className="w-7 h-7 text-ledger-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-ledger-text mb-2">Nothing to explore yet</h3>
        <p className="text-sm text-ledger-text-muted max-w-md mx-auto">
          Events will appear here once content is added to the ledger.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ledger-text-dim"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search events..."
            aria-label="Search events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ledger-surface border border-ledger-border rounded-lg text-sm text-ledger-text placeholder:text-ledger-text-dim focus:outline-none focus:border-ledger-border-light transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2.5 bg-ledger-surface border border-ledger-border rounded-lg text-sm text-ledger-text-muted focus:outline-none focus:border-ledger-border-light transition-colors"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          value={selectedSignificance}
          onChange={(e) => setSelectedSignificance(e.target.value)}
          className="px-3 py-2.5 bg-ledger-surface border border-ledger-border rounded-lg text-sm text-ledger-text-muted focus:outline-none focus:border-ledger-border-light transition-colors"
        >
          <option value="">All significance</option>
          <option value="landmark">Landmark</option>
          <option value="major">Major</option>
          <option value="notable">Notable</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          aria-label="Sort events"
          className="px-3 py-2.5 bg-ledger-surface border border-ledger-border rounded-lg text-sm text-ledger-text-muted focus:outline-none focus:border-ledger-border-light transition-colors"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="significance">Most significant</option>
        </select>
      </div>

      {/* Year chips */}
      {availableYears.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-mono text-ledger-text-dim uppercase tracking-wider mr-1">
            Year
          </span>
          <button
            onClick={() => setSelectedYear(null)}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-150 ${
              selectedYear === null
                ? 'border-white/30 text-white bg-white/10'
                : 'border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text'
            }`}
          >
            All
          </button>
          {availableYears.map((year) => {
            const isActive = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(isActive ? null : year)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-full border transition-all duration-150 ${
                  isActive
                    ? 'border-white/30 text-white bg-white/10'
                    : 'border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs font-mono text-ledger-text-dim mb-4">
        {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        {search && ` matching "${search}"`}
      </p>

      {/* Table-like archival list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-ledger-text-muted">No events match your search.</p>
        </div>
      ) : (
        <div className="divide-y divide-ledger-border/60 border-t border-ledger-border/60">
          {filtered.map((event) => {
            const catHex = categoryHex[event.category] || '#6B6770';
            const isLandmark = event.significance === 'landmark';
            const isMajor = event.significance === 'major';
            return (
              <a
                key={event.id}
                href={`/events/${event.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto_auto] gap-3 sm:gap-5 py-4 px-3 -mx-3 items-baseline hover:bg-ledger-surface/30 transition-colors rounded-sm"
              >
                <time className="text-xs font-mono text-ledger-text-dim tabular-nums w-24">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
                <span
                  className="hidden sm:block w-0.5 self-stretch mt-1 mb-1"
                  style={{ backgroundColor: catHex }}
                  aria-hidden
                />
                <div className="col-span-2 sm:col-span-1 min-w-0">
                  <h3
                    className={
                      isLandmark
                        ? 'font-display text-lg sm:text-xl font-medium leading-snug text-ledger-text group-hover:text-white transition-colors'
                        : isMajor
                          ? 'font-display text-base sm:text-lg font-medium leading-snug text-ledger-text group-hover:text-white transition-colors'
                          : 'text-sm sm:text-[15px] font-medium leading-snug text-ledger-text group-hover:text-white transition-colors'
                    }
                    style={isLandmark || isMajor ? { fontVariationSettings: "'opsz' 144, 'SOFT' 0, 'WONK' 0" } : undefined}
                  >
                    {event.title}
                  </h3>
                  {event.summary && (
                    <p className="mt-1 text-xs text-ledger-text-muted line-clamp-2 leading-relaxed">
                      {event.summary}
                    </p>
                  )}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[10px] font-mono text-ledger-text-dim">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span
                  className="hidden sm:block text-[10px] font-mono uppercase tracking-wider whitespace-nowrap self-start mt-1"
                  style={{ color: catHex }}
                >
                  {event.category.replace('-', ' ')}
                </span>
                {event.significance && event.significance !== 'notable' && (
                  <span
                    className={`hidden sm:block text-[10px] font-mono uppercase tracking-wider whitespace-nowrap self-start mt-1 ${
                      event.significance === 'landmark' ? 'text-amber-400' : 'text-indigo-300'
                    }`}
                  >
                    {event.significance}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
