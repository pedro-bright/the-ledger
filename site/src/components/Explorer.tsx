import React, { useEffect, useMemo, useState } from 'react';
import { getSignificanceOrder } from '../lib/epistemic';

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

// Light-mode (AA on page-bg) category text colors, mirroring the wiki palette.
const categoryTextColor: Record<string, string> = {
  policy: '#4338CA',
  models: '#B45309',
  research: '#047857',
  industry: '#6D28D9',
  safety: '#B91C1C',
  culture: '#BE185D',
  'open-source': '#0E7490',
};

const SIGNIFICANCE_LABEL: Record<'landmark' | 'major' | 'notable', string> = {
  landmark: 'Landmark',
  major: 'Major',
  notable: 'Notable',
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

  // Shared chip-style button classes. Resting: page-bg, 1px rule border, ink-muted.
  // Active: wiki-surface bg, rule-strong border, ink text, semibold.
  // Focus state inherits the global :focus-visible outline (2px wiki-link).
  const chipBase =
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded-sm border min-h-[32px] transition-colors duration-150 cursor-pointer';
  const chipResting =
    'bg-page-bg border-rule text-ink-muted hover:text-ink hover:border-rule-strong';
  const chipActive =
    'bg-wiki-surface border-rule-strong text-ink font-semibold';

  if (events.length === 0) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center">
        <p className="label-eyebrow mb-3">§ Nothing to explore yet</p>
        <p className="font-display-subhead text-2xl font-medium text-ink leading-tight mb-4">
          The ledger is being built.
        </p>
        <p className="font-serif text-base text-ink-mid leading-relaxed mb-5">
          Entries appear here as they pass editorial review. Check back shortly, or propose a source tip to help seed the record.
        </p>
        <a
          href="https://github.com/pedro-bright/the-ledger/issues/new?template=source-tip.yml"
          className="text-sm font-sans text-wiki-link hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit a source tip →
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Filter panel */}
      <section
        aria-label="Filter controls"
        className="mb-6 p-5 rounded-sm border border-rule-strong bg-wiki-surface flex flex-col gap-4"
      >
        {/* Search */}
        <div>
          <label htmlFor="explorer-search" className="label-eyebrow block mb-1.5">
            Keyword search
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              id="explorer-search"
              type="search"
              placeholder="Search title, summary, or tag — e.g. GPT-4 release"
              aria-label="Search events by title, summary, or tag"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-[10px] bg-page-bg border border-rule-strong text-sm text-ink placeholder:text-ink-faint font-sans rounded-sm min-h-[40px]"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="label-eyebrow mr-1">Category</span>
          {categories.map((cat) => {
            const isActive = activeCategories.has(cat.id);
            const hex = categoryTextColor[cat.id] || '#5C564D';
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(setActiveCategories, cat.id)}
                aria-pressed={isActive}
                className={`${chipBase} ${isActive ? chipActive : chipResting}`}
              >
                <span
                  aria-hidden
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: hex }}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Significance chips */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="label-eyebrow mr-1">Significance</span>
          {SIGNIFICANCE_LEVELS.map((level) => {
            const isActive = activeSignificance.has(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggle(setActiveSignificance, level)}
                aria-pressed={isActive}
                aria-label={`Filter by ${SIGNIFICANCE_LABEL[level]} significance`}
                className={`${chipBase} ${isActive ? chipActive : chipResting}`}
              >
                <span className={`flag-chip flag-chip--${level}`}>
                  {SIGNIFICANCE_LABEL[level]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Advanced filters — disclosed on demand */}
        <div className="border-t border-rule pt-4">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            aria-expanded={advancedOpen}
            className="text-xs font-mono text-ink-muted hover:text-wiki-link transition-colors uppercase tracking-wider inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer"
            style={{ letterSpacing: '0.08em' }}
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
            {advancedOpen ? 'Hide' : 'Show'} year & sort
          </button>

          {advancedOpen && (
            <div className="mt-4 flex flex-col gap-4">
              {/* Year chips */}
              {availableYears.length > 0 && (
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="label-eyebrow mr-1">Year</span>
                  <button
                    type="button"
                    onClick={() => setSelectedYear(null)}
                    aria-pressed={selectedYear === null}
                    className={`${chipBase} ${selectedYear === null ? chipActive : chipResting}`}
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
                        className={`${chipBase} font-mono tabular-nums ${isActive ? chipActive : chipResting}`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sort */}
              <div className="flex flex-wrap items-baseline gap-2">
                <label htmlFor="explorer-sort" className="label-eyebrow mr-1">Sort</label>
                <select
                  id="explorer-sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-page-bg border border-rule-strong text-sm text-ink font-sans py-[9px] px-3 rounded-sm min-h-[36px]"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="significance">Most significant</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* sr-only live region announces filter result counts to assistive tech */}
        <span
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {hasAnyFilter
            ? filtered.length === 0
              ? 'No entries match the current filters.'
              : `${filtered.length} of ${events.length} entries match the current filters.`
            : `Showing all ${events.length} entries.`}
        </span>

        {/* Active filters summary + status */}
        <div className="border-t border-rule pt-3 flex flex-col gap-2">
          {/* Selected filter chips with remove × */}
          {hasAnyFilter && (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="label-eyebrow mr-1">Active</span>
              {search && (
                <ActiveChip label={`"${search}"`} onRemove={() => setSearch('')} />
              )}
              {Array.from(activeCategories).map((cat) => (
                <ActiveChip
                  key={`cat-${cat}`}
                  label={categories.find((c) => c.id === cat)?.label || cat}
                  onRemove={() => toggle(setActiveCategories, cat)}
                  color={categoryTextColor[cat]}
                />
              ))}
              {Array.from(activeSignificance).map((level) => (
                <ActiveChip
                  key={`sig-${level}`}
                  label={SIGNIFICANCE_LABEL[level as 'landmark' | 'major' | 'notable']}
                  onRemove={() => toggle(setActiveSignificance, level)}
                />
              ))}
              {selectedYear !== null && (
                <ActiveChip
                  label={String(selectedYear)}
                  onRemove={() => setSelectedYear(null)}
                />
              )}
              {sortOption !== 'newest' && (
                <ActiveChip
                  label={sortOption === 'oldest' ? 'Oldest first' : 'Most significant'}
                  onRemove={() => setSortOption('newest')}
                />
              )}
              <button
                type="button"
                onClick={resetAll}
                className="text-xs font-sans text-wiki-link hover:underline ml-1 bg-transparent border-0 p-0 cursor-pointer"
              >
                Reset all
              </button>
            </div>
          )}
          <div className="flex items-center justify-between text-xs font-mono text-ink-faint tabular-nums">
            <span>
              {filtered.length === events.length
                ? `${events.length} entries`
                : `${filtered.length} of ${events.length} entries`}
            </span>
          </div>
        </div>
      </section>

      {/* Results — wiki-native row list */}
      {filtered.length === 0 ? (
        <div className="py-14 px-4 max-w-xl mx-auto text-center">
          <p className="font-display-text italic text-lg text-ink-mid mb-2 leading-snug">
            No entries match this combination.
          </p>
          <p className="text-sm text-ink-muted mb-5 leading-relaxed font-sans">
            {search && activeCategories.size === 0 && activeSignificance.size === 0 && selectedYear === null ? (
              <>
                Nothing contains "<span className="font-mono text-ink">{search}</span>". Try a shorter query or a different spelling.
              </>
            ) : (
              <>Try dropping one filter — the most constraining combinations rarely return results.</>
            )}
          </p>
          <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-sans">
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Clear search
              </button>
            )}
            {activeCategories.size > 0 && (
              <button
                type="button"
                onClick={() => setActiveCategories(new Set())}
                className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Drop category filter
              </button>
            )}
            {activeSignificance.size > 0 && (
              <button
                type="button"
                onClick={() => setActiveSignificance(new Set())}
                className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Drop significance filter
              </button>
            )}
            {selectedYear !== null && (
              <button
                type="button"
                onClick={() => setSelectedYear(null)}
                className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Drop year filter
              </button>
            )}
            <button
              type="button"
              onClick={resetAll}
              className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Reset all filters
            </button>
          </p>
        </div>
      ) : (
        <ul className="explorer-results" aria-label={`${filtered.length} filtered results`}>
          {filtered.map((event) => (
            <ResultRow key={event.id} event={event} />
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Small subcomponents ────────────────────────────────────────

function ActiveChip({
  label,
  onRemove,
  color,
}: {
  label: string;
  onRemove: () => void;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-sans font-medium rounded-sm border border-rule-strong bg-wiki-surface-strong text-ink"
      style={color ? { color } : undefined}
    >
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-0.5 text-ink-faint hover:text-ink bg-transparent border-0 p-0 cursor-pointer leading-none"
      >
        ×
      </button>
    </span>
  );
}

function ResultRow({ event }: { event: EventData }) {
  const hex = categoryTextColor[event.category] || '#5C564D';
  const displayCategory = event.category.replace('-', ' ');
  return (
    <li className="explorer-row">
      <time
        className="explorer-row__date font-mono"
        dateTime={event.date}
      >
        {event.date}
      </time>
      <span
        className="explorer-row__pip"
        aria-hidden
        title={displayCategory}
        style={{ background: hex }}
      />
      <a href={`/events/${event.slug}`} className="explorer-row__title">
        {event.title}
      </a>
      <span
        className="explorer-row__category font-mono"
        style={{ color: hex }}
      >
        {displayCategory}
      </span>
      {event.significance && (
        <span className={`flag-chip flag-chip--${event.significance}`}>
          {SIGNIFICANCE_LABEL[event.significance]}
        </span>
      )}
    </li>
  );
}
