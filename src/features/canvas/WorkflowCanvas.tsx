import { useCallback } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WORKFLOW_EDGE_TYPE } from '@/shared/constants';
import { useWorkflowStore } from '@/shared/stores';
import { nodeTypes } from '@/features/nodes';
import { edgeTypes } from './edgeTypes';
import { useCanvasDrop } from './useCanvasDrop';

const DEFAULT_EDGE_OPTIONS = { type: WORKFLOW_EDGE_TYPE } as const;

/**
 * The workflow editing canvas. A controlled React Flow surface bound to the
 * store: nodes, edges and connections all flow through store actions, keeping
 * the store the single source of truth for the graph.
 */
export function WorkflowCanvas(): React.JSX.Element {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const connect = useWorkflowStore((s) => s.connect);
  const { onDragOver, onDrop } = useCanvasDrop();

  const onConnect = useCallback(
    (connection: Connection) => connect(connection),
    [connect],
  );

  return (
    <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        fitView
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
          className="bg-surface!"
          maskColor="rgb(244 244 245 / 0.6)"
        />
      </ReactFlow>
    </div>
  );
}
