import { useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { WORKFLOW_TEMPLATES } from '@/shared/constants';
import { useUiStore, useWorkflowStore } from '@/shared/stores';
import { WorkflowCanvas } from '@/features/canvas';
import { Sidebar } from '@/features/sidebar';

/**
 * Root application shell: sidebar + canvas. The Toolbar (with its own menu
 * button and controls) and the Properties panel are added in later steps; for
 * now a minimal mobile top bar exposes the sidebar drawer.
 *
 * The template bootstrap is temporary — it seeds a workflow until the
 * navigation/templates screen (Step 10) takes over.
 */
function App(): React.JSX.Element {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const hasNodes = useWorkflowStore((s) => s.nodes.length > 0);
  const openSidebar = useUiStore((s) => s.openSidebar);

  useEffect(() => {
    if (!hasNodes) loadWorkflow(WORKFLOW_TEMPLATES[0]);
  }, [hasNodes, loadWorkflow]);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2 md:hidden">
            <button
              type="button"
              onClick={openSidebar}
              aria-label="Open sidebar"
              className="rounded-md p-1.5 text-content-secondary hover:bg-background hover:text-content"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold text-content">
              FlowForge
            </span>
          </header>

          <main className="min-h-0 flex-1 bg-surface-canvas">
            <WorkflowCanvas />
          </main>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
