import {
  useWorkflowStore,
  selectEdgeActivity,
  type EdgeActivity,
} from '@/shared/stores';
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

const EDGE_CLASS: Record<EdgeActivity, string> = {
  idle: 'stroke-accent stroke-2 transition-[opacity,stroke-width]',
  inactive:
    'stroke-accent stroke-2 opacity-35 transition-[opacity,stroke-width]',
  active:
    'edge-active stroke-accent stroke-3 transition-[opacity,stroke-width]',
};

/**
 * Custom workflow edge rendered in the amber accent color. Uses a smooth bezier
 * path. While a run is in progress the edge into the running node is
 * highlighted with a flowing dash and glow; the other edges dim.
 */
export function WorkflowEdge({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps): React.JSX.Element {
  const activity = useWorkflowStore(selectEdgeActivity(source, target));
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <BaseEdge
      path={path}
      markerEnd={markerEnd}
      className={EDGE_CLASS[activity]}
    />
  );
}
