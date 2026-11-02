import { useState } from 'react';
import { Plus } from 'lucide-react';
import { loadExecutions } from '@/shared/services';
import { useWorkflowActions, useWorkflows } from '@/shared/hooks';
import { useUiStore } from '@/shared/stores';
import {
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  Screen,
  ScreenHeader,
} from '@/shared/components';
import { ExecutionList } from '@/features/executions';

const RECENT_RUNS = 5;

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-content-secondary">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-content">{value}</dd>
    </div>
  );
}

export function DashboardScreen(): React.JSX.Element {
  const { workflows } = useWorkflows();
  const [executions] = useState(loadExecutions);
  const { createWorkflow } = useWorkflowActions();
  const setScreen = useUiStore((s) => s.setScreen);

  const successCount = executions.filter((e) => e.status === 'success').length;
  const successRate =
    executions.length === 0
      ? '–'
      : `${Math.round((successCount / executions.length) * 100)}%`;

  return (
    <>
      <ScreenHeader
        title="Dashboard"
        description="An overview of your automations."
        actions={
          <button
            type="button"
            onClick={createWorkflow}
            className={PRIMARY_BUTTON_CLASS}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New workflow
          </button>
        }
      />
      <Screen>
        <dl className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Workflows" value={String(workflows.length)} />
          <StatCard label="Executions" value={String(executions.length)} />
          <StatCard label="Success rate" value={successRate} />
        </dl>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-content">Recent runs</h2>
          <button
            type="button"
            onClick={() => setScreen('templates')}
            className={SECONDARY_BUTTON_CLASS}
          >
            Browse templates
          </button>
        </div>
        <div className="mt-3">
          <ExecutionList executions={executions.slice(0, RECENT_RUNS)} />
        </div>
      </Screen>
    </>
  );
}
