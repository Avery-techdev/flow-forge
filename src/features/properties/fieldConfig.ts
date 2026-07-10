import type { WorkflowNodeType } from '@/shared/types';
import { HTTP_METHODS } from '@/shared/types';

/**
 * Declarative field metadata for the properties form. Each node type lists its
 * type-specific fields; the shared Name/Description fields are rendered by the
 * form itself. A generic renderer maps `kind` to a form primitive.
 */

export type FieldKind =
  'text' | 'textarea' | 'number' | 'select' | 'headers' | 'auth';

export type SelectOption = { value: string; label: string };

export type FieldDescriptor = {
  /** Config key this field edits. */
  name: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  helpText?: string;
  options?: SelectOption[];
};

const methodOptions: SelectOption[] = HTTP_METHODS.map((m) => ({
  value: m,
  label: m,
}));

/** Type-specific fields per node type (name/description are always shown). */
export const NODE_FIELDS: Record<WorkflowNodeType, FieldDescriptor[]> = {
  'manual-trigger': [],
  'schedule-trigger': [
    {
      name: 'cron',
      label: 'Cron Expression',
      kind: 'text',
      placeholder: '0 9 * * *',
    },
    { name: 'timezone', label: 'Timezone', kind: 'text', placeholder: 'UTC' },
  ],
  'webhook-trigger': [
    { name: 'method', label: 'Method', kind: 'select', options: methodOptions },
    { name: 'path', label: 'Path', kind: 'text', placeholder: '/webhook' },
  ],
  'if-condition': [
    {
      name: 'condition',
      label: 'Condition',
      kind: 'text',
      placeholder: 'value > 10',
    },
  ],
  switch: [
    {
      name: 'expression',
      label: 'Expression',
      kind: 'text',
      placeholder: 'status',
    },
  ],
  delay: [
    {
      name: 'durationMs',
      label: 'Duration (ms)',
      kind: 'number',
      placeholder: '1000',
    },
  ],
  merge: [
    {
      name: 'strategy',
      label: 'Strategy',
      kind: 'select',
      options: [
        { value: 'append', label: 'Append' },
        { value: 'combine', label: 'Combine' },
      ],
    },
  ],
  'http-request': [
    {
      name: 'url',
      label: 'API URL',
      kind: 'text',
      placeholder: 'https://api.example.com',
    },
    { name: 'method', label: 'Method', kind: 'select', options: methodOptions },
    { name: 'headers', label: 'Headers', kind: 'headers' },
    { name: 'authentication', label: 'Authentication', kind: 'auth' },
    { name: 'retry', label: 'Retry', kind: 'number', placeholder: '0' },
    {
      name: 'timeoutMs',
      label: 'Timeout (ms)',
      kind: 'number',
      placeholder: '30000',
    },
  ],
  graphql: [
    {
      name: 'endpoint',
      label: 'Endpoint',
      kind: 'text',
      placeholder: 'https://api.example.com/graphql',
    },
    {
      name: 'query',
      label: 'Query',
      kind: 'textarea',
      placeholder: 'query { … }',
    },
    { name: 'headers', label: 'Headers', kind: 'headers' },
    { name: 'authentication', label: 'Authentication', kind: 'auth' },
    {
      name: 'timeoutMs',
      label: 'Timeout (ms)',
      kind: 'number',
      placeholder: '30000',
    },
  ],
  'json-transform': [
    {
      name: 'expression',
      label: 'Expression',
      kind: 'textarea',
      placeholder: 'items.map(x => x.id)',
    },
  ],
  filter: [
    {
      name: 'condition',
      label: 'Condition',
      kind: 'text',
      placeholder: 'item.active === true',
    },
  ],
  email: [
    { name: 'to', label: 'To', kind: 'text', placeholder: 'user@example.com' },
    { name: 'subject', label: 'Subject', kind: 'text' },
    { name: 'body', label: 'Body', kind: 'textarea' },
  ],
  slack: [
    {
      name: 'channel',
      label: 'Channel',
      kind: 'text',
      placeholder: '#general',
    },
    { name: 'message', label: 'Message', kind: 'textarea' },
  ],
  discord: [
    {
      name: 'webhookUrl',
      label: 'Webhook URL',
      kind: 'text',
      placeholder: 'https://discord.com/api/webhooks/…',
    },
    { name: 'message', label: 'Message', kind: 'textarea' },
  ],
  notification: [
    { name: 'title', label: 'Title', kind: 'text' },
    { name: 'message', label: 'Message', kind: 'textarea' },
  ],
};
