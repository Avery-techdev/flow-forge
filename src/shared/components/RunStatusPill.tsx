import type { ExecutionRecord } from '@/shared/types';

const META = {
  success: { text: 'Success', className: 'bg-emerald-500/10 text-emerald-600' },
  error: { text: 'Error', className: 'bg-red-500/10 text-red-600' },
} as const;

/** Text-labelled run result badge (never color-only). */
export function RunStatusPill({
  status,
}: {
  status: ExecutionRecord['status'];
}): React.JSX.Element {
  const meta = META[status];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.text}
    </span>
  );
}
