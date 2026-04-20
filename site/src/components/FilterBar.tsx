import React from 'react';

interface Category {
  id: string;
  label: string;
  color: string;
}

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
}: Props) {
  const hasFilters = activeCategories.size > 0 || activeSignificance.size > 0;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-md border border-ledger-border bg-ledger-surface/30">
      {/* Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-eyebrow mr-1">Category</span>
        {categories.map((cat) => {
          const isActive = activeCategories.has(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
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
        {significanceLevels.map((level) => {
          const isActive = activeSignificance.has(level);
          return (
            <button
              key={level}
              type="button"
              onClick={() => onToggleSignificance(level)}
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

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-ledger-text-dim font-mono tabular-nums pt-1">
        <span>
          {filteredCount === eventCount
            ? `${eventCount} entries`
            : `${filteredCount} of ${eventCount} entries`}
        </span>
        {hasFilters && (
          <button
            type="button"
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
