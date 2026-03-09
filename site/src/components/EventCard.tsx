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

export default function EventCard({ id, title, date, category, significance, summary, confidence, contestation }: Props) {
  const isLandmark = significance === 'landmark';
  const isMajor = significance === 'major';
  const borderColor = categoryBorderColors[category] || 'border-l-ledger-border';
  const pillColor = categoryColors[category] || 'bg-ledger-surface text-ledger-text-muted border-ledger-border';

  return (
    <a
      href={`/events/${id}`}
      className={`group block rounded-lg border border-ledger-border bg-ledger-surface/50 hover:bg-ledger-surface hover:border-ledger-border-light transition-all duration-200 ${
        isLandmark ? `border-l-[3px] ${borderColor} p-5` : isMajor ? `border-l-2 ${borderColor} p-4` : 'p-4'
      }`}
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-2">
        <time className="text-xs font-mono text-ledger-text-dim">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full border ${pillColor}`}>
          {category.replace('-', ' ')}
        </span>
        {isLandmark && (
          <span className="px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-white bg-white/10 rounded-full border border-white/20">
            Landmark
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className={`font-semibold group-hover:text-white transition-colors ${
          isLandmark ? 'text-lg' : isMajor ? 'text-base' : 'text-sm'
        }`}
      >
        {title}
      </h3>

      {/* Summary */}
      {summary && (
        <p className={`mt-2 text-ledger-text-muted line-clamp-2 ${isLandmark ? 'text-sm' : 'text-xs'}`}>
          {summary}
        </p>
      )}
    </a>
  );
}
