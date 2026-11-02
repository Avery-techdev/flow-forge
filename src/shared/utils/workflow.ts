import type { Workflow } from '@/shared/types';

const DEFAULT_NAME = 'Untitled Workflow';

/** A blank workflow with a fresh id. */
export function createEmptyWorkflow(): Workflow {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: DEFAULT_NAME,
    nodes: [],
    edges: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** Copies a template into an independent workflow so edits never touch it. */
export function instantiateTemplate(template: Workflow): Workflow {
  const now = new Date().toISOString();
  return {
    ...structuredClone(template),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}
