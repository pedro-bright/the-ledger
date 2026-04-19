import React from 'react';

interface Category {
  id: string;
  label: string;
  color: string;
}

export type SortOption = 'newest' | 'oldest' | 'significance';

interface Props {
  categories: Category[];
  activeCategories: Set<string>;
  onToggleCategory: (id: string) => void;
  significanceLevels: string[];
  activeSignificance: Set<string>;
  onToggleSignificance: (level: string) => void;
  onReset: () => void;
  eventCount: number;
  filteredCount: number;
  /** Optional: year filter chips (e.g. [2026, 2025, 2024, 2023]). Empty/undefined hides the row. */
  years?: number[];
  /** Optional: currently selected year, or null for "All". */
  activeYear?: number | null;
  /** Optional: handler invoked with the new year (null for "All"). */
  onSelectYear?: (year: number | null) => void;
  /** Optional: currently selected sort option. */
  sortOption?: SortOption;
  /** Optional: handler for sort changes. */
  onSortChange?: (option: SortOption) => void;
}

export default function FilterBar({
  categories,
  activeCategories,
  onToggleCategory,
  significanceLevels,
  activeSignificance,
  onToggleSignificance,
  onReset,
  eventCount,
  filteredCount,
  years,
  activeYear = null,
  onSelectYear,
  sortOption,
  onSortChange,
}: Props) {
  const hasYearFilter = Array.isArray(years) && years.length > 0 && !!onSelectYear;
  const hasSort = !!sortOption && !!onSortChange;
  const hasFilters =
    activeCategories.size > 0 ||
    activeSignificance.size > 0 ||
    (hasYearFilter && activeYear !== null);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-ledger-border bg-ledger-surface/30">
      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-ledger-text-dim uppercase tracking-wider mr-1">
          Category
        </span>
        {categories.map((cat) => {
          const isActive = activeCategories.has(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onToggleCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-150 ${
                isActive
                  ? 'border-white/30 text-white bg-white/10'
                  : 'border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text'
              }`}
              style={isActive ? { borderColor: cat.color + '60', backgroundColor: cat.color + '20', color: cat.color } : {}}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Significance filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-ledger-text-dim uppercase tracking-wider mr-1">
          Significance
        </span>
        {significanceLevels.map((level) => {
          const isActive = activeSignificance.has(level);
          return (
            <button
              key={level}
              onClick={() => onToggleSignificance(level)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize transition-all duration-150 ${
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

      {/* Year filter (optional) */}
      {hasYearFilter && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-ledger-text-dim uppercase tracking-wider mr-1">
            Year
          </span>
          <button
            onClick={() => onSelectYear!(null)}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-150 ${
              activeYear === null
                ? 'border-white/30 text-white bg-white/10'
                : 'border-ledger-border text-ledger-text-muted hover:border-ledger-border-light hover:text-ledger-text'
            }`}
          >
            All
          </button>
          {years!.map((year) => {
            const isActive = activeYear === year;
            return (
              <button
                key={year}
                onClick={() => onSelectYear!(isActive ? null : year)}
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

      {/* Sort control (optional) */}
      {hasSort && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-mono text-ledger-text-dim uppercase tracking-wider mr-1">
            Sort
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange!(e.target.value as SortOption)}
            className="px-2.5 py-1 bg-ledger-surface border border-ledger-border rounded-full text-xs text-ledger-text-muted focus:outline-none focus:border-ledger-border-light transition-colors"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="significance">Most significant</option>
          </select>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-ledger-text-dim">
        <span className="font-mono">
          {filteredCount === eventCount
            ? `${eventCount} events`
            : `${filteredCount} of ${eventCount} events`}
        </span>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-ledger-text-muted hover:text-ledger-text transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
