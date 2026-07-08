import type { NodeStatus } from './node';

/**
 * Execution simulator model. `ExecutionState` is a pure snapshot: per-node
 * status is derived here rather than duplicated onto the canvas nodes, keeping
 * a single source of truth for run progress.
 */

export const EXECUTION_STATUSES = [
  'idle',
  'running',
  'success',
  'error',
] as const;
/** Overall status of a workflow run. */
export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

/** Run state for one node during an execution. */
export type NodeExecutionState = {
  nodeId: string;
  status: NodeStatus;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
};

/** Snapshot of a single workflow execution. */
export type ExecutionState = {
  status: ExecutionStatus;
  /** Node currently being simulated, or `null` when idle/finished. */
  currentNodeId: string | null;
  /** Order in which nodes are visited, derived from the edges. */
  runOrder: string[];
  /** Per-node run state, keyed by node id. */
  nodeStates: Record<string, NodeExecutionState>;
};
