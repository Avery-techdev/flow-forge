import { useWorkflowActions } from '@/shared/hooks';
import {
  PRIMARY_BUTTON_CLASS,
  Screen,
  ScreenHeader,
} from '@/shared/components';
import { useTemplates } from './useTemplates';

export function TemplatesScreen(): React.JSX.Element {
  const { fromTemplate } = useWorkflowActions();
  const templates = useTemplates();

  return (
    <>
      <ScreenHeader
        title="Templates"
        description="Start from a ready-made workflow and make it your own."
      />
      <Screen>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map(({ template, flow }) => (
            <li
              key={template.id}
              className="flex flex-col rounded-lg border border-border bg-surface p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold text-content">
                {template.name}
              </h2>
              <p className="mt-1 text-xs text-content-secondary">
                {template.nodes.length} nodes · {template.edges.length}{' '}
                connections
              </p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-content-secondary">
                {flow}
              </p>
              <button
                type="button"
                onClick={() => fromTemplate(template)}
                className={`${PRIMARY_BUTTON_CLASS} mt-4 justify-center`}
              >
                Use template
              </button>
            </li>
          ))}
        </ul>
      </Screen>
    </>
  );
}
