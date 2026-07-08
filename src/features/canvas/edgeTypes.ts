import type { EdgeTypes } from '@xyflow/react';
import { WORKFLOW_EDGE_TYPE } from '@/shared/constants';
import { WorkflowEdge } from './WorkflowEdge';

/** React Flow edge-type registry mapping the custom edge id to its component. */
export const edgeTypes: EdgeTypes = {
  [WORKFLOW_EDGE_TYPE]: WorkflowEdge,
};
