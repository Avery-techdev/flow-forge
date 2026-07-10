import { createElement, type DragEvent } from 'react';
import type { NodeTypeDescriptor } from '@/shared/types';
import { NODE_DND_MIME } from '@/shared/constants';
import { resolveNodeIcon, CATEGORY_STYLES } from '@/features/nodes';

/**
 * A single draggable node in the library. It is a real button so it is fully
 * keyboard operable: activating it (Enter/Space/click) adds the node, while
 * mouse users can also drag it onto the canvas.
 */
type NodeLibraryItemProps = {
  descriptor: NodeTypeDescriptor;
  onAdd: (descriptor: NodeTypeDescriptor) => void;
};

export function NodeLibraryItem({
  descriptor,
  onAdd,
}: NodeLibraryItemProps): React.JSX.Element {
  const style = CATEGORY_STYLES[descriptor.category];
  const icon = createElement(resolveNodeIcon(descriptor.icon), {
    className: 'h-4 w-4',
    'aria-hidden': true,
  });

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData(NODE_DND_MIME, descriptor.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onAdd(descriptor)}
      className="flex w-full cursor-grab items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-left hover:border-border hover:bg-background active:cursor-grabbing"
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${style.iconClass}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-content">
          {descriptor.label}
        </span>
        <span className="block truncate text-xs text-content-secondary">
          {descriptor.description}
        </span>
      </span>
    </button>
  );
}
