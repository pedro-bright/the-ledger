import React from 'react';

interface Props {
  status?: 'uncontested' | 'contested' | 'superseded' | 'unresolved';
  /** Show only the icon (useful for dense list rows). */
  iconOnly?: boolean;
}

const config: Record<
  string,
  { label: string; color: string; bg: string; border: string; hint: string }
> = {
  uncontested: {
    label: 'Uncontested',
    color: '#065F46',
    bg: '#E5F3E9',
    border: '#B7DCC1',
    hint: 'No formal challenge has been filed against this claim.',
  },
  contested: {
    label: 'Contested',
    color: '#92400E',
    bg: '#FEF3C7',
    border: '#F2D888',
    hint: 'At least one formal challenge is open against this claim.',
  },
  superseded: {
    label: 'Superseded',
    color: '#5C564D',
    bg: '#EDEAE3',
    border: '#D9D3C5',
    hint: 'Replaced by a later entry that re-evaluates the facts.',
  },
  unresolved: {
    label: 'Unresolved',
    color: '#9A3412',
    bg: '#FFEDD5',
    border: '#F7CBA3',
    hint: 'The dispute remains open — no authoritative resolution yet.',
  },
};

export default function ContestationBadge({ status, iconOnly = false }: Props) {
  if (!status) return null;
  const c = config[status] || config.uncontested;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-sans font-semibold rounded-sm border uppercase tracking-[0.04em] ${iconOnly ? 'w-[22px] h-[22px] p-0 justify-center' : ''}`}
      style={{
        color: c.color,
        backgroundColor: c.bg,
        borderColor: c.border,
      }}
      title={c.hint}
    >
      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {status === 'uncontested' && (
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {status === 'contested' && (
          <>
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
          </>
        )}
        {status === 'superseded' && (
          <path
            d="M2 6h8M6 2v8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        )}
        {status === 'unresolved' && (
          <>
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M4.5 5C4.5 4.17 5.17 3.5 6 3.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5v1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="6" cy="9" r="0.5" fill="currentColor" />
          </>
        )}
      </svg>
      {!iconOnly && c.label}
    </span>
  );
}

export const contestationHints = Object.fromEntries(
  Object.entries(config).map(([k, v]) => [k, v.hint]),
);
