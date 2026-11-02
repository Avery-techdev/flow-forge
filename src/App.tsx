import { lazy, Suspense } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useUiStore } from '@/shared/stores';
import { useApplyTheme, useRestoreWorkflow } from '@/shared/hooks';
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
  const theme = useUiStore((s) => s.theme);
  const currentScreen = useUiStore((s) => s.currentScreen);

  useApplyTheme(theme);

  useRestoreWorkflow();

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
