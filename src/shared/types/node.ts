import type { AuthConfig, HeaderPair, HttpMethod } from './common';

/**
 * Node domain model.
 *
 * The `NodeConfigByType` map is the single source of truth: every other
 * node-related type (the `WorkflowNodeType` union, the correlated node data,
 * the catalog record) is derived from it, so adding a node type in one place
 * keeps the whole model consistent.
 */

export const NODE_CATEGORIES = [
  'trigger',
  'logic',
  'api',
  'data',
  'output',
] as const;
export type NodeCategory = (typeof NODE_CATEGORIES)[number];

export const NODE_STATUSES = ['idle', 'running', 'success', 'error'] as const;
/** Per-node execution status used for the run simulator and status badges. */
export type NodeStatus = (typeof NODE_STATUSES)[number];

export const MERGE_STRATEGIES = ['append', 'combine'] as const;
export type MergeStrategy = (typeof MERGE_STRATEGIES)[number];

/** Fields every node exposes in the properties panel. */
type BaseNodeConfig = {
  label: string;
  description: string;
};

// --- Type-specific configuration payloads ------------------------------------

type ManualTriggerConfig = BaseNodeConfig;
type ScheduleTriggerConfig = BaseNodeConfig & {
  cron: string;
  timezone: string;
};
type WebhookTriggerConfig = BaseNodeConfig & {
  method: HttpMethod;
  path: string;
};

type IfConfig = BaseNodeConfig & { condition: string };
type SwitchConfig = BaseNodeConfig & { expression: string; cases: string[] };
type DelayConfig = BaseNodeConfig & { durationMs: number };
type MergeConfig = BaseNodeConfig & { strategy: MergeStrategy };

type HttpRequestConfig = BaseNodeConfig & {
  url: string;
  method: HttpMethod;
  headers: HeaderPair[];
  authentication: AuthConfig;
  retry: number;
  timeoutMs: number;
};
type GraphqlConfig = BaseNodeConfig & {
  endpoint: string;
  query: string;
  headers: HeaderPair[];
  authentication: AuthConfig;
  timeoutMs: number;
};

type JsonTransformConfig = BaseNodeConfig & { expression: string };
type FilterConfig = BaseNodeConfig & { condition: string };

type EmailConfig = BaseNodeConfig & {
  to: string;
  subject: string;
  body: string;
};
type SlackConfig = BaseNodeConfig & { channel: string; message: string };
type DiscordConfig = BaseNodeConfig & { webhookUrl: string; message: string };
type NotificationConfig = BaseNodeConfig & { title: string; message: string };

/**
 * Maps each node type to its fully typed configuration. This doubles as the
 * "properties schema" that the Step 7 form layer validates against.
 */
export type NodeConfigByType = {
  'manual-trigger': ManualTriggerConfig;
  'schedule-trigger': ScheduleTriggerConfig;
  'webhook-trigger': WebhookTriggerConfig;
  'if-condition': IfConfig;
  switch: SwitchConfig;
  delay: DelayConfig;
  merge: MergeConfig;
  'http-request': HttpRequestConfig;
  graphql: GraphqlConfig;
  'json-transform': JsonTransformConfig;
  filter: FilterConfig;
  email: EmailConfig;
  slack: SlackConfig;
  discord: DiscordConfig;
  notification: NotificationConfig;
};

/** Union of all supported node type identifiers. */
export type WorkflowNodeType = keyof NodeConfigByType;

/** Configuration for a specific node type. */
export type NodeConfig<T extends WorkflowNodeType = WorkflowNodeType> =
  NodeConfigByType[T];

/**
 * Data payload carried by a React Flow node. Distributing over the union keeps
 * `type` and `config` correlated: a `'http-request'` node can only hold an
 * `HttpRequestConfig`.
 */
export type WorkflowNodeData = {
  [T in WorkflowNodeType]: {
    type: T;
    config: NodeConfigByType[T];
    status: NodeStatus;
  };
}[WorkflowNodeType];

/** Static metadata describing a node type in the sidebar library. */
export type NodeTypeDescriptor = {
  type: WorkflowNodeType;
  category: NodeCategory;
  label: string;
  description: string;
  /** Lucide icon name, resolved to a component in the nodes feature. */
  icon: string;
};
