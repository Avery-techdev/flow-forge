import { useId } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import type { HeaderPair } from '@/shared/types';
import { HiddenLabel } from '@/shared/components';

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
  'w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-content placeholder:text-content-secondary focus:border-primary focus:outline-2 focus:outline-primary';

export function HeadersField<T extends FieldValues>({
  control,
  name,
  label,
}: HeadersFieldProps<T>): React.JSX.Element {
  const id = useId();
  const { field } = useController({ control, name });
  // Boundary: RHF stores this value untyped; the schema guarantees the shape.
  const headers = (field.value ?? []) as HeaderPair[];

  const update = (next: HeaderPair[]): void => field.onChange(next);

  const addRow = (): void =>
    update([...headers, { id: crypto.randomUUID(), key: '', value: '' }]);

  const removeRow = (rowId: string): void =>
    update(headers.filter((h) => h.id !== rowId));

  const editRow = (rowId: string, patch: Partial<HeaderPair>): void =>
    update(headers.map((h) => (h.id === rowId ? { ...h, ...patch } : h)));

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-content">{label}</span>
      {headers.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {headers.map((header, index) => (
            <li key={header.id} className="flex items-center gap-1.5">
              <HiddenLabel htmlFor={`${id}-${header.id}-key`}>
                Header {index + 1} name
              </HiddenLabel>
              <input
                id={`${id}-${header.id}-key`}
                type="text"
                value={header.key}
                onChange={(e) => editRow(header.id, { key: e.target.value })}
                placeholder="Header"
                className={rowInputClass}
              />
              <HiddenLabel htmlFor={`${id}-${header.id}-value`}>
                Header {index + 1} value
              </HiddenLabel>
              <input
                id={`${id}-${header.id}-value`}
                type="text"
                value={header.value}
                onChange={(e) => editRow(header.id, { value: e.target.value })}
                placeholder="Value"
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
