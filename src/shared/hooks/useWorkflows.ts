import { useCallback, useEffect, useState } from 'react';
import type { Workflow } from '@/shared/types';
import { deleteWorkflow, fetchWorkflows } from '@/shared/services';

/** Return shape of {@link useWorkflows}. */
export type WorkflowsResource = {
  workflows: Workflow[];
  isLoading: boolean;
  error: string | null;
  remove: (id: string) => Promise<void>;
};

/** Loads the saved workflows through the mock API (`GET`/`DELETE /workflows`). */
export function useWorkflows(): WorkflowsResource {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchWorkflows()
      .then((loaded) => {
        if (!cancelled) setWorkflows(loaded);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load workflows.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteWorkflow(id);
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return { workflows, isLoading, error, remove };
}
