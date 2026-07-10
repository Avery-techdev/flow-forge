import { Workflow, X } from 'lucide-react';
import { useUiStore } from '@/shared/stores';
import { SidebarNav } from './SidebarNav';
import { NodeLibrary } from './NodeLibrary';
import { useFocusTrap } from './useFocusTrap';

/** Brand header + navigation + node library — shared by both layouts. */
function SidebarContent({
  onClose,
}: {
  onClose?: () => void;
}): React.JSX.Element {
  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
            <Workflow className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold text-content">
            FlowForge
          </span>
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md p-1 text-content-secondary hover:bg-background hover:text-content"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <SidebarNav />

      <div className="mx-3 border-t border-border" />

      <h2 className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-content-secondary">
        Nodes
      </h2>
      <NodeLibrary />
    </div>
  );
}

/**
 * Application sidebar. On desktop it is a static left column; on small screens
 * it becomes an accessible slide-in drawer (dialog semantics, focus trap,
 * Escape + backdrop to close).
 */
export function Sidebar(): React.JSX.Element {
  const isOpen = useUiStore((s) => s.isSidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const drawerRef = useFocusTrap<HTMLDivElement>(isOpen, closeSidebar);

  return (
    <>
      {/* Desktop: static column */}
      <aside className="hidden w-72 shrink-0 border-r border-border md:block">
        <SidebarContent />
      </aside>

      {/* Mobile: drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            className="absolute left-0 top-0 h-full w-72 border-r border-border shadow-xl"
          >
            <SidebarContent onClose={closeSidebar} />
          </div>
        </div>
      )}
    </>
  );
}
