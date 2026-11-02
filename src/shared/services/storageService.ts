import type { ExecutionRecord, Workflow } from '@/shared/types';

/**
 * Low-level persistence over `localStorage`. This is the innermost data layer;
 * `workflowService` builds the mock REST API on top of it. All reads validate
 * external (untrusted) data with type guards before returning it.
 */

const STORAGE_KEYS = {
  workflows: 'flowforge:workflows',
  draft: 'flowforge:draft',
  executions: 'flowforge:executions',
} as const;

const MAX_EXECUTION_RECORDS = 50;

/** Guards a value as a `Workflow`, checking content beyond mere structure. */
function isWorkflow(value: unknown): value is Workflow {
  if (typeof value !== 'object' || value === null) return false;
  const w = value as Record<string, unknown>;
  return (
    typeof w.id === 'string' &&
    w.id.length > 0 &&
    typeof w.name === 'string' &&
    Array.isArray(w.nodes) &&
    Array.isArray(w.edges) &&
    typeof w.createdAt === 'string' &&
    typeof w.updatedAt === 'string'
  );
}

/** Safely parses a JSON string, returning `null` on any error. */
function parseJson(raw: string | null): unknown {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Reads and validates the persisted workflow collection. */
export function loadWorkflows(): Workflow[] {
  const parsed = parseJson(localStorage.getItem(STORAGE_KEYS.workflows));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isWorkflow);
}

/** Persists the full workflow collection. */
export function saveWorkflows(workflows: Workflow[]): void {
  localStorage.setItem(STORAGE_KEYS.workflows, JSON.stringify(workflows));
}

/** Reads the autosaved draft, or `null` when absent/invalid. */
export function loadDraft(): Workflow | null {
  const parsed = parseJson(localStorage.getItem(STORAGE_KEYS.draft));
  return isWorkflow(parsed) ? parsed : null;
}

/** Autosaves the current draft workflow. */
export function saveDraft(workflow: Workflow): void {
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(workflow));
}

/** Clears the autosaved draft. */
export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEYS.draft);
}

/** Inserts or replaces a workflow by id, preserving its original `createdAt`. */
export function upsertWorkflow(workflow: Workflow): void {
  const all = loadWorkflows();
  const existing = all.find((w) => w.id === workflow.id);
  if (!existing) {
    saveWorkflows([...all, workflow]);
    return;
  }
  const merged = { ...workflow, createdAt: existing.createdAt };
  saveWorkflows(all.map((w) => (w.id === workflow.id ? merged : w)));
}

function isExecutionRecord(value: unknown): value is ExecutionRecord {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.workflowId === 'string' &&
    typeof r.workflowName === 'string' &&
    (r.status === 'success' || r.status === 'error') &&
    typeof r.nodeCount === 'number' &&
    typeof r.startedAt === 'string' &&
    typeof r.durationMs === 'number'
  );
}

/** Reads the run history, newest first. */
export function loadExecutions(): ExecutionRecord[] {
  const parsed = parseJson(localStorage.getItem(STORAGE_KEYS.executions));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isExecutionRecord);
}

/** Prepends a run to the history, keeping only the most recent entries. */
export function appendExecution(record: ExecutionRecord): void {
  const next = [record, ...loadExecutions()].slice(0, MAX_EXECUTION_RECORDS);
  localStorage.setItem(STORAGE_KEYS.executions, JSON.stringify(next));
}

/** Removes every FlowForge key from localStorage (Settings → reset). */
export function clearAllData(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    localStorage.removeItem(key);
  }
}
