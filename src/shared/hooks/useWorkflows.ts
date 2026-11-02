import { useCallback, useEffect, useState } from 'react';
import type { AsyncState, Workflow } from '@/shared/types';
import { deleteWorkflow, fetchWorkflows } from '@/shared/services';

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
    setState((prev) =>
      prev.status === 'success'
        ? { status: 'success', data: prev.data.filter((w) => w.id !== id) }
        : prev,
    );
  }, []);

  return { state, remove };
}
