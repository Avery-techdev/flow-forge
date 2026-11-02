import { WORKFLOW_TEMPLATES } from '@/shared/constants';
import { computeRunOrder } from '@/shared/services';
import type { Workflow } from '@/shared/types';

/** A template plus its flow described as node labels in run order. */
export type TemplateSummary = {
  template: Workflow;
  flow: string;
};

function describeFlow(template: Workflow): string {
  const labels = new Map(
    template.nodes.map((n) => [n.id, n.data.config.label]),
  );
  return computeRunOrder(template.nodes, template.edges)
    .map((id) => labels.get(id))
    .join(' → ');
}

/** The available templates with their precomputed flow descriptions. */
export function useTemplates(): TemplateSummary[] {
  return WORKFLOW_TEMPLATES.map((template) => ({
    template,
    flow: describeFlow(template),
  }));
}
