import { useCallback } from 'react';
import type { Workflow } from '@/shared/types';
import { upsertWorkflow } from '@/shared/services';
import { useUiStore, useWorkflowStore } from '@/shared/stores';
import { createEmptyWorkflow, instantiateTemplate } from '@/shared/utils';

/** Actions that load a workflow into the editor and switch to it. */
export type WorkflowActions = {
  openWorkflow: (workflow: Workflow) => void;
  createWorkflow: () => void;
  fromTemplate: (template: Workflow) => void;
};

export function useWorkflowActions(): WorkflowActions {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const setScreen = useUiStore((s) => s.setScreen);

  const openWorkflow = useCallback(
    (workflow: Workflow) => {
      loadWorkflow(workflow);
      setScreen('editor');
    },
    [loadWorkflow, setScreen],
  );

  // New workflows are persisted immediately so they show up in the list.
  const openNew = useCallback(
    (workflow: Workflow) => {
      upsertWorkflow(workflow);
      openWorkflow(workflow);
    },
    [openWorkflow],
  );

  const createWorkflow = useCallback(
    () => openNew(createEmptyWorkflow()),
    [openNew],
  );

  const fromTemplate = useCallback(
    (template: Workflow) => openNew(instantiateTemplate(template)),
    [openNew],
  );

  return { openWorkflow, createWorkflow, fromTemplate };
}
