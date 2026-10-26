import { useEffect } from 'react';
import type { Theme } from '@/shared/types';

/**
 * Reflects the active theme onto the document root by toggling the `.dark`
 * class that drives the CSS token overrides. The store stays the single source
 * of truth; the class is a pure derived side effect of `theme`.
 */
export function useApplyTheme(theme: Theme): void {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
}
