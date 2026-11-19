import { useCallback, useEffect, useState } from 'react';
import type { AsyncState, Workflow } from '@/shared/types';
import { clearDraft, deleteWorkflow, fetchWorkflows } from '@/shared/services';
import { useWorkflowStore } from '@/shared/stores';
import { createEmptyWorkflow } from '@/shared/utils';

/** Return shape of {@link useWorkflows}. */
export type WorkflowsResource = {
  state: AsyncState<Workflow[]>;
  remove: (id: string) => Promise<void>;
};

/** Loads the saved workflows through the mock API (`GET`/`DELETE /workflows`). */
export function useWorkflows(): WorkflowsResource {
  const [state, setState] = useState<AsyncState<Workflow[]>>({
    status: 'loading',
  });

  useEffect(() => {
    let isCancelled = false;
    fetchWorkflows()
      .then((data) => {
        if (!isCancelled) setState({ status: 'success', data });
      })
      .catch(() => {
        if (!isCancelled) {
          setState({ status: 'error', message: 'Could not load workflows.' });
        }
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    await deleteWorkflow(id);
    // Deleting the workflow open in the editor must not let autosave resurrect
    // it, so the editor is reset to a fresh, unsaved workflow.
    const { workflowId, loadWorkflow } = useWorkflowStore.getState();
    if (workflowId === id) {
      clearDraft();
      loadWorkflow(createEmptyWorkflow());
    }
    setState((prev) =>
      prev.status === 'success'
        ? { status: 'success', data: prev.data.filter((w) => w.id !== id) }
        : prev,
    );
  }, []);

  return { state, remove };
}
