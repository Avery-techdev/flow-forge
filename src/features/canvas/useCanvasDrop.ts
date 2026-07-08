import { useCallback, type DragEvent } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { WorkflowNodeType } from '@/shared/types';
import { NODE_CATALOG, NODE_DND_MIME } from '@/shared/constants';
import { useWorkflowStore } from '@/shared/stores';

/** Type guard: is the transferred string a known node type? */
function isWorkflowNodeType(value: string): value is WorkflowNodeType {
  return value in NODE_CATALOG;
}

type CanvasDropHandlers = {
  onDragOver: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
};

/**
 * Wires drag-and-drop from the sidebar library onto the canvas: reads the node
 * type from the drag payload and adds a node at the dropped flow position.
 */
export function useCanvasDrop(): CanvasDropHandlers {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useWorkflowStore((s) => s.addNode);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(NODE_DND_MIME);
      if (!type || !isWorkflowNodeType(type)) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(type, position);
    },
    [screenToFlowPosition, addNode],
  );

  return { onDragOver, onDrop };
}
