import type {
  ExecutionState,
  NodeExecutionState,
  NodeStatus,
} from '@/shared/types';

/**
 * Execution part of the workflow store: the run snapshot plus its state
 * transitions. Orchestration (timing, order) lives in the execution service.
 */
export type ExecutionSlice = {
  executionState: ExecutionState;
  startExecution: (runOrder: string[]) => void;
  markNode: (nodeId: string, status: NodeStatus, error?: string) => void;
  endExecution: (status: ExecutionState['status']) => void;
  resetExecution: () => void;
};

export const INITIAL_EXECUTION_STATE: ExecutionState = {
  status: 'idle',
  runOrder: [],
  nodeStates: {},
};

export const INITIAL_EXECUTION_SLICE: Pick<ExecutionSlice, 'executionState'> = {
  executionState: INITIAL_EXECUTION_STATE,
};

type SetState = (
  partial:
    | Partial<ExecutionSlice>
    | ((state: ExecutionSlice) => Partial<ExecutionSlice>),
) => void;

/** Builds the execution actions, bound to the store's `set`. */
export function createExecutionSlice(
  set: SetState,
): Omit<ExecutionSlice, 'executionState'> {
  return {
    startExecution: (runOrder) => {
      const nodeStates: Record<string, NodeExecutionState> = {};
      for (const nodeId of runOrder) {
        nodeStates[nodeId] = { nodeId, status: 'idle' };
      }
      set({ executionState: { status: 'running', runOrder, nodeStates } });
    },

    markNode: (nodeId, status, error) => {
      set((s) => {
        const previous = s.executionState.nodeStates[nodeId];
        const nextNodeState: NodeExecutionState = {
          nodeId,
          status,
          startedAt: status === 'running' ? Date.now() : previous?.startedAt,
          finishedAt:
            status === 'success' || status === 'error'
              ? Date.now()
              : previous?.finishedAt,
          error,
        };
        return {
          executionState: {
            ...s.executionState,
            nodeStates: {
              ...s.executionState.nodeStates,
              [nodeId]: nextNodeState,
            },
          },
        };
      });
    },

    endExecution: (status) => {
      set((s) => ({ executionState: { ...s.executionState, status } }));
    },

    resetExecution: () => {
      set({ executionState: INITIAL_EXECUTION_STATE });
    },
  };
}
