import { Menu } from 'lucide-react';
import { useUiStore } from '@/shared/stores';

type ScreenHeaderProps = {
  title: string;
  description?: string;
  /** Optional trailing actions (e.g. a primary button). */
  actions?: React.ReactNode;
};

/** Page header for non-editor screens, with the mobile sidebar toggle. */
export function ScreenHeader({
  title,
  description,
  actions,
}: ScreenHeaderProps): React.JSX.Element {
  const openSidebar = useUiStore((s) => s.openSidebar);

  return (
    <header className="flex items-start gap-3 border-b border-border bg-surface px-4 py-4 sm:px-6">
      <button
        type="button"
        onClick={openSidebar}
        aria-label="Open sidebar"
        className="rounded-md p-1.5 text-content-secondary hover:bg-background hover:text-content md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold text-content">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-content-secondary">{description}</p>
        )}
      </div>
      {actions}
    </header>
  );
}
