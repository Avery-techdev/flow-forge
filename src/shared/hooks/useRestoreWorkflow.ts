import { useEffect } from 'react';
import { WORKFLOW_TEMPLATES } from '@/shared/constants';
import { loadDraft } from '@/shared/services';
import { useWorkflowStore } from '@/shared/stores';
import { instantiateTemplate } from '@/shared/utils';

/** On mount, restores the autosaved draft, else seeds the first template. */
export function useRestoreWorkflow(): void {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);

  useEffect(() => {
    loadWorkflow(loadDraft() ?? instantiateTemplate(WORKFLOW_TEMPLATES[0]));
  }, [loadWorkflow]);
}
