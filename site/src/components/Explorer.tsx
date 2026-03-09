import React, { useState, useMemo } from 'react';

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

const categoryColors: Record<string, string> = {
  policy: 'bg-category-policy/20 text-category-policy border-category-policy/30',
  models: 'bg-category-models/20 text-category-models border-category-models/30',
  research: 'bg-category-research/20 text-category-research border-category-research/30',
  industry: 'bg-category-industry/20 text-category-industry border-category-industry/30',
  safety: 'bg-category-safety/20 text-category-safety border-category-safety/30',
  culture: 'bg-category-culture/20 text-category-culture border-category-culture/30',
  'open-source': 'bg-category-open-source/20 text-category-open-source border-category-open-source/30',
};

export default function Explorer({ events, categories }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSignificance, setSelectedSignificance] = useState<string>('');

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (selectedCategory && e.category !== selectedCategory) return false;
      if (selectedSignificance && e.significance !== selectedSignificance) return false;
      if (search) {
        const q = search.toLowerCase();
        const searchable = `${e.title} ${e.summary} ${(e.tags || []).join(' ')}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [events, search, selectedCategory, selectedSignificance]);

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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
      </div>

      {/* Results count */}
      <p className="text-xs font-mono text-ledger-text-dim mb-4">
        {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        {search && ` matching "${search}"`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-ledger-text-muted">No events match your search.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((event) => {
            const pillColor = categoryColors[event.category] || 'bg-ledger-surface text-ledger-text-muted border-ledger-border';
            return (
              <a
                key={event.id}
                href={`/events/${event.slug}`}
                className="group block p-4 rounded-lg border border-ledger-border bg-ledger-surface/50 hover:bg-ledger-surface hover:border-ledger-border-light transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <time className="text-xs font-mono text-ledger-text-dim">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full border ${pillColor}`}>
                    {event.category.replace('-', ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold group-hover:text-white transition-colors line-clamp-2">
                  {event.title}
                </h3>
                {event.summary && (
                  <p className="mt-1.5 text-xs text-ledger-text-muted line-clamp-2">{event.summary}</p>
                )}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-ledger-text-dim">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
