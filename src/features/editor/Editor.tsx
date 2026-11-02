import { useWorkflowStore } from '@/shared/stores';
import { AreaErrorBoundary } from '@/shared/components';
import { WorkflowCanvas } from '@/features/canvas';
import { PropertiesPanel } from '@/features/properties';
import { Toolbar } from '@/features/toolbar';

/** The workflow editor screen: toolbar, canvas and properties panel. */
export function Editor(): React.JSX.Element {
  const workflowName = useWorkflowStore((s) => s.workflowName);

  return (
    <>
      <Toolbar />
      <h1 className="sr-only">Workflow editor: {workflowName}</h1>
      <div className="flex min-h-0 flex-1">
        <main className="min-h-0 flex-1 bg-surface-canvas">
          <AreaErrorBoundary area="the canvas">
            <WorkflowCanvas />
          </AreaErrorBoundary>
        </main>
        <AreaErrorBoundary area="the properties panel">
          <PropertiesPanel />
        </AreaErrorBoundary>
      </div>
    </>
  );
}
