import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

/**
 * Custom workflow edge rendered in the amber accent color. Uses a smooth bezier
 * path; the execution highlight (animated dash) is layered on in Step 9.
 */
export function WorkflowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps): React.JSX.Element {
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
      style={{ stroke: 'var(--color-accent)', strokeWidth: 2 }}
    />
  );
}
