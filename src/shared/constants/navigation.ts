import type { NavItem } from '@/shared/types';

/** Top-level navigation entries, in display order. */
export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'workflows', label: 'Workflows', icon: 'Workflow' },
  { id: 'templates', label: 'Templates', icon: 'LayoutTemplate' },
  { id: 'executions', label: 'Executions', icon: 'Activity' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];
