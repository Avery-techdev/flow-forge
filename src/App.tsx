import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WORKFLOW_TEMPLATES } from '@/shared/constants';
import { useWorkflowStore } from '@/shared/stores';
import { WorkflowCanvas } from '@/features/canvas';

/**
 * Root application shell. For now it hosts the canvas full-screen so Step 5 can
 * be exercised; the surrounding layout (Sidebar / Toolbar / Properties) and
 * real navigation are assembled in later steps.
 *
 * The template bootstrap is temporary — it seeds a workflow so the canvas has
 * content until the navigation/templates screen (Step 10) takes over.
 */
function App(): React.JSX.Element {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const hasNodes = useWorkflowStore((s) => s.nodes.length > 0);

  useEffect(() => {
    if (!hasNodes) loadWorkflow(WORKFLOW_TEMPLATES[0]);
  }, [hasNodes, loadWorkflow]);

  return (
    <ReactFlowProvider>
      <main className="h-screen w-screen bg-surface-canvas">
        <WorkflowCanvas />
      </main>
    </ReactFlowProvider>
  );
}

export default App;
