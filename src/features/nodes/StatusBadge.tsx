import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import type { NodeStatus } from '@/shared/types';

/**
 * Presentational run-status badge for a node. Status is never color-only: each
 * state carries text (screen-reader label + visible caption) and the whole
 * badge is announced as a status region.
 */
type StatusBadgeProps = {
  status: NodeStatus;
};

const STATUS_META = {
  running: { text: 'Running', className: 'text-amber-600' },
  success: { text: 'Success', className: 'text-emerald-600' },
  error: { text: 'Error', className: 'text-red-600' },
} as const;

export function StatusBadge({
  status,
}: StatusBadgeProps): React.JSX.Element | null {
  if (status === 'idle') return null;
  const meta = STATUS_META[status];

  return (
    <span
      role="status"
      className={`flex items-center gap-1 text-xs font-medium ${meta.className}`}
    >
      {status === 'running' ? (
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
      ) : status === 'success' ? (
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      ) : (
        <XCircle className="h-3 w-3" aria-hidden="true" />
      )}
      {meta.text}
    </span>
  );
}
