// Public API for the shared domain types.
export type { HttpMethod, HeaderPair, AuthType, AuthConfig } from './common';
export { HTTP_METHODS, AUTH_TYPES } from './common';

export type {
  NodeCategory,
  NodeStatus,
  MergeStrategy,
  NodeConfigByType,
  NodeConfig,
  WorkflowNodeType,
  WorkflowNodeData,
  NodeTypeDescriptor,
} from './node';
export { NODE_CATEGORIES, NODE_STATUSES, MERGE_STRATEGIES } from './node';

export type {
  WorkflowNode,
  WorkflowEdge,
  Workflow,
  WorkflowSummary,
} from './workflow';

export type {
  ExecutionStatus,
  NodeExecutionState,
  ExecutionState,
} from './execution';
export { EXECUTION_STATUSES } from './execution';

export type { ScreenId, NavItem } from './navigation';
export { SCREEN_IDS } from './navigation';
