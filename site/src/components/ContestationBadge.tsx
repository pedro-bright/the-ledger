import React from 'react';

interface Props {
  status?: 'uncontested' | 'contested' | 'superseded' | 'unresolved';
}

const config: Record<string, { label: string; color: string; bg: string }> = {
  uncontested: { label: 'Uncontested', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  contested: { label: 'Contested', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  superseded: { label: 'Superseded', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
  unresolved: { label: 'Unresolved', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
};

export default function ContestationBadge({ status }: Props) {
  if (!status) return null;
  const c = config[status] || config.uncontested;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-full border ${c.bg} ${c.color}`}
    >
      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
        {status === 'uncontested' && (
          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {status === 'contested' && (
          <>
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
          </>
        )}
        {status === 'superseded' && (
          <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        )}
        {status === 'unresolved' && (
          <>
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4.5 5C4.5 4.17 5.17 3.5 6 3.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="6" cy="9" r="0.5" fill="currentColor" />
          </>
        )}
      </svg>
      {c.label}
    </span>
  );
}
