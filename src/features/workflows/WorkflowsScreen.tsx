import { Plus, Trash2 } from 'lucide-react';
import { useWorkflowActions, useWorkflows } from '@/shared/hooks';
import {
  PRIMARY_BUTTON_CLASS,
  Screen,
  ScreenHeader,
} from '@/shared/components';
import { formatDateTime } from '@/shared/utils';

export function WorkflowsScreen(): React.JSX.Element {
  const { state, remove } = useWorkflows();
  const { openWorkflow, createWorkflow } = useWorkflowActions();

  return (
    <>
      <ScreenHeader
        title="Workflows"
        description="Your saved workflows."
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
        {state.status === 'loading' ? (
          <p role="status" className="text-sm text-content-secondary">
            Loading workflows…
          </p>
        ) : state.status === 'error' ? (
          <p role="alert" className="text-sm text-red-600">
            {state.message}
          </p>
        ) : state.data.length === 0 ? (
          <p className="text-sm text-content-secondary">
            No workflows yet. Create one or start from a template.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {state.data.map((workflow) => (
              <li
                key={workflow.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => openWorkflow(workflow)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm font-semibold text-content">
                    {workflow.name}
                  </span>
                  <span className="block text-xs text-content-secondary">
                    {workflow.nodes.length} nodes · Updated{' '}
                    {formatDateTime(workflow.updatedAt)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void remove(workflow.id)}
                  aria-label={`Delete ${workflow.name}`}
                  className="rounded-md p-1.5 text-content-secondary hover:bg-background hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Screen>
    </>
  );
}
