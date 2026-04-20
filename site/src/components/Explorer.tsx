import React, { useEffect, useMemo, useState } from 'react';
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
const SIGNIFICANCE_LEVELS: Array<'landmark' | 'major' | 'notable'> = ['landmark', 'major', 'notable'];

const categoryHex: Record<string, string> = {
  policy: '#6366F1',
  models: '#F59E0B',
  research: '#10B981',
  industry: '#8B5CF6',
  safety: '#EF4444',
  culture: '#EC4899',
  'open-source': '#06B6D4',
};

/** Parse filter state from the current URL. Pure, no side effects. */
function readFromUrl(allCategories: Set<string>): {
  search: string;
  categories: Set<string>;
  significance: Set<string>;
  year: number | null;
  sort: SortOption;
} {
  if (typeof window === 'undefined') {
    return { search: '', categories: new Set(), significance: new Set(), year: null, sort: 'newest' };
  }
  const p = new URLSearchParams(window.location.search);
  const cats = (p.get('cat') || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && allCategories.has(s));
  const sigs = (p.get('sig') || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is 'landmark' | 'major' | 'notable' =>
      s === 'landmark' || s === 'major' || s === 'notable',
    );
  const yearRaw = p.get('year');
  const year = yearRaw && !Number.isNaN(Number(yearRaw)) ? Number(yearRaw) : null;
  const sortRaw = p.get('sort');
  const sort: SortOption =
    sortRaw === 'oldest' || sortRaw === 'significance' ? sortRaw : 'newest';
  return {
    search: p.get('q') || '',
    categories: new Set(cats),
    significance: new Set(sigs),
    year,
    sort,
  };
}

/** Serialize filter state to the URL without reloading the page. */
function writeToUrl(state: {
  search: string;
  categories: Set<string>;
  significance: Set<string>;
  year: number | null;
  sort: SortOption;
}) {
  if (typeof window === 'undefined') return;
  const p = new URLSearchParams();
  if (state.search) p.set('q', state.search);
  if (state.categories.size > 0) p.set('cat', Array.from(state.categories).join(','));
  if (state.significance.size > 0) p.set('sig', Array.from(state.significance).join(','));
  if (state.year != null) p.set('year', String(state.year));
  if (state.sort !== 'newest') p.set('sort', state.sort);
  const qs = p.toString();
  const next = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
  window.history.replaceState(null, '', next);
}

