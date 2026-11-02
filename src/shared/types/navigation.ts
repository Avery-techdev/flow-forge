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

/** Navigable screens plus the editor, which is opened from them (not a nav item). */
export type NavScreenId = (typeof SCREEN_IDS)[number];
export type ScreenId = NavScreenId | 'editor';

/** A single sidebar navigation entry. */
export type NavItem = {
  id: NavScreenId;
  label: string;
  /** Lucide icon name, resolved to a component in the sidebar feature. */
  icon: string;
};
