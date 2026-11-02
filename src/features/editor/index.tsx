import { WorkflowCanvas } from '@/features/canvas';
import { PropertiesPanel } from '@/features/properties';
import { Toolbar } from '@/features/toolbar';

/** The workflow editor screen: toolbar, canvas and properties panel. */
export default function Editor(): React.JSX.Element {
  return (
    <>
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <main className="min-h-0 flex-1 bg-surface-canvas">
          <WorkflowCanvas />
        </main>
        <PropertiesPanel />
      </div>
    </>
  );
}
