import { useEffect } from 'react';
import { useWorkflowStore } from '@/shared/stores';

/** Whether an editable element currently holds focus (skip shortcuts there). */
function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable
  );
}

/**
 * Global keyboard shortcuts for history: Ctrl/Cmd+Z to undo, Ctrl/Cmd+Shift+Z
 * to redo. Ignored while typing so text editing keeps native undo behaviour.
 */
export function useUndoRedoShortcuts(): void {
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod || event.key.toLowerCase() !== 'z') return;
      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);
}
