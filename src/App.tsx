import { lazy, Suspense, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WORKFLOW_TEMPLATES } from '@/shared/constants';
import { useUiStore, useWorkflowStore } from '@/shared/stores';
import { loadDraft } from '@/shared/services';
import { useApplyTheme } from '@/shared/hooks';
import { instantiateTemplate } from '@/shared/utils';
import type { ScreenId } from '@/shared/types';
import { Sidebar } from '@/features/sidebar';
import { DashboardScreen } from '@/features/dashboard';
import { WorkflowsScreen } from '@/features/workflows';
import { TemplatesScreen } from '@/features/templates';
import { ExecutionsScreen } from '@/features/executions';
import { SettingsScreen } from '@/features/settings';

// The editor pulls in React Flow and Framer Motion, so it is loaded on demand
// to keep the initial bundle small.
const Editor = lazy(() => import('@/features/editor'));

const SCREENS: Record<ScreenId, React.ComponentType> = {
  dashboard: DashboardScreen,
  workflows: WorkflowsScreen,
  templates: TemplatesScreen,
  executions: ExecutionsScreen,
  settings: SettingsScreen,
  editor: Editor,
};

/**
 * Root application shell: sidebar plus the active screen. The editor stays
 * backed by the workflow store, so switching screens never loses the open
 * workflow. On mount the autosaved draft is restored (or a template seeded).
 */
function App(): React.JSX.Element {
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const theme = useUiStore((s) => s.theme);
  const currentScreen = useUiStore((s) => s.currentScreen);

  useApplyTheme(theme);

  // Runs once on mount: restore the autosaved draft, else seed a template.
  useEffect(() => {
    loadWorkflow(loadDraft() ?? instantiateTemplate(WORKFLOW_TEMPLATES[0]));
  }, [loadWorkflow]);

  const Screen = SCREENS[currentScreen];

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Suspense
            fallback={
              <p role="status" className="p-6 text-sm text-content-secondary">
                Loading…
              </p>
            }
          >
            <Screen />
          </Suspense>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
