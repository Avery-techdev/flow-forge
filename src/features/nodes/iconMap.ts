import {
  Bell,
  Braces,
  Circle,
  Clock,
  FileJson,
  Filter,
  GitBranch,
  Globe,
  Hash,
  Mail,
  Merge,
  MessageCircle,
  MousePointerClick,
  Split,
  Timer,
  Webhook,
  type LucideIcon,
} from 'lucide-react';

/**
 * Resolves the icon names stored in `NODE_CATALOG` to Lucide components. A
 * single registry keeps the catalog free of component imports.
 */
const ICONS: Record<string, LucideIcon> = {
  MousePointerClick,
  Clock,
  Webhook,
  GitBranch,
  Split,
  Timer,
  Merge,
  Globe,
  Braces,
  FileJson,
  Filter,
  Mail,
  Hash,
  MessageCircle,
  Bell,
};

/** Returns the icon component for a catalog icon name, or a neutral fallback. */
export function resolveNodeIcon(iconName: string): LucideIcon {
  return ICONS[iconName] ?? Circle;
}
