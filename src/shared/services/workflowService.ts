import type { Workflow, WorkflowEdge, WorkflowNode } from '@/shared/types';
import { WORKFLOW_TEMPLATES } from '@/shared/constants';
import { loadWorkflows, saveWorkflows } from './storageService';
import { randomDelay } from './timing';

/**
 * Mock REST API for workflows. Mirrors the documented endpoints
 * (GET/POST/PUT/DELETE /workflows) using `localStorage` as the backing store
 * and simulated network latency. No real backend is involved.
 */

const LATENCY_MIN_MS = 200;
const LATENCY_MAX_MS = 500;

/** Payload for creating a workflow (POST /workflows). */
export type CreateWorkflowInput = {
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

/** Partial payload for updating a workflow (PUT /workflows/:id). */
export type UpdateWorkflowInput = Partial<
  Pick<Workflow, 'name' | 'nodes' | 'edges'>
>;

/** Seeds the store with templates on first use so screens have content. */
function ensureSeeded(): Workflow[] {
  const existing = loadWorkflows();
  if (existing.length > 0) return existing;
  const seeded = WORKFLOW_TEMPLATES.map((tpl) => structuredClone(tpl));
  saveWorkflows(seeded);
  return seeded;
}

/** GET /workflows — returns all persisted workflows. */
export async function fetchWorkflows(): Promise<Workflow[]> {
  await randomDelay(LATENCY_MIN_MS, LATENCY_MAX_MS);
  return ensureSeeded();
}

/** POST /workflows — creates and persists a new workflow. */
export async function createWorkflow(
  input: CreateWorkflowInput,
): Promise<Workflow> {
  await randomDelay(LATENCY_MIN_MS, LATENCY_MAX_MS);
  const now = new Date().toISOString();
  const workflow: Workflow = {
    id: crypto.randomUUID(),
    name: input.name,
    nodes: input.nodes,
    edges: input.edges,
    createdAt: now,
    updatedAt: now,
  };
  saveWorkflows([...ensureSeeded(), workflow]);
  return workflow;
}

/** PUT /workflows/:id — updates an existing workflow; rejects if missing. */
export async function updateWorkflow(
  id: string,
  changes: UpdateWorkflowInput,
): Promise<Workflow> {
  await randomDelay(LATENCY_MIN_MS, LATENCY_MAX_MS);
  const workflows = ensureSeeded();
  const existing = workflows.find((w) => w.id === id);
  if (!existing) {
    throw new Error(`Workflow "${id}" not found.`);
  }
  const updated: Workflow = {
    ...existing,
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  saveWorkflows(workflows.map((w) => (w.id === id ? updated : w)));
  return updated;
}

/** DELETE /workflows/:id — removes a workflow; rejects if missing. */
export async function deleteWorkflow(id: string): Promise<void> {
  await randomDelay(LATENCY_MIN_MS, LATENCY_MAX_MS);
  const workflows = ensureSeeded();
  if (!workflows.some((w) => w.id === id)) {
    throw new Error(`Workflow "${id}" not found.`);
  }
  saveWorkflows(workflows.filter((w) => w.id !== id));
}
