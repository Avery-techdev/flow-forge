import type {
  NodeConfigByType,
  NodeTypeDescriptor,
  WorkflowNodeData,
  WorkflowNodeType,
} from '@/shared/types';

/**
 * Static node library. `NODE_CATALOG` is typed as a full record over
 * `WorkflowNodeType`, so forgetting to describe a newly added node type is a
 * compile error rather than a silent gap in the sidebar.
 */
export const NODE_CATALOG: Record<WorkflowNodeType, NodeTypeDescriptor> = {
  'manual-trigger': {
    type: 'manual-trigger',
    category: 'trigger',
    label: 'Manual Trigger',
    description: 'Start the workflow manually.',
    icon: 'MousePointerClick',
  },
  'schedule-trigger': {
    type: 'schedule-trigger',
    category: 'trigger',
    label: 'Schedule Trigger',
    description: 'Run on a recurring schedule.',
    icon: 'Clock',
  },
  'webhook-trigger': {
    type: 'webhook-trigger',
    category: 'trigger',
    label: 'Webhook Trigger',
    description: 'Start when an HTTP request arrives.',
    icon: 'Webhook',
  },
  'if-condition': {
    type: 'if-condition',
    category: 'logic',
    label: 'If / Condition',
    description: 'Branch based on a condition.',
    icon: 'GitBranch',
  },
  switch: {
    type: 'switch',
    category: 'logic',
    label: 'Switch',
    description: 'Route to one of many branches.',
    icon: 'Split',
  },
  delay: {
    type: 'delay',
    category: 'logic',
    label: 'Delay',
    description: 'Wait before continuing.',
    icon: 'Timer',
  },
  merge: {
    type: 'merge',
    category: 'logic',
    label: 'Merge',
    description: 'Combine multiple branches.',
    icon: 'Merge',
  },
  'http-request': {
    type: 'http-request',
    category: 'api',
    label: 'HTTP Request',
    description: 'Call a REST endpoint.',
    icon: 'Globe',
  },
  graphql: {
    type: 'graphql',
    category: 'api',
    label: 'GraphQL',
    description: 'Query a GraphQL API.',
    icon: 'Braces',
  },
  'json-transform': {
    type: 'json-transform',
    category: 'data',
    label: 'JSON Transform',
    description: 'Reshape JSON data.',
    icon: 'FileJson',
  },
  filter: {
    type: 'filter',
    category: 'data',
    label: 'Filter',
    description: 'Keep only matching items.',
    icon: 'Filter',
  },
  email: {
    type: 'email',
    category: 'output',
    label: 'Email',
    description: 'Send an email.',
    icon: 'Mail',
  },
  slack: {
    type: 'slack',
    category: 'output',
    label: 'Slack',
    description: 'Post a Slack message.',
    icon: 'Slack',
  },
  discord: {
    type: 'discord',
    category: 'output',
    label: 'Discord',
    description: 'Post a Discord message.',
    icon: 'MessageCircle',
  },
  notification: {
    type: 'notification',
    category: 'output',
    label: 'Notification',
    description: 'Show an in-app notification.',
    icon: 'Bell',
  },
};

/** Ordered list of node descriptors, convenient for the sidebar library. */
export const NODE_DESCRIPTORS: NodeTypeDescriptor[] =
  Object.values(NODE_CATALOG);

/**
 * Initial configuration for each node type. Used when a node is dropped onto
 * the canvas. `label` seeds the editable node name from the catalog label.
 */
const DEFAULT_CONFIG: NodeConfigByType = {
  'manual-trigger': {
    label: NODE_CATALOG['manual-trigger'].label,
    description: '',
  },
  'schedule-trigger': {
    label: NODE_CATALOG['schedule-trigger'].label,
    description: '',
    cron: '0 9 * * *',
    timezone: 'UTC',
  },
  'webhook-trigger': {
    label: NODE_CATALOG['webhook-trigger'].label,
    description: '',
    method: 'POST',
    path: '/webhook',
  },
  'if-condition': {
    label: NODE_CATALOG['if-condition'].label,
    description: '',
    condition: '',
  },
  switch: {
    label: NODE_CATALOG['switch'].label,
    description: '',
    expression: '',
    cases: [],
  },
  delay: {
    label: NODE_CATALOG['delay'].label,
    description: '',
    durationMs: 1000,
  },
  merge: {
    label: NODE_CATALOG['merge'].label,
    description: '',
    strategy: 'append',
  },
  'http-request': {
    label: NODE_CATALOG['http-request'].label,
    description: '',
    url: '',
    method: 'GET',
    headers: [],
    authentication: { type: 'none' },
    retry: 0,
    timeoutMs: 30000,
  },
  graphql: {
    label: NODE_CATALOG['graphql'].label,
    description: '',
    endpoint: '',
    query: '',
    headers: [],
    authentication: { type: 'none' },
    timeoutMs: 30000,
  },
  'json-transform': {
    label: NODE_CATALOG['json-transform'].label,
    description: '',
    expression: '',
  },
  filter: {
    label: NODE_CATALOG['filter'].label,
    description: '',
    condition: '',
  },
  email: {
    label: NODE_CATALOG['email'].label,
    description: '',
    to: '',
    subject: '',
    body: '',
  },
  slack: {
    label: NODE_CATALOG['slack'].label,
    description: '',
    channel: '',
    message: '',
  },
  discord: {
    label: NODE_CATALOG['discord'].label,
    description: '',
    webhookUrl: '',
    message: '',
  },
  notification: {
    label: NODE_CATALOG['notification'].label,
    description: '',
    title: '',
    message: '',
  },
};

/**
 * Returns a fresh, deeply cloned default configuration for a node type so
 * nested values (headers, cases) are never shared between node instances.
 */
export function createDefaultConfig<T extends WorkflowNodeType>(
  type: T,
): NodeConfigByType[T] {
  return structuredClone(DEFAULT_CONFIG[type]);
}

/**
 * Builds a node's data payload with default config plus optional overrides.
 * This is the single place that asserts the `type`/`config` correlation which
 * TS cannot prove for a generic `T`; all call sites stay fully typed.
 */
export function createNodeData<T extends WorkflowNodeType>(
  type: T,
  overrides: Partial<NodeConfigByType[T]> = {},
): WorkflowNodeData {
  return {
    type,
    config: { ...createDefaultConfig(type), ...overrides },
  } as WorkflowNodeData;
}
