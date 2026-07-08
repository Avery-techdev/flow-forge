import type { NodeTypes } from '@xyflow/react';
import type { WorkflowNodeType } from '@/shared/types';
import { NODE_CATALOG } from '@/shared/constants';
import { WorkflowNodeCard } from './WorkflowNodeCard';

/**
 * React Flow node-type registry. Every domain node type maps to the single
 * generic card component, derived from the catalog so no type is ever missed.
 */
export const nodeTypes: NodeTypes = Object.fromEntries(
  (Object.keys(NODE_CATALOG) as WorkflowNodeType[]).map((type) => [
    type,
    WorkflowNodeCard,
  ]),
);
