const DATE_TIME = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** Formats an ISO timestamp for display in the user's locale. */
export function formatDateTime(iso: string): string {
  return DATE_TIME.format(new Date(iso));
}

/** Formats a duration, e.g. `850 ms` or `2.4 s`. */
export function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`;
}
