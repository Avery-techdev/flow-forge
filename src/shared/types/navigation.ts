/**
 * Application navigation model. The five top-level screens plus the shape of a
 * navigation entry.
 */

export const SCREEN_IDS = [
  'dashboard',
  'workflows',
  'templates',
  'executions',
  'settings',
] as const;

export type ScreenId = (typeof SCREEN_IDS)[number];

/** A single sidebar navigation entry. */
export type NavItem = {
  id: ScreenId;
  label: string;
  /** Lucide icon name, resolved to a component in the sidebar feature. */
  icon: string;
};
