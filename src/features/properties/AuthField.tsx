import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import type { AuthConfig, AuthType } from '@/shared/types';

/**
 * Editor for a node's authentication config. A type selector reveals the
 * relevant credential inputs; changing the type resets to that type's defaults.
 */
type AuthFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

const AUTH_OPTIONS: { value: AuthType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'apiKey', label: 'API Key' },
];

function defaultForType(type: AuthType): AuthConfig {
  switch (type) {
    case 'bearer':
      return { type: 'bearer', token: '' };
    case 'basic':
      return { type: 'basic', username: '', password: '' };
    case 'apiKey':
      return { type: 'apiKey', key: '', value: '' };
    default:
      return { type: 'none' };
  }
}

const controlClass =
  'w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-content placeholder:text-content-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';

export function AuthField<T extends FieldValues>({
  control,
  name,
  label,
}: AuthFieldProps<T>): React.JSX.Element {
  const { field } = useController({ control, name });
  // Boundary: RHF stores this value untyped; the schema guarantees the shape.
  const auth = (field.value ?? { type: 'none' }) as AuthConfig;

  const setAuth = (next: AuthConfig) => field.onChange(next);

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-xs font-medium text-content">{label}</legend>
      <select
        value={auth.type}
        onChange={(e) => setAuth(defaultForType(e.target.value as AuthType))}
        aria-label="Authentication type"
        className={controlClass}
      >
        {AUTH_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {auth.type === 'bearer' && (
        <input
          type="text"
          value={auth.token}
          onChange={(e) => setAuth({ type: 'bearer', token: e.target.value })}
          placeholder="Token"
          aria-label="Bearer token"
          className={controlClass}
        />
      )}

      {auth.type === 'basic' && (
        <>
          <input
            type="text"
            value={auth.username}
            onChange={(e) =>
              setAuth({ ...auth, type: 'basic', username: e.target.value })
            }
            placeholder="Username"
            aria-label="Username"
            className={controlClass}
          />
          <input
            type="password"
            value={auth.password}
            onChange={(e) =>
              setAuth({ ...auth, type: 'basic', password: e.target.value })
            }
            placeholder="Password"
            aria-label="Password"
            className={controlClass}
          />
        </>
      )}

      {auth.type === 'apiKey' && (
        <>
          <input
            type="text"
            value={auth.key}
            onChange={(e) =>
              setAuth({ ...auth, type: 'apiKey', key: e.target.value })
            }
            placeholder="Key"
            aria-label="API key name"
            className={controlClass}
          />
          <input
            type="text"
            value={auth.value}
            onChange={(e) =>
              setAuth({ ...auth, type: 'apiKey', value: e.target.value })
            }
            placeholder="Value"
            aria-label="API key value"
            className={controlClass}
          />
        </>
      )}
    </fieldset>
  );
}
