import { z } from 'zod';
import type { WorkflowNodeType } from '@/shared/types';
import { HTTP_METHODS } from '@/shared/types';

/**
 * Zod validation schemas per node type. These mirror `NodeConfigByType` and
 * drive the live validation in the properties form. Fields shared by every
 * node (name, description) live in `base`.
 */

const base = {
  label: z.string().min(1, 'Name is required'),
  description: z.string(),
};

const headerSchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
});

const authSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('none') }),
  z.object({
    type: z.literal('bearer'),
    token: z.string().min(1, 'Token is required'),
  }),
  z.object({
    type: z.literal('basic'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
  z.object({
    type: z.literal('apiKey'),
    key: z.string().min(1, 'Key is required'),
    value: z.string().min(1, 'Value is required'),
  }),
]);

const httpMethod = z.enum(HTTP_METHODS);

export const NODE_SCHEMAS: Record<WorkflowNodeType, z.ZodTypeAny> = {
  'manual-trigger': z.object(base),
  'schedule-trigger': z.object({
    ...base,
    cron: z.string().min(1, 'Cron expression is required'),
    timezone: z.string().min(1, 'Timezone is required'),
  }),
  'webhook-trigger': z.object({
    ...base,
    method: httpMethod,
    path: z
      .string()
      .min(1, 'Path is required')
      .startsWith('/', 'Path must start with /'),
  }),
  'if-condition': z.object({
    ...base,
    condition: z.string().min(1, 'Condition is required'),
  }),
  switch: z.object({
    ...base,
    expression: z.string().min(1, 'Expression is required'),
    cases: z.array(z.string()),
  }),
  delay: z.object({
    ...base,
    durationMs: z.number().int().min(0, 'Must be zero or more'),
  }),
  merge: z.object({
    ...base,
    strategy: z.enum(['append', 'combine']),
  }),
  'http-request': z.object({
    ...base,
    url: z.string().url('Must be a valid URL'),
    method: httpMethod,
    headers: z.array(headerSchema),
    authentication: authSchema,
    retry: z.number().int().min(0, 'Must be zero or more'),
    timeoutMs: z.number().int().positive('Must be greater than zero'),
  }),
  graphql: z.object({
    ...base,
    endpoint: z.string().url('Must be a valid URL'),
    query: z.string().min(1, 'Query is required'),
    headers: z.array(headerSchema),
    authentication: authSchema,
    timeoutMs: z.number().int().positive('Must be greater than zero'),
  }),
  'json-transform': z.object({
    ...base,
    expression: z.string().min(1, 'Expression is required'),
  }),
  filter: z.object({
    ...base,
    condition: z.string().min(1, 'Condition is required'),
  }),
  email: z.object({
    ...base,
    to: z.string().min(1, 'Recipient is required'),
    subject: z.string().min(1, 'Subject is required'),
    body: z.string(),
  }),
  slack: z.object({
    ...base,
    channel: z.string().min(1, 'Channel is required'),
    message: z.string().min(1, 'Message is required'),
  }),
  discord: z.object({
    ...base,
    webhookUrl: z.string().url('Must be a valid URL'),
    message: z.string().min(1, 'Message is required'),
  }),
  notification: z.object({
    ...base,
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
  }),
};
