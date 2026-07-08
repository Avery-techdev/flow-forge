import type { NodeStatus, WorkflowNode } from '@/shared/types';
import type { WorkflowStore } from './workflowStore';

/**
 * Derived-state selectors. Nothing here is persisted in the store; every value
 * is computed from the single source of truth on read.
 */

/**
 * The currently selected node, or `undefined` when none is selected. Selection
 * is owned by React Flow (`node.selected`), so it is derived here rather than
 * stored a second time.
 */
export function selectSelectedNode(
  state: WorkflowStore,
): WorkflowNode | undefined {
  return state.nodes.find((n) => n.selected);
}

/** Curried selector for a node's run status (defaults to `'idle'`). */
export function selectNodeStatus(nodeId: string) {
  return (state: WorkflowStore): NodeStatus =>
    state.executionState.nodeStates[nodeId]?.status ?? 'idle';
}

export function selectCanUndo(state: WorkflowStore): boolean {
  return state.past.length > 0;
}

export function selectCanRedo(state: WorkflowStore): boolean {
  return state.future.length > 0;
}

export function selectIsExecuting(state: WorkflowStore): boolean {
  return state.executionState.status === 'running';
}
