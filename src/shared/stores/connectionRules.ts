import type { Connection, Edge } from '@xyflow/react';
import { NODE_CATALOG } from '@/shared/constants';
import type { WorkflowEdge, WorkflowNode } from '@/shared/types';

/**
 * Connection validation rules, shared by the store (authoritative) and the
 * canvas (live feedback while dragging). Pure: no store access.
 *
 * A connection is valid when it joins two distinct existing nodes, is not a
 * duplicate, flows out of a non-output node into a non-trigger node, and does
 * not close a cycle.
 */

/** Whether `target` can already reach `source` by following existing edges. */
function createsCycle(
  edges: WorkflowEdge[],
  source: string,
  target: string,
): boolean {
  const stack = [target];
  const seen = new Set<string>();
  while (stack.length > 0) {
    const id = stack.pop() as string;
    if (id === source) return true;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const e of edges) if (e.source === id) stack.push(e.target);
  }
  return false;
}

/** Returns true when `connection` may be added to the graph. */
export function isValidConnection(
  nodes: WorkflowNode[],
  edges: Array<WorkflowEdge | Edge>,
  connection: Connection | Edge,
): boolean {
  const { source, target } = connection;
  if (!source || !target || source === target) return false;

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return false;

  // Triggers start a flow (no input); outputs end it (no output).
  if (NODE_CATALOG[sourceNode.data.type].category === 'output') return false;
  if (NODE_CATALOG[targetNode.data.type].category === 'trigger') return false;

  if (edges.some((e) => e.source === source && e.target === target)) {
    return false;
  }
  return !createsCycle(edges as WorkflowEdge[], source, target);
}
