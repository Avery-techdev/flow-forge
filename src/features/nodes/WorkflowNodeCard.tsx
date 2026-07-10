import { createElement } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '@/shared/types';
import { useWorkflowStore, selectNodeStatus } from '@/shared/stores';
import { useOrientation } from '@/shared/hooks';
import { NODE_CATALOG, CATEGORY_LABELS } from '@/shared/constants';
import { resolveNodeIcon } from './iconMap';
import { CATEGORY_STYLES } from './categoryStyles';
import { StatusBadge } from './StatusBadge';

const HANDLE_CLASS =
  'h-2.5! w-2.5! border-2! border-surface! bg-content-secondary!';

/**
 * Generic, data-driven canvas node. A single component renders every node type
 * using the catalog metadata (icon, category, label), so there is one place to
 * evolve node visuals. Run status is read from the store (single source).
 */
export function WorkflowNodeCard({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>): React.JSX.Element {
  const descriptor = NODE_CATALOG[data.type];
  const category = CATEGORY_STYLES[descriptor.category];
  const icon = createElement(resolveNodeIcon(descriptor.icon), {
    className: 'h-5 w-5',
    'aria-hidden': true,
  });
  const status = useWorkflowStore(selectNodeStatus(id));
  const orientation = useOrientation();

  const hasTarget = descriptor.category !== 'trigger';
  const hasSource = descriptor.category !== 'output';

  // Flow direction: left→right on desktop, top→bottom on mobile.
  const targetPosition =
    orientation === 'vertical' ? Position.Top : Position.Left;
  const sourcePosition =
    orientation === 'vertical' ? Position.Bottom : Position.Right;

  return (
    <div
      role="group"
      aria-label={`${CATEGORY_LABELS[descriptor.category]} node: ${data.config.label}`}
      className={`flex w-56 items-stretch overflow-hidden rounded-lg border bg-surface shadow-sm transition-shadow ${
        selected
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-border hover:shadow-md'
      }`}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={targetPosition}
          className={HANDLE_CLASS}
        />
      )}

      <span
        className={`w-1 shrink-0 ${category.accentClass}`}
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${category.iconClass}`}
        >
          {icon}
        </span>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-content">
            {data.config.label}
          </span>
          <span className="truncate text-xs text-content-secondary">
            {descriptor.label}
          </span>
        </div>

        <StatusBadge status={status} />
      </div>

      {hasSource && (
        <Handle
          type="source"
          position={sourcePosition}
          className={HANDLE_CLASS}
        />
      )}
    </div>
  );
}
