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

// AA-on-light category text hexes, mirrored from the wiki palette in CategoryTag.
const categoryHex: Record<string, string> = {
  policy: '#4338CA',
  models: '#B45309',
  research: '#047857',
  industry: '#6D28D9',
  safety: '#B91C1C',
  culture: '#BE185D',
  'open-source': '#0E7490',
};

const SIGNIFICANCE_LABEL: Record<string, string> = {
  landmark: 'Landmark',
  major: 'Major',
  notable: 'Notable',
};

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

  // Chip button base/resting/active — same vocabulary as Explorer.
  const chipBase =
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded-sm border min-h-[32px] transition-colors duration-150 cursor-pointer';
  const chipResting =
    'bg-page-bg border-rule text-ink-muted hover:text-ink hover:border-rule-strong';
  const chipActive =
    'bg-wiki-surface border-rule-strong text-ink font-semibold';

  return (
    <div className="flex flex-col gap-3 p-4 rounded-sm border border-rule-strong bg-wiki-surface/60">
      {/* Category chips */}
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="label-eyebrow mr-1">Category</span>
        {categories.map((cat) => {
          const isActive = activeCategories.has(cat.id);
          const hex = categoryHex[cat.id] || '#5C564D';
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
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
        {significanceLevels.map((level) => {
          const isActive = activeSignificance.has(level);
          const label = SIGNIFICANCE_LABEL[level] || level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onToggleSignificance(level)}
              aria-pressed={isActive}
              className={`${chipBase} ${isActive ? chipActive : chipResting}`}
            >
              <span className={`flag-chip flag-chip--${level}`} aria-hidden>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-ink-faint font-mono tabular-nums pt-1 border-t border-rule">
        <span>
          {filteredCount === eventCount
            ? `${eventCount} entries`
            : `${filteredCount} of ${eventCount} entries`}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-wiki-link hover:underline bg-transparent border-0 p-0 cursor-pointer font-sans"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
