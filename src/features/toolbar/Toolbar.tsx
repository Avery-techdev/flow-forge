import { Menu, Moon, Play, Redo2, Save, Sun, Undo2 } from 'lucide-react';
import {
  selectCanRedo,
  selectCanUndo,
  useUiStore,
  useWorkflowStore,
} from '@/shared/stores';
import { useExecutionRunner } from '@/features/execution';
import { ToolbarButton } from './ToolbarButton';
import { WorkflowNameField } from './WorkflowNameField';
import { SaveIndicator } from './SaveIndicator';
import { useAutosave } from './useAutosave';
import { useUndoRedoShortcuts } from './useUndoRedoShortcuts';

/**
 * Top application toolbar: editable workflow name, run/save actions, undo/redo
 * (buttons + Ctrl/Cmd+Z shortcuts), autosave indicator and the theme toggle.
 * Orchestration only — each control delegates to a store action or hook.
 */
export function Toolbar(): React.JSX.Element {
  const openSidebar = useUiStore((s) => s.openSidebar);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const canUndo = useWorkflowStore(selectCanUndo);
  const canRedo = useWorkflowStore(selectCanRedo);

  const { run, isExecuting, canRun } = useExecutionRunner();
  const { status, saveNow } = useAutosave();

  useUndoRedoShortcuts();

  const isDark = theme === 'dark';

  return (
    <header className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
      <span className="md:hidden">
        <ToolbarButton icon={Menu} label="Open sidebar" onClick={openSidebar} />
      </span>
      <WorkflowNameField />

      <div className="ml-auto flex items-center gap-1">
        <SaveIndicator status={status} />

        <ToolbarButton
          icon={Undo2}
          label="Undo"
          onClick={undo}
          disabled={!canUndo}
        />
        <ToolbarButton
          icon={Redo2}
          label="Redo"
          onClick={redo}
          disabled={!canRedo}
        />

        <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />

        <ToolbarButton icon={Save} label="Save" onClick={saveNow} />
        <ToolbarButton
          icon={isDark ? Sun : Moon}
          label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
        />
        <ToolbarButton
          icon={Play}
          label={isExecuting ? 'Running…' : 'Run workflow'}
          onClick={run}
          disabled={isExecuting || !canRun}
          variant="primary"
        />
      </div>
    </header>
  );
}
