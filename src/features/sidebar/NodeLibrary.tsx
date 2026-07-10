import { useRef } from 'react';
import { Search } from 'lucide-react';
import type { NodeTypeDescriptor } from '@/shared/types';
import { useWorkflowStore } from '@/shared/stores';
import { useNodeSearch } from './useNodeSearch';
import { NodeLibraryItem } from './NodeLibraryItem';

/**
 * The searchable, category-grouped node library. Selecting or dragging an item
 * adds a node to the workflow. Click-adds cascade slightly so repeated adds do
 * not stack exactly on top of each other.
 */
export function NodeLibrary(): React.JSX.Element {
  const { query, setQuery, groups, resultCount } = useNodeSearch();
  const addNode = useWorkflowStore((s) => s.addNode);
  const addCountRef = useRef(0);

  const handleAdd = (descriptor: NodeTypeDescriptor) => {
    const step = addCountRef.current % 6;
    addCountRef.current += 1;
    addNode(descriptor.type, { x: 96 + step * 28, y: 96 + step * 28 });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <form
        role="search"
        className="px-3 pb-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="node-search" className="sr-only">
          Search nodes
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-content-secondary"
            aria-hidden="true"
          />
          <input
            id="node-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes…"
            className="w-full rounded-md border border-border bg-surface py-1.5 pl-8 pr-2 text-sm text-content placeholder:text-content-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <p className="sr-only" role="status">
          {resultCount} nodes found
        </p>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {groups.length === 0 ? (
          <p className="px-2 py-4 text-sm text-content-secondary">
            No nodes match “{query}”.
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.category} className="mb-4">
              <h3 className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-content-secondary">
                {group.label}
              </h3>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((descriptor) => (
                  <li key={descriptor.type}>
                    <NodeLibraryItem
                      descriptor={descriptor}
                      onAdd={handleAdd}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
