import { createElement } from 'react';
import { NAV_ITEMS } from '@/shared/constants';
import { useUiStore } from '@/shared/stores';
import { resolveNavIcon } from './navIcons';

/**
 * Primary screen navigation. The active screen is read from the UI store and
 * marked with `aria-current` for assistive tech.
 */
export function SidebarNav(): React.JSX.Element {
  const currentScreen = useUiStore((s) => s.currentScreen);
  const setScreen = useUiStore((s) => s.setScreen);

  return (
    <nav aria-label="Primary" className="px-3 py-3">
      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === currentScreen;
          const icon = createElement(resolveNavIcon(item.icon), {
            className: 'h-4 w-4',
            'aria-hidden': true,
          });
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setScreen(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-content-secondary hover:bg-background hover:text-content'
                }`}
              >
                {icon}
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
