import React from 'react';

interface Props {
  level?: 'high' | 'medium' | 'low' | 'disputed';
}

const config: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: 'High confidence', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  medium: { label: 'Medium confidence', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  low: { label: 'Low confidence', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  disputed: { label: 'Disputed', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

export default function ConfidenceBadge({ level }: Props) {
  if (!level || level === 'high') return null;
  const c = config[level] || config.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-full border ${c.bg} ${c.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.color.replace('text-', 'bg-')}`} />
      {c.label}
    </span>
  );
}
