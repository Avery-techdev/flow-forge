import type { ExecutionRecord } from '@/shared/types';
import { RunStatusPill } from '@/shared/components';
import { formatDateTime, formatDuration } from '@/shared/utils';

/** Run history rows, shared by the Executions screen and the dashboard. */
export function ExecutionList({
  executions,
}: {
  executions: ExecutionRecord[];
}): React.JSX.Element {
  if (executions.length === 0) {
    return (
      <p className="text-sm text-content-secondary">
        No executions yet. Open a workflow and press Run.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {executions.map((run) => (
        <li
          key={run.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-content">
              {run.workflowName}
            </span>
            <span className="block text-xs text-content-secondary">
              {formatDateTime(run.startedAt)} · {run.nodeCount} nodes ·{' '}
              {formatDuration(run.durationMs)}
            </span>
          </div>
          <RunStatusPill status={run.status} />
        </li>
      ))}
    </ul>
  );
}
