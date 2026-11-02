import { useCallback, useEffect, useRef, useState } from 'react';
import type { SaveStatus, Workflow } from '@/shared/types';
import { useWorkflowStore } from '@/shared/stores';
import { saveDraft, upsertWorkflow } from '@/shared/services';

const AUTOSAVE_DELAY_MS = 3000;

/** Public surface of the autosave hook. */
export type Autosave = {
  status: SaveStatus;
  /** Persists the current draft immediately (Save button). */
  saveNow: () => void;
};

/** Builds a persistable snapshot from the current store state. */
function draftFromStore(): Workflow {
  const { workflowId, workflowName, nodes, edges } =
    useWorkflowStore.getState();
  const now = new Date().toISOString();
  return {
    id: workflowId,
    name: workflowName,
    nodes,
    edges,
    createdAt: now,
    updatedAt: now,
  };
}

/** Writes the draft and mirrors it into the saved-workflows collection. */
function persistNow(): void {
  const draft = draftFromStore();
  saveDraft(draft);
  upsertWorkflow(draft);
}

/**
 * Debounced localStorage autosave. Whenever the graph or name changes it marks
 * the state `saving`, then persists a draft after 3 s of quiet and flips to
 * `saved`. `saveNow` bypasses the debounce for the manual Save button.
 */
export function useAutosave(): Autosave {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const workflowName = useWorkflowStore((s) => s.workflowName);

  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRun = useRef(true);
  const hasPendingRef = useRef(false);

  const persist = useCallback(() => {
    persistNow();
    hasPendingRef.current = false;
    setStatus('saved');
  }, []);

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    persist();
  }, [persist]);

  useEffect(() => {
    // Skip the initial mount so a freshly loaded workflow is not "saving".
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setStatus('saving');
    hasPendingRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(persist, AUTOSAVE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, workflowName, persist]);

  // The toolbar unmounts when leaving the editor; flush a pending debounce so
  // the last edits within the 3 s window are not lost.
  useEffect(
    () => () => {
      if (hasPendingRef.current) persistNow();
    },
    [],
  );

  return { status, saveNow };
}
