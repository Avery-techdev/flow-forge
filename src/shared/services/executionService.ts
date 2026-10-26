import type { WorkflowEdge, WorkflowNode } from '@/shared/types';
import { randomDelay } from './timing';

/**
 * Execution simulator engine. Kept decoupled from the store: it computes a run
 * order and drives it node-by-node, reporting progress through injected
 * handlers. The Step 9 hook wires these handlers to the store mutators.
 */

const NODE_MIN_DELAY_MS = 300;
const NODE_MAX_DELAY_MS = 500;

/** Progress callbacks invoked as the simulated run advances. */
export type ExecutionHandlers = {
  onNodeRunning: (nodeId: string) => void;
  onNodeSuccess: (nodeId: string) => void;
  onNodeError: (nodeId: string, error: string) => void;
  onComplete: (status: 'success' | 'error') => void;
};

/** Options for tuning simulated node timing (defaults to 300–500 ms). */
export type ExecutionOptions = {
  minDelayMs?: number;
  maxDelayMs?: number;
  signal?: AbortSignal;
};

/**
 * Computes the order nodes are visited: breadth-first from the trigger roots
 * (nodes without an incoming edge), following the edges. Any nodes not reached
 * from a root are appended so every node still runs.
 */
export function computeRunOrder(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): string[] {
  const outgoing = new Map<string, string[]>();
  const hasIncoming = new Set<string>();
  const connected = new Set<string>();
  for (const node of nodes) outgoing.set(node.id, []);
  for (const edge of edges) {
    outgoing.get(edge.source)?.push(edge.target);
    hasIncoming.add(edge.target);
    connected.add(edge.source);
    connected.add(edge.target);
  }

  // Roots are the trigger points of the flow: connected nodes with no incoming
  // edge. Isolated nodes (no edges at all) are intentionally excluded — they
  // are not part of the workflow and must not be executed.
  const roots = nodes.filter(
    (n) => connected.has(n.id) && !hasIncoming.has(n.id),
  );
  const queue = roots.map((n) => n.id);
  const visited = new Set<string>();
  const order: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift() as string;
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    for (const next of outgoing.get(id) ?? []) {
      if (!visited.has(next)) queue.push(next);
    }
  }

  // Append connected-but-unreached nodes (e.g. cycles without a clear root) so
  // every wired node still runs. Isolated nodes stay excluded.
  for (const node of nodes) {
    if (connected.has(node.id) && !visited.has(node.id)) order.push(node.id);
  }
  return order;
}

/**
 * Runs the simulated execution, awaiting a short delay per node. Every node
 * succeeds in this mock; the error path is exposed via handlers for future use.
 * Resolves when the run completes or is aborted via `options.signal`.
 */
export async function simulateExecution(
  order: string[],
  handlers: ExecutionHandlers,
  options: ExecutionOptions = {},
): Promise<void> {
  const {
    minDelayMs = NODE_MIN_DELAY_MS,
    maxDelayMs = NODE_MAX_DELAY_MS,
    signal,
  } = options;

  for (const nodeId of order) {
    if (signal?.aborted) return;
    handlers.onNodeRunning(nodeId);
    await randomDelay(minDelayMs, maxDelayMs);
    if (signal?.aborted) return;
    handlers.onNodeSuccess(nodeId);
  }
  handlers.onComplete('success');
}
