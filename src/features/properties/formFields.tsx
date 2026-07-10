import { useId, type ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import type { SelectOption } from './fieldConfig';

/**
 * Reusable, accessible form primitives for the properties panel. Each field
 * wires the mandatory error semantics: `aria-invalid`, an error message with a
 * stable id referenced via `aria-describedby`, and `role="alert"`.
 */

type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  helpText?: string;
};

/** Label + control + error wrapper shared by every field. */
function FieldShell({
  id,
  label,
  error,
  helpText,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  helpText?: string;
  children: ReactNode;
}): React.JSX.Element {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-content">
        {label}
      </label>
      {children}
      {helpText && (
        <p id={helpId} className="text-xs text-content-secondary">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  'w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm text-content placeholder:text-content-secondary focus:outline-none focus:ring-2 focus:ring-primary/30';

function borderClass(hasError: boolean): string {
  return hasError ? 'border-error' : 'border-border focus:border-primary';
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  helpText,
}: BaseFieldProps<T>): React.JSX.Element {
  const id = useId();
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  return (
    <FieldShell id={id} label={label} error={error} helpText={helpText}>
      <input
        id={id}
        type="text"
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${borderClass(Boolean(error))}`}
      />
    </FieldShell>
  );
}

export function TextAreaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  helpText,
}: BaseFieldProps<T>): React.JSX.Element {
  const id = useId();
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  return (
    <FieldShell id={id} label={label} error={error} helpText={helpText}>
      <textarea
        id={id}
        rows={3}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} resize-y ${borderClass(Boolean(error))}`}
      />
    </FieldShell>
  );
}

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  helpText,
}: BaseFieldProps<T>): React.JSX.Element {
  const id = useId();
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  return (
    <FieldShell id={id} label={label} error={error} helpText={helpText}>
      <input
        id={id}
        type="number"
        value={field.value ?? 0}
        onChange={(e) => {
          const next = e.target.valueAsNumber;
          field.onChange(Number.isNaN(next) ? 0 : next);
        }}
        onBlur={field.onBlur}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${borderClass(Boolean(error))}`}
      />
    </FieldShell>
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  helpText,
  options,
}: BaseFieldProps<T> & { options: SelectOption[] }): React.JSX.Element {
  const id = useId();
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  return (
    <FieldShell id={id} label={label} error={error} helpText={helpText}>
      <select
        id={id}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${borderClass(Boolean(error))}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
