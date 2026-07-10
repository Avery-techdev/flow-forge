import type { NodeChange } from '@xyflow/react';
import type { WorkflowNode } from '@/shared/types';

/**
 * Vertical (mobile) orientation is a transposed view of the canonical
 * horizontal layout: swapping x/y turns a left→right flow into a top→bottom
 * one. Transposing is its own inverse, so the same helper maps display
 * positions back to canonical ones when the user drags.
 */

type Point = { x: number; y: number };

export function transposePoint(point: Point): Point {
  return { x: point.y, y: point.x };
}

/** Returns a node with its position transposed (for display). */
export function transposeNode(node: WorkflowNode): WorkflowNode {
  return { ...node, position: transposePoint(node.position) };
}

/**
 * Maps a React Flow change from display space back to canonical space by
 * transposing any position it carries. Non-position changes pass through.
 */
export function transposeChange(
  change: NodeChange<WorkflowNode>,
): NodeChange<WorkflowNode> {
  if (change.type === 'position' && change.position) {
    return { ...change, position: transposePoint(change.position) };
  }
  return change;
}
