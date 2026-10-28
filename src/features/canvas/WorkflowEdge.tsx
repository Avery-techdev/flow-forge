import { useWorkflowStore, selectEdgeActivity } from '@/shared/stores';
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

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
      className={activity === 'active' ? 'edge-active' : undefined}
      style={{
        stroke: 'var(--color-accent)',
        strokeWidth: activity === 'active' ? 3 : 2,
        opacity: activity === 'inactive' ? 0.35 : 1,
        transition: 'opacity 150ms, stroke-width 150ms',
      }}
    />
  );
}
