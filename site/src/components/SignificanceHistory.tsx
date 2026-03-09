import React from 'react';

interface SignificanceEntry {
  level: string;
  date: string;
  reason: string;
}

interface Props {
  history?: SignificanceEntry[];
}

const levelColors: Record<string, string> = {
  landmark: 'text-white bg-white/10',
  major: 'text-ledger-text bg-ledger-surface',
  notable: 'text-ledger-text-muted bg-ledger-surface',
};

export default function SignificanceHistory({ history }: Props) {
  if (!history || history.length <= 1) return null;

  return (
    <div className="mt-4">
      <h4 className="text-xs font-mono uppercase tracking-wider text-ledger-text-dim mb-3">
        Significance History
      </h4>
      <div className="space-y-2">
        {history.map((entry, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="font-mono text-xs text-ledger-text-dim whitespace-nowrap pt-0.5">
              {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${levelColors[entry.level] || levelColors.notable}`}
            >
              {entry.level}
            </span>
            <span className="text-ledger-text-muted">{entry.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
