// Pure helpers safe to import from client-hydrated React components.
// Keep this file fs/path-free — it must not transitively pull in content.ts,
// which reads from the filesystem at module scope.

export function getSignificanceOrder(sig?: string): number {
  switch (sig) {
    case 'landmark':
      return 3;
    case 'major':
      return 2;
    case 'notable':
      return 1;
    default:
      return 0;
  }
}

export const SIGNIFICANCE_LEVELS = ['landmark', 'major', 'notable'] as const;
export type SignificanceLevel = (typeof SIGNIFICANCE_LEVELS)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  policy: '#4338CA',
  models: '#B45309',
  research: '#047857',
  industry: '#6D28D9',
  safety: '#B91C1C',
  culture: '#BE185D',
  'open-source': '#0E7490',
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#5C564D';
}

export function formatCategoryLabel(category: string): string {
  return category.replace(/-/g, ' ').replace(/_/g, ' ');
}
