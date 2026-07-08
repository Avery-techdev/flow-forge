import type { Edge, Node } from '@xyflow/react';
import type { WorkflowNodeData, WorkflowNodeType } from './node';

/**
 * Workflow domain model. Nodes and edges reuse React Flow's generic `Node` /
 * `Edge` types so the canvas layer can consume them without any mapping, while
 * the payload (`WorkflowNodeData`) stays domain-owned.
 */

/** A positioned node on the canvas, typed by our node data + type registry. */
export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;

/** A connection between two nodes (React Flow edge). */
export type WorkflowEdge = Edge;

/** A complete, persistable workflow. */
export type Workflow = {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
};

/** Lightweight workflow listing used by dashboards and the workflows screen. */
export type WorkflowSummary = Pick<Workflow, 'id' | 'name' | 'updatedAt'> & {
  nodeCount: number;
};
