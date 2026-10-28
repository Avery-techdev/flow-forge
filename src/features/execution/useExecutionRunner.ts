import { useCallback } from 'react';
import { selectIsExecuting, useWorkflowStore } from '@/shared/stores';
import { computeRunOrder, simulateExecution } from '@/shared/services';

/** Return shape of the execution runner hook. */
export type ExecutionRunner = {
  run: () => Promise<void>;
  isExecuting: boolean;
  canRun: boolean;
};

/**
 * Drives the mock execution from the toolbar's Run button. It computes the run
 * order and feeds the simulator's progress callbacks straight into the store
 * mutators, so node status drives the badges, the node glow and the active-edge
 * highlight, all derived from the same state transitions.
 */
export function useExecutionRunner(): ExecutionRunner {
  const nodeCount = useWorkflowStore((s) => s.nodes.length);
  const isExecuting = useWorkflowStore(selectIsExecuting);
  const startExecution = useWorkflowStore((s) => s.startExecution);
  const markNode = useWorkflowStore((s) => s.markNode);
  const endExecution = useWorkflowStore((s) => s.endExecution);

  const run = useCallback(async () => {
    const { nodes, edges } = useWorkflowStore.getState();
    if (isExecuting || nodes.length === 0) return;

    const order = computeRunOrder(nodes, edges);
    startExecution(order);
    await simulateExecution(order, {
      onNodeRunning: (id) => markNode(id, 'running'),
      onNodeSuccess: (id) => markNode(id, 'success'),
      onNodeError: (id, error) => markNode(id, 'error', error),
      onComplete: (status) => endExecution(status),
    });
  }, [isExecuting, startExecution, markNode, endExecution]);

  return { run, isExecuting, canRun: nodeCount > 0 };
}
