import type { WorkflowEdge, WorkflowNode } from '@/shared/types';

/**
 * Undo/redo history helpers. A snapshot captures only the structural graph
 * state (nodes, edges, name) — never derived or execution state.
 */

/** Immutable snapshot of the editable workflow graph. */
export type WorkflowSnapshot = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
};

/** Maximum number of undo steps retained. */
const HISTORY_LIMIT = 50;

/** Appends a snapshot to the undo stack, capping it at `HISTORY_LIMIT`. */
export function pushSnapshot(
  past: WorkflowSnapshot[],
  snapshot: WorkflowSnapshot,
): WorkflowSnapshot[] {
  const next = [...past, snapshot];
  return next.length > HISTORY_LIMIT ? next.slice(-HISTORY_LIMIT) : next;
}
