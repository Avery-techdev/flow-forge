import { create } from 'zustand';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import type {
  ExecutionState,
  NodeConfig,
  NodeExecutionState,
  NodeStatus,
  Workflow,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
} from '@/shared/types';
import { createNodeData, WORKFLOW_EDGE_TYPE } from '@/shared/constants';
import { pushSnapshot, type WorkflowSnapshot } from './history';

const DEFAULT_WORKFLOW_NAME = 'Untitled Workflow';

const INITIAL_EXECUTION_STATE: ExecutionState = {
  status: 'idle',
  currentNodeId: null,
  runOrder: [],
  nodeStates: {},
};

/** Editable graph state plus execution and history. */
type WorkflowState = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  executionState: ExecutionState;
  past: WorkflowSnapshot[];
  future: WorkflowSnapshot[];
};

type WorkflowActions = {
  // React Flow controlled handlers (transient, not tracked in history).
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void;

  // Structural edits (tracked in history).
  addNode: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  updateNodeConfig: (id: string, patch: Partial<NodeConfig>) => void;
  connect: (connection: Connection) => void;
  disconnect: (edgeId: string) => void;

  // Meta. Selection is owned by React Flow (node.selected), not duplicated here.
  clearSelection: () => void;
  setWorkflowName: (name: string) => void;
  loadWorkflow: (workflow: Workflow) => void;

  // History.
  undo: () => void;
  redo: () => void;

  // Execution state transitions (orchestration lives in the execution service).
  startExecution: (runOrder: string[]) => void;
  markNode: (nodeId: string, status: NodeStatus, error?: string) => void;
  endExecution: (status: ExecutionState['status']) => void;
  resetExecution: () => void;
};

export type WorkflowStore = WorkflowState & WorkflowActions;

/** Snapshots the current structural state for the undo stack. */
function snapshotOf(state: WorkflowState): WorkflowSnapshot {
  return {
    nodes: state.nodes,
    edges: state.edges,
    workflowName: state.workflowName,
  };
}

/** Rejects self-loops and duplicate connections (full validation in canvas). */
function isValidConnection(
  edges: WorkflowEdge[],
  connection: Connection,
): boolean {
  const { source, target } = connection;
  if (!source || !target || source === target) return false;
  return !edges.some((e) => e.source === source && e.target === target);
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  workflowName: DEFAULT_WORKFLOW_NAME,
  executionState: INITIAL_EXECUTION_STATE,
  past: [],
  future: [],

  onNodesChange: (changes) => {
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) }));
  },

  onEdgesChange: (changes) => {
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) }));
  },

  addNode: (type, position) => {
    set((s) => {
      const node: WorkflowNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: createNodeData(type),
      };
      return {
        past: pushSnapshot(s.past, snapshotOf(s)),
        future: [],
        nodes: [...s.nodes, node],
      };
    });
  },

  removeNode: (id) => {
    set((s) => ({
      past: pushSnapshot(s.past, snapshotOf(s)),
      future: [],
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    }));
  },

  // Live per-field edit from the properties form. Transient like node dragging:
  // it does NOT push history, otherwise every keystroke would be an undo step.
  // History tracks graph structure (add/remove/connect/disconnect), not content.
  updateNodeConfig: (id, patch) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id
          ? // Shallow-merge into the node's config. The patch is validated by
            // the (per-type) properties form, so this narrowing is safe.
            ({
              ...n,
              data: { ...n.data, config: { ...n.data.config, ...patch } },
            } as WorkflowNode)
          : n,
      ),
    }));
  },

  connect: (connection) => {
    set((s) => {
      if (!isValidConnection(s.edges, connection)) return {};
      return {
        past: pushSnapshot(s.past, snapshotOf(s)),
        future: [],
        edges: addEdge({ ...connection, type: WORKFLOW_EDGE_TYPE }, s.edges),
      };
    });
  },

  disconnect: (edgeId) => {
    set((s) => ({
      past: pushSnapshot(s.past, snapshotOf(s)),
      future: [],
      edges: s.edges.filter((e) => e.id !== edgeId),
    }));
  },

  clearSelection: () => {
    set((s) => ({
      nodes: s.nodes.some((n) => n.selected)
        ? s.nodes.map((n) => (n.selected ? { ...n, selected: false } : n))
        : s.nodes,
    }));
  },

  setWorkflowName: (name) => {
    set((s) => ({
      past: pushSnapshot(s.past, snapshotOf(s)),
      future: [],
      workflowName: name,
    }));
  },

  loadWorkflow: (workflow) => {
    set({
      nodes: workflow.nodes,
      edges: workflow.edges,
      workflowName: workflow.name,
      executionState: INITIAL_EXECUTION_STATE,
      past: [],
      future: [],
    });
  },

  undo: () => {
    const { past } = get();
    if (past.length === 0) return;
    set((s) => {
      const previous = s.past[s.past.length - 1];
      return {
        past: s.past.slice(0, -1),
        future: [snapshotOf(s), ...s.future],
        nodes: previous.nodes,
        edges: previous.edges,
        workflowName: previous.workflowName,
      };
    });
  },

  redo: () => {
    const { future } = get();
    if (future.length === 0) return;
    set((s) => {
      const next = s.future[0];
      return {
        past: [...s.past, snapshotOf(s)],
        future: s.future.slice(1),
        nodes: next.nodes,
        edges: next.edges,
        workflowName: next.workflowName,
      };
    });
  },

  startExecution: (runOrder) => {
    const nodeStates: Record<string, NodeExecutionState> = {};
    for (const nodeId of runOrder) {
      nodeStates[nodeId] = { nodeId, status: 'idle' };
    }
    set({
      executionState: {
        status: 'running',
        currentNodeId: null,
        runOrder,
        nodeStates,
      },
    });
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
          currentNodeId:
            status === 'running' ? nodeId : s.executionState.currentNodeId,
          nodeStates: {
            ...s.executionState.nodeStates,
            [nodeId]: nextNodeState,
          },
        },
      };
    });
  },

  endExecution: (status) => {
    set((s) => ({
      executionState: { ...s.executionState, status, currentNodeId: null },
    }));
  },

  resetExecution: () => {
    set({ executionState: INITIAL_EXECUTION_STATE });
  },
}));
