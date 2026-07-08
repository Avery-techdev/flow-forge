import type {
  NodeConfigByType,
  Workflow,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
} from '@/shared/types';
import { createNodeData } from './nodeCatalog';
import { WORKFLOW_EDGE_TYPE } from './edge';

/**
 * Pre-built workflow templates used to seed the Templates screen. These are
 * static mock data; persistence/execution is handled by the service layer.
 */

/** Builds a canvas node with default config, optionally overriding fields. */
function buildNode<T extends WorkflowNodeType>(
  id: string,
  type: T,
  position: { x: number; y: number },
  overrides: Partial<NodeConfigByType[T]> = {},
): WorkflowNode {
  return { id, type, position, data: createNodeData(type, overrides) };
}

/** Builds a directed edge between two nodes. */
function buildEdge(source: string, target: string): WorkflowEdge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    type: WORKFLOW_EDGE_TYPE,
  };
}

const COL = 260;
const ROW = 140;

const leadPipeline: Workflow = {
  id: 'tpl-lead-pipeline',
  name: 'Lead Pipeline',
  createdAt: '2026-01-01T09:00:00.000Z',
  updatedAt: '2026-01-01T09:00:00.000Z',
  nodes: [
    buildNode(
      'lead-webhook',
      'webhook-trigger',
      { x: 0, y: ROW },
      {
        label: 'New Lead',
        path: '/leads',
      },
    ),
    buildNode(
      'lead-if',
      'if-condition',
      { x: COL, y: ROW },
      {
        label: 'Qualified?',
        condition: 'lead.score > 50',
      },
    ),
    buildNode(
      'lead-slack',
      'slack',
      { x: COL * 2, y: 0 },
      {
        label: 'Notify Sales',
        channel: '#sales',
        message: 'New qualified lead 🎉',
      },
    ),
    buildNode(
      'lead-email',
      'email',
      { x: COL * 2, y: ROW * 2 },
      {
        label: 'Welcome Email',
        to: '{{lead.email}}',
        subject: 'Welcome!',
      },
    ),
  ],
  edges: [
    buildEdge('lead-webhook', 'lead-if'),
    buildEdge('lead-if', 'lead-slack'),
    buildEdge('lead-if', 'lead-email'),
  ],
};

const crmSync: Workflow = {
  id: 'tpl-crm-sync',
  name: 'CRM Sync',
  createdAt: '2026-01-02T09:00:00.000Z',
  updatedAt: '2026-01-02T09:00:00.000Z',
  nodes: [
    buildNode(
      'crm-schedule',
      'schedule-trigger',
      { x: 0, y: ROW },
      {
        label: 'Every Hour',
        cron: '0 * * * *',
      },
    ),
    buildNode(
      'crm-fetch',
      'http-request',
      { x: COL, y: ROW },
      {
        label: 'Fetch Contacts',
        url: 'https://api.example.com/contacts',
        method: 'GET',
      },
    ),
    buildNode(
      'crm-transform',
      'json-transform',
      { x: COL * 2, y: ROW },
      {
        label: 'Map Fields',
        expression: 'contacts.map(mapToCrm)',
      },
    ),
    buildNode(
      'crm-push',
      'http-request',
      { x: COL * 3, y: ROW },
      {
        label: 'Push to CRM',
        url: 'https://crm.example.com/import',
        method: 'POST',
      },
    ),
  ],
  edges: [
    buildEdge('crm-schedule', 'crm-fetch'),
    buildEdge('crm-fetch', 'crm-transform'),
    buildEdge('crm-transform', 'crm-push'),
  ],
};

const invoiceAutomation: Workflow = {
  id: 'tpl-invoice-automation',
  name: 'Invoice Automation',
  createdAt: '2026-01-03T09:00:00.000Z',
  updatedAt: '2026-01-03T09:00:00.000Z',
  nodes: [
    buildNode(
      'inv-manual',
      'manual-trigger',
      { x: 0, y: ROW },
      {
        label: 'Run Billing',
      },
    ),
    buildNode(
      'inv-fetch',
      'http-request',
      { x: COL, y: ROW },
      {
        label: 'Fetch Invoices',
        url: 'https://api.example.com/invoices',
        method: 'GET',
      },
    ),
    buildNode(
      'inv-filter',
      'filter',
      { x: COL * 2, y: ROW },
      {
        label: 'Overdue Only',
        condition: 'invoice.status === "overdue"',
      },
    ),
    buildNode(
      'inv-email',
      'email',
      { x: COL * 3, y: ROW },
      {
        label: 'Send Reminder',
        to: '{{invoice.customerEmail}}',
        subject: 'Payment reminder',
      },
    ),
  ],
  edges: [
    buildEdge('inv-manual', 'inv-fetch'),
    buildEdge('inv-fetch', 'inv-filter'),
    buildEdge('inv-filter', 'inv-email'),
  ],
};

/** All workflow templates, in display order. */
export const WORKFLOW_TEMPLATES: Workflow[] = [
  leadPipeline,
  crmSync,
  invoiceAutomation,
];
