import type { NodeCategory } from '@/shared/types';

/**
 * Central style source of truth for node categories. Each category maps to a
 * fixed set of Tailwind utility classes so node visuals stay consistent and
 * are defined in exactly one place.
 */
type CategoryStyle = {
  /** Icon chip background + foreground. */
  iconClass: string;
  /** Left accent bar color. */
  accentClass: string;
  /** Human-readable category name for labels/aria. */
  label: string;
};

export const CATEGORY_STYLES: Record<NodeCategory, CategoryStyle> = {
  trigger: {
    iconClass: 'bg-indigo-50 text-indigo-600',
    accentClass: 'bg-indigo-500',
    label: 'Trigger',
  },
  logic: {
    iconClass: 'bg-amber-50 text-amber-600',
    accentClass: 'bg-amber-500',
    label: 'Logic',
  },
  api: {
    iconClass: 'bg-sky-50 text-sky-600',
    accentClass: 'bg-sky-500',
    label: 'API',
  },
  data: {
    iconClass: 'bg-emerald-50 text-emerald-600',
    accentClass: 'bg-emerald-500',
    label: 'Data',
  },
  output: {
    iconClass: 'bg-violet-50 text-violet-600',
    accentClass: 'bg-violet-500',
    label: 'Output',
  },
};
