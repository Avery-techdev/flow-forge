import type { SaveStatus } from '@/shared/types';

const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: 'All changes saved',
  saving: 'Saving…',
  saved: 'Saved',
};

/**
 * Presentational autosave status. Communicated as text (never colour-only) and
 * announced politely so screen-reader users hear save transitions.
 */
export function SaveIndicator({
  status,
}: {
  status: SaveStatus;
}): React.JSX.Element {
  return (
    <span
      role="status"
      aria-live="polite"
      className="hidden text-xs text-content-secondary sm:inline"
    >
      {STATUS_TEXT[status]}
    </span>
  );
}