export default function Explorer({ events, categories }: Props) {
  const categoryIds = useMemo(() => new Set(categories.map((c) => c.id)), [categories]);

  // Initial state: empty on the server, hydrated from URL on the client.
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeSignificance, setActiveSignificance] = useState<Set<string>>(new Set());
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Hydration lives in React state (not a ref) so the write effect re-runs *after*
  // hydrate has applied the URL-derived state. A ref flipped synchronously inside
  // the hydrate effect would still let the write effect execute once with the
  // render-1 default closure and briefly strip the URL's query params.
  const [hasHydrated, setHasHydrated] = useState(false);

  // On mount: hydrate from URL. Also open advanced filters if any advanced filter is set.
  // Re-hydrate on back/forward navigation so the UI matches the URL state in history.
  useEffect(() => {
    const hydrate = () => {
      const next = readFromUrl(categoryIds);
      setSearch(next.search);
      setActiveCategories(next.categories);
      setActiveSignificance(next.significance);
      setSelectedYear(next.year);
      setSortOption(next.sort);
      if (next.year != null || next.sort !== 'newest') {
        setAdvancedOpen(true);
      }
      setHasHydrated(true);
    };
    hydrate();
    window.addEventListener('popstate', hydrate);
    return () => window.removeEventListener('popstate', hydrate);
  }, [categoryIds]);

  // On state change: sync to URL. Debounce search writes so typing doesn't call
  // history.replaceState on every keystroke. Category/significance/year/sort writes
  // fire immediately — they're discrete clicks, not continuous input.
  useEffect(() => {
    if (!hasHydrated) return;
    const t = setTimeout(() => {
      writeToUrl({
        search,
        categories: activeCategories,
        significance: activeSignificance,
        year: selectedYear,
        sort: sortOption,
      });
    }, 180);
    return () => clearTimeout(t);
  }, [hasHydrated, search, activeCategories, activeSignificance, selectedYear, sortOption]);

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
      if (activeCategories.size > 0 && !activeCategories.has(e.category)) return false;
      if (activeSignificance.size > 0 && (!e.significance || !activeSignificance.has(e.significance))) {
        return false;
      }
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

    const sorted = [...result];
    if (sortOption === 'oldest') {
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOption === 'significance') {
      sorted.sort((a, b) => {
        const diff = getSignificanceOrder(b.significance) - getSignificanceOrder(a.significance);
        if (diff !== 0) return diff;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return sorted;
  }, [events, search, activeCategories, activeSignificance, selectedYear, sortOption]);

  const toggle = <T,>(setState: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const hasAnyFilter =
    search !== '' ||
    activeCategories.size > 0 ||
    activeSignificance.size > 0 ||
    selectedYear !== null ||
    sortOption !== 'newest';

  const resetAll = () => {
    setSearch('');
    setActiveCategories(new Set());
    setActiveSignificance(new Set());
    setSelectedYear(null);
    setSortOption('newest');
  };

  if (events.length === 0) {
    return (
      <div className="py-24 px-4 max-w-xl mx-auto text-center">
        <p className="label-eyebrow mb-3">§ Nothing to explore yet</p>
        <p
          className="font-display text-3xl font-normal text-ledger-text leading-tight"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 0, 'WONK' 0" }}
        >
          Entries will appear here once content is added.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter panel */}
      <div className="flex flex-col gap-4 mb-8 p-5 rounded-md border border-ledger-border bg-ledger-surface/30">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ledger-text-dim"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            placeholder="Search events by title, summary, or tag…"
            aria-label="Search events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ledger-bg border border-ledger-border rounded-md text-sm text-ledger-text placeholder:text-ledger-text-dim focus:outline-none focus:border-category-policy/60 transition-colors"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-eyebrow mr-1">Category</span>
          {categories.map((cat) => {
            const isActive = activeCategories.has(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(setActiveCategories, cat.id)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm border min-h-[32px] transition-colors duration-150 ${
                  isActive
                    ? 'border-white/30 text-white bg-white/10'
                    : 'border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text'
                }`}
                style={isActive ? { borderColor: cat.color + '60', backgroundColor: cat.color + '20', color: cat.color } : undefined}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Significance chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-eyebrow mr-1">Significance</span>
          {SIGNIFICANCE_LEVELS.map((level) => {
            const isActive = activeSignificance.has(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggle(setActiveSignificance, level)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm border min-h-[32px] capitalize transition-colors duration-150 ${
                  isActive
                    ? 'border-white/30 text-white bg-white/10'
                    : 'border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>

        {/* Advanced filters — disclosed on demand */}
        <div className="border-t border-ledger-border/60 pt-4">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            aria-expanded={advancedOpen}
            className="text-xs font-mono text-ledger-text-dim hover:text-ledger-text transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <svg
              className={`w-3 h-3 transition-transform ${advancedOpen ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            More filters
          </button>

          {advancedOpen && (
            <div className="mt-4 flex flex-col gap-3">
              {/* Year chips */}
              {availableYears.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label-eyebrow mr-1">Year</span>
                  <button
                    type="button"
                    onClick={() => setSelectedYear(null)}
                    aria-pressed={selectedYear === null}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm border min-h-[32px] transition-colors duration-150 ${
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
                        type="button"
                        onClick={() => setSelectedYear(isActive ? null : year)}
                        aria-pressed={isActive}
                        className={`px-3 py-1.5 text-xs font-mono font-medium rounded-sm border transition-colors duration-150 tabular-nums min-h-[32px] ${
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

              {/* Sort chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="label-eyebrow mr-1">Sort</span>
                {(['newest', 'oldest', 'significance'] as SortOption[]).map((opt) => {
                  const isActive = sortOption === opt;
                  const label = opt === 'newest' ? 'Newest first' : opt === 'oldest' ? 'Oldest first' : 'Most significant';
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSortOption(opt)}
                      aria-pressed={isActive}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm border min-h-[32px] transition-colors duration-150 ${
                        isActive
                          ? 'border-white/30 text-white bg-white/10'
                          : 'border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-xs text-ledger-text-dim font-mono tabular-nums">
          <span>
            {filtered.length === events.length
              ? `${events.length} entries`
              : `${filtered.length} of ${events.length} entries`}
            {search && <span className="ml-2 italic normal-case font-sans">matching "{search}"</span>}
          </span>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetAll}
              className="text-ledger-text-muted hover:text-ledger-text transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results — table-like archival list */}
      {filtered.length === 0 ? (
        <div className="py-16 px-4 max-w-xl mx-auto text-center">
          <p
            className="font-display italic text-xl text-ledger-text-muted mb-2 leading-snug"
            style={{ fontVariationSettings: "'opsz' 14, 'SOFT' 0, 'WONK' 0" }}
          >
            Nothing matches that combination.
          </p>
          <p className="text-sm text-ledger-text-muted mb-5 leading-relaxed">
            {search && activeCategories.size === 0 && activeSignificance.size === 0 && selectedYear === null ? (
              <>
                No entries contain "<span className="font-mono text-ledger-text">{search}</span>". Try a shorter query or a different spelling.
              </>
            ) : (
              <>Try dropping one filter — the most constraining combinations rarely return results.</>
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm font-mono">
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="px-3 py-1 rounded-sm border border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text transition-colors"
              >
                clear search
              </button>
            )}
            {activeCategories.size > 0 && (
              <button
                type="button"
                onClick={() => setActiveCategories(new Set())}
                className="px-3 py-1 rounded-sm border border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text transition-colors"
              >
                clear category
              </button>
            )}
            {activeSignificance.size > 0 && (
              <button
                type="button"
                onClick={() => setActiveSignificance(new Set())}
                className="px-3 py-1 rounded-sm border border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text transition-colors"
              >
                clear significance
              </button>
            )}
            {selectedYear !== null && (
              <button
                type="button"
                onClick={() => setSelectedYear(null)}
                className="px-3 py-1 rounded-sm border border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text transition-colors"
              >
                clear year
              </button>
            )}
            <button
              type="button"
              onClick={resetAll}
              className="px-3 py-1 rounded-sm border border-category-policy/30 text-category-policy hover:border-category-policy/60 hover:bg-category-policy/10 transition-colors"
            >
              clear all filters →
            </button>
          </div>
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
                      event.significance === 'landmark' ? 'text-amber-400' : 'text-sky-300'
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
