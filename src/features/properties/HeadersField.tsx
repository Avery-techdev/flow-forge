import { Plus, Trash2 } from 'lucide-react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import type { HeaderPair } from '@/shared/types';

/**
 * Editor for a list of request headers (key/value rows). The controlled value
 * is a `HeaderPair[]`; rows can be added and removed.
 */
type HeadersFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

const rowInputClass =
  'w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-content placeholder:text-content-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';

export function HeadersField<T extends FieldValues>({
  control,
  name,
  label,
}: HeadersFieldProps<T>): React.JSX.Element {
  const { field } = useController({ control, name });
  // Boundary: RHF stores this value untyped; the schema guarantees the shape.
  const headers = (field.value ?? []) as HeaderPair[];

  const update = (next: HeaderPair[]) => field.onChange(next);

  const addRow = () =>
    update([...headers, { id: crypto.randomUUID(), key: '', value: '' }]);

  const removeRow = (id: string) => update(headers.filter((h) => h.id !== id));

  const editRow = (id: string, patch: Partial<HeaderPair>) =>
    update(headers.map((h) => (h.id === id ? { ...h, ...patch } : h)));

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-content">{label}</span>
      {headers.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {headers.map((header, index) => (
            <li key={header.id} className="flex items-center gap-1.5">
              <input
                type="text"
                value={header.key}
                onChange={(e) => editRow(header.id, { key: e.target.value })}
                placeholder="Header"
                aria-label={`Header ${index + 1} name`}
                className={rowInputClass}
              />
              <input
                type="text"
                value={header.value}
                onChange={(e) => editRow(header.id, { value: e.target.value })}
                placeholder="Value"
                aria-label={`Header ${index + 1} value`}
                className={rowInputClass}
              />
              <button
                type="button"
                onClick={() => removeRow(header.id)}
                aria-label={`Remove header ${index + 1}`}
                className="shrink-0 rounded-md p-1.5 text-content-secondary hover:bg-background hover:text-error"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 self-start rounded-md border border-border px-2 py-1 text-xs font-medium text-content-secondary hover:border-primary hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add header
      </button>
    </div>
  );
}
