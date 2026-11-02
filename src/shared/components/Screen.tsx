/** Scrollable content region shared by the non-editor screens. */
export function Screen({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
      {children}
    </main>
  );
}

/** Primary action button style used on screen headers and empty states. */
export const PRIMARY_BUTTON_CLASS =
  'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90';
export const SECONDARY_BUTTON_CLASS =
  'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-content hover:bg-background';
