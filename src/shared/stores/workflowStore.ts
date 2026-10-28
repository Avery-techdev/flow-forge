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
import { isValidConnection } from './connectionRules';

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
  // Live name write (no history). Pair with `pushHistory` at edit start so a
  // rename is a single undo step, not one per keystroke.
  setWorkflowName: (name: string) => void;
  pushHistory: () => void;
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

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  workflowName: DEFAULT_WORKFLOW_NAME,
  executionState: INITIAL_EXECUTION_STATE,
  past: [],
  future: [],

  // Keyboard deletion arrives here as `remove` changes. It is recorded as one
  // undo step, and the node's edges go with it so a single delete is a single
  // step (React Flow's follow-up edge removals then match nothing).
  onNodesChange: (changes) => {
    set((s) => {
      const removed = new Set(
        changes.flatMap((c) => (c.type === 'remove' ? [c.id] : [])),
      );
      const nodes = applyNodeChanges(changes, s.nodes);
      if (removed.size === 0) return { nodes };
      return {
        past: pushSnapshot(s.past, snapshotOf(s)),
        future: [],
        nodes,
        edges: s.edges.filter(
          (e) => !removed.has(e.source) && !removed.has(e.target),
        ),
      };
    });
  },

  onEdgesChange: (changes) => {
    set((s) => {
      const edges = applyEdgeChanges(changes, s.edges);
      if (edges.length === s.edges.length) return { edges };
      return {
        past: pushSnapshot(s.past, snapshotOf(s)),
        future: [],
        edges,
      };
    });
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
      if (!isValidConnection(s.nodes, s.edges, connection)) return {};
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
    set({ workflowName: name });
  },

  pushHistory: () => {
    set((s) => ({
      past: pushSnapshot(s.past, snapshotOf(s)),
      future: [],
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
