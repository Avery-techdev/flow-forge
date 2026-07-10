import { createElement } from 'react';
import { X } from 'lucide-react';
import { NODE_CATALOG, CATEGORY_LABELS } from '@/shared/constants';
import { selectSelectedNode, useWorkflowStore } from '@/shared/stores';
import { useFocusTrap, useMediaQuery } from '@/shared/hooks';
import { resolveNodeIcon } from '@/features/nodes';
import { PropertiesForm } from './PropertiesForm';

/**
 * The properties panel. Appears only when a node is selected: a fixed right
 * column on desktop, an accessible drawer overlay on mobile. Closing it clears
 * the node selection (which is owned by React Flow via `node.selected`).
 */
export function PropertiesPanel(): React.JSX.Element | null {
  const node = useWorkflowStore(selectSelectedNode);
  const clearSelection = useWorkflowStore((s) => s.clearSelection);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const drawerRef = useFocusTrap<HTMLDivElement>(
    Boolean(node) && isMobile,
    clearSelection,
  );

  if (!node) return null;

  const descriptor = NODE_CATALOG[node.data.type];
  const icon = createElement(resolveNodeIcon(descriptor.icon), {
    className: 'h-4 w-4 text-primary',
    'aria-hidden': true,
  });

  const header = (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <span className="flex items-center gap-2">
        {icon}
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-content">
            {descriptor.label}
          </span>
          <span className="text-xs text-content-secondary">
            {CATEGORY_LABELS[descriptor.category]}
          </span>
        </span>
      </span>
      <button
        type="button"
        onClick={clearSelection}
        aria-label="Close properties"
        className="rounded-md p-1 text-content-secondary hover:bg-background hover:text-content"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );

  const body = (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      {header}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Remount per node so form state matches the selection. */}
        <PropertiesForm key={node.id} node={node} />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={clearSelection}
          aria-hidden="true"
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${descriptor.label} properties`}
          className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-xl border-t border-border shadow-xl"
        >
          {body}
        </div>
      </div>
    );
  }

  return <aside className="w-80 shrink-0 border-l border-border">{body}</aside>;
}
