import {
  Activity,
  Circle,
  LayoutDashboard,
  LayoutTemplate,
  Settings,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/** Resolves navigation icon names from `NAV_ITEMS` to Lucide components. */
const NAV_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Workflow,
  LayoutTemplate,
  Activity,
  Settings,
};

export function resolveNavIcon(iconName: string): LucideIcon {
  return NAV_ICONS[iconName] ?? Circle;
}
