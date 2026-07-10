import type { NodeCategory } from '@/shared/types';

/** Human-readable labels for node categories (shared across features). */
export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  trigger: 'Trigger',
  logic: 'Logic',
  api: 'API',
  data: 'Data',
  output: 'Output',
};
