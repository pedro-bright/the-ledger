import React from 'react';

interface Props {
  level?: 'high' | 'medium' | 'low' | 'disputed';
}

// Light-mode palette: darker text + pale tint bg + thin border, all AA-contrast
// over the #FAFAF7 page background.
const config: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string; hint: string }
> = {
  high: {
    label: 'High confidence',
    color: '#065F46', // emerald-800
    bg: '#E5F3E9',
    border: '#B7DCC1',
    dot: '#047857',
    hint: 'Multiple independent primary sources corroborate this.',
  },
  medium: {
    label: 'Medium confidence',
    color: '#92400E', // amber-800
    bg: '#FEF3C7',
    border: '#F2D888',
    dot: '#B45309',
    hint: 'Reported by credible secondary sources; primary confirmation pending.',
  },
  low: {
    label: 'Low confidence',
    color: '#9A3412', // orange-800
    bg: '#FFEDD5',
    border: '#F7CBA3',
    dot: '#C2410C',
    hint: 'Limited sourcing — treat as provisional.',
  },
  disputed: {
    label: 'Disputed',
    color: '#991B1B', // red-800
    bg: '#FEE2E2',
    border: '#F5B2B2',
    dot: '#B91C1C',
    hint: 'Credible sources disagree on the facts.',
  },
};

export default function ConfidenceBadge({ level }: Props) {
  if (!level || level === 'high') return null;
  const c = config[level] || config.medium;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-sans font-semibold rounded-sm border uppercase tracking-[0.04em]"
      style={{
        color: c.color,
        backgroundColor: c.bg,
        borderColor: c.border,
      }}
      title={c.hint}
      aria-label={`${c.label}. ${c.hint}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: c.dot }}
        aria-hidden="true"
      />
      {c.label}
    </span>
  );
}

export const confidenceHints = Object.fromEntries(
  Object.entries(config).map(([k, v]) => [k, v.hint]),
);
