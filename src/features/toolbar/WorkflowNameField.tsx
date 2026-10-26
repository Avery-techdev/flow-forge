import { useRef } from 'react';
import { useWorkflowStore } from '@/shared/stores';

const FALLBACK_NAME = 'Untitled Workflow';

/**
 * Inline-editable workflow name. The name is written live to the store (the
 * single source of truth), and a history snapshot is pushed exactly once per
 * edit session — on the first keystroke — so a rename is one undo step and the
 * Undo control is enabled immediately (no blur/commit race).
 */
export function WorkflowNameField(): React.JSX.Element {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const pushHistory = useWorkflowStore((s) => s.pushHistory);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);

  // True once this edit session has already recorded its history snapshot.
  const hasSnapshot = useRef(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!hasSnapshot.current) {
      pushHistory();
      hasSnapshot.current = true;
    }
    setWorkflowName(event.target.value);
  };

  const endEdit = (): void => {
    hasSnapshot.current = false;
    if (!workflowName.trim()) setWorkflowName(FALLBACK_NAME);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    // The global shortcut handler skips inputs (so form fields keep native text
    // undo), so this live-bound field must run history undo/redo itself —
    // otherwise Ctrl/Cmd+Z here would only do native text undo, which the
    // controlled value immediately overwrites.
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      hasSnapshot.current = false;
      if (event.shiftKey) redo();
      else undo();
      return;
    }
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      value={workflowName}
      onChange={handleChange}
      onBlur={endEdit}
      onKeyDown={handleKeyDown}
      aria-label="Workflow name"
      spellCheck={false}
      className="min-w-0 max-w-56 truncate rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-content hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}
