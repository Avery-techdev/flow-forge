import { useCallback, useEffect, useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  useUpdateNodeInternals,
  type Connection,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WORKFLOW_EDGE_TYPE } from '@/shared/constants';
import { useWorkflowStore } from '@/shared/stores';
import { useOrientation } from '@/shared/hooks';
import type { WorkflowNode } from '@/shared/types';
import { nodeTypes } from '@/features/nodes';
import { edgeTypes } from './edgeTypes';
import { useCanvasDrop } from './useCanvasDrop';
import { transposeChange, transposeNode } from './orientation';

const DEFAULT_EDGE_OPTIONS = { type: WORKFLOW_EDGE_TYPE } as const;

/**
 * The workflow editing canvas. A controlled React Flow surface bound to the
 * store: nodes, edges and connections all flow through store actions, keeping
 * the store the single source of truth for the graph.
 *
 * On mobile the flow is shown vertically: node positions are transposed for
 * display and drag changes are transposed back, so the store stays canonical.
 */
export function WorkflowCanvas(): React.JSX.Element {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const storeOnNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const connect = useWorkflowStore((s) => s.connect);
  const { onDragOver, onDrop } = useCanvasDrop();
  const orientation = useOrientation();
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const isVertical = orientation === 'vertical';

  const displayNodes = useMemo(
    () => (isVertical ? nodes.map(transposeNode) : nodes),
    [isVertical, nodes],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<WorkflowNode>[]) => {
      storeOnNodesChange(isVertical ? changes.map(transposeChange) : changes);
    },
    [isVertical, storeOnNodesChange],
  );

  const onConnect = useCallback(
    (connection: Connection) => connect(connection),
    [connect],
  );

  // When the orientation flips, the nodes' handle positions change (Left/Right
  // ↔ Top/Bottom). React Flow caches handle bounds, so it must be told to
  // re-measure them — otherwise edges keep routing to the previous sides.
  // Then refit so the transposed layout is framed.
  useEffect(() => {
    const ids = useWorkflowStore.getState().nodes.map((n) => n.id);
    updateNodeInternals(ids);
    const id = window.setTimeout(() => void fitView({ duration: 200 }), 0);
    return () => window.clearTimeout(id);
  }, [isVertical, updateNodeInternals, fitView]);

  return (
    <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        fitView
        minZoom={0.2}
        selectNodesOnDrag={false}
        proOptions={{ hideAttribution: true }}
        className="bg-surface-canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--color-border)"
        />
        <Controls className="border-border! bg-surface!" />
        <MiniMap
          pannable
          zoomable
          position={isVertical ? 'top-right' : 'bottom-right'}
          className="bg-surface!"
          maskColor="rgb(244 244 245 / 0.6)"
          style={isVertical ? { width: 96, height: 72 } : undefined}
        />
      </ReactFlow>
    </div>
  );
}
