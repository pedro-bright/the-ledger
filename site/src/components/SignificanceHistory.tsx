import React from 'react';

interface SignificanceEntry {
  level: string;
  date: string;
  reason: string;
}

interface Props {
  history?: SignificanceEntry[];
}

const LEVEL_LABEL: Record<string, string> = {
  landmark: 'Landmark',
  major: 'Major',
  notable: 'Notable',
};

export default function SignificanceHistory({ history }: Props) {
  if (!history || history.length <= 1) return null;

  return (
    <section className="sig-history" aria-labelledby="sig-history-title">
      <h4 id="sig-history-title" className="sig-history__title">
        Significance history
      </h4>
      <ol className="sig-history__list">
        {history.map((entry, i) => (
          <li key={i} className="sig-history__row">
            <time className="sig-history__date" dateTime={entry.date}>
              {new Date(entry.date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </time>
            <span className={`flag-chip flag-chip--${entry.level}`}>
              {LEVEL_LABEL[entry.level] || entry.level}
            </span>
            <span className="sig-history__reason">{entry.reason}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
