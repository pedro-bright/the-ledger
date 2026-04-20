import React from 'react';

interface Props {
  id: string;
  title: string;
  date: string;
  category: string;
  significance?: 'landmark' | 'major' | 'notable';
  summary: string;
  confidence?: string;
  contestation?: string;
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

const categoryBorderColors: Record<string, string> = {
  policy: 'border-l-category-policy',
  models: 'border-l-category-models',
  research: 'border-l-category-research',
  industry: 'border-l-category-industry',
  safety: 'border-l-category-safety',
  culture: 'border-l-category-culture',
  'open-source': 'border-l-category-open-source',
};

const significanceColors: Record<string, string> = {
  landmark: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  major: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
  notable: 'text-ledger-text-dim bg-ledger-surface border-ledger-border',
};

export default function EventCard({ id, title, date, category, significance, summary, confidence, contestation }: Props) {
  const isLandmark = significance === 'landmark';
  const isMajor = significance === 'major';
  const borderColor = categoryBorderColors[category] || 'border-l-ledger-border';
  const pillColor = categoryColors[category] || 'bg-ledger-surface text-ledger-text-muted border-ledger-border';
  const sigClass = significance ? significanceColors[significance] : null;

  return (
    <a
      href={`/events/${id}`}
      className={`group block rounded-md border border-ledger-border bg-ledger-surface/50 hover:bg-ledger-surface hover:border-ledger-border-light transition-all duration-200 ${
        isLandmark ? `border-l-[3px] ${borderColor} p-5` : isMajor ? `border-l-2 ${borderColor} p-4` : 'p-4'
      }`}
    >
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <time className="text-xs font-mono text-ledger-text-dim">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-sm border ${pillColor}`}>
          {category.replace('-', ' ')}
        </span>
        {significance && sigClass && (
          <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border ${sigClass}`}>
            {significance}
          </span>
        )}
      </div>

      {/* Title — serif display for landmark/major, sans for notable.
         Opsz matches rendered size: 36 for landmark (~24px), 24 for major (~20px). */}
      <h3
        className={
          isLandmark
            ? 'font-display text-2xl font-medium leading-tight text-ledger-text group-hover:text-white transition-colors'
            : isMajor
              ? 'font-display text-xl font-medium leading-snug text-ledger-text group-hover:text-white transition-colors'
              : 'text-sm font-semibold text-ledger-text group-hover:text-white transition-colors'
        }
        style={
          isLandmark
            ? { fontVariationSettings: "'opsz' 36, 'SOFT' 0, 'WONK' 0" }
            : isMajor
              ? { fontVariationSettings: "'opsz' 24, 'SOFT' 0, 'WONK' 0" }
              : undefined
        }
      >
        {title}
      </h3>

      {/* Summary */}
      {summary && (
        <p className={`mt-2 text-ledger-text-muted line-clamp-2 ${isLandmark ? 'text-sm leading-relaxed' : 'text-xs leading-relaxed'}`}>
          {summary}
        </p>
      )}
    </a>
  );
}
