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

// Category text colors — AA on page-bg. Mirrors the wiki palette.
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

export default function EventCard({
  id,
  title,
  date,
  category,
  significance,
  summary,
}: Props) {
  const hex = categoryHex[category] || '#5C564D';
  const displayCategory = category.replace('-', ' ');

  return (
    <article className="event-card">
      <div className="event-card__row">
        <time className="event-card__date font-mono" dateTime={date}>
          {date}
        </time>
        <span
          className="event-card__pip"
          aria-hidden
          title={displayCategory}
          style={{ background: hex }}
        />
        <a href={`/events/${id}`} className="event-card__title">
          {title}
        </a>
        <span
          className="event-card__category font-mono"
          style={{ color: hex }}
        >
          {displayCategory}
        </span>
        {significance && (
          <span className={`flag-chip flag-chip--${significance}`}>
            {SIGNIFICANCE_LABEL[significance]}
          </span>
        )}
      </div>
      {summary && (
        <p className="event-card__summary">{summary}</p>
      )}
    </article>
  );
}
