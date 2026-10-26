import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WORKFLOW_TEMPLATES } from '@/shared/constants';
import { useUiStore, useWorkflowStore } from '@/shared/stores';
import { loadDraft } from '@/shared/services';
import { useApplyTheme } from '@/shared/hooks';
import { WorkflowCanvas } from '@/features/canvas';
import { Sidebar } from '@/features/sidebar';
import { PropertiesPanel } from '@/features/properties';
import { Toolbar } from '@/features/toolbar';

/**
 * Root application shell: sidebar + toolbar + canvas + properties panel. The
 * bootstrap restores the autosaved draft (or seeds a template) until the
 * navigation/templates screen (Step 10) takes over.
 */
function App(): React.JSX.Element {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const theme = useUiStore((s) => s.theme);

  useApplyTheme(theme);

  // Runs once on mount: restore the autosaved draft, else seed a template.
  useEffect(() => {
    loadWorkflow(loadDraft() ?? WORKFLOW_TEMPLATES[0]);
  }, [loadWorkflow]);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Toolbar />

          <div className="flex min-h-0 flex-1">
            <main className="min-h-0 flex-1 bg-surface-canvas">
              <WorkflowCanvas />
            </main>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
