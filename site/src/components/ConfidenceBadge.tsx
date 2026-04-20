import React from 'react';

interface Props {
  level?: 'high' | 'medium' | 'low' | 'disputed';
}

const config: Record<
  string,
  { label: string; color: string; bg: string; hint: string }
> = {
  high: {
    label: 'High confidence',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    hint: 'Multiple independent primary sources corroborate this.',
  },
  medium: {
    label: 'Medium confidence',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    hint: 'Reported by credible secondary sources; primary confirmation pending.',
  },
  low: {
    label: 'Low confidence',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
    hint: 'Limited sourcing — treat as provisional.',
  },
  disputed: {
    label: 'Disputed',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/20',
    hint: 'Credible sources disagree on the facts.',
  },
};

export default function ConfidenceBadge({ level }: Props) {
  if (!level || level === 'high') return null;
  const c = config[level] || config.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-sm border ${c.bg} ${c.color}`}
      title={c.hint}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.color.replace('text-', 'bg-')}`} aria-hidden="true" />
      {c.label}
    </span>
  );
}

export const confidenceHints = Object.fromEntries(
  Object.entries(config).map(([k, v]) => [k, v.hint]),
);
