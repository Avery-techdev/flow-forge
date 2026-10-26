import { create } from 'zustand';
import type { ScreenId, Theme } from '@/shared/types';

/**
 * UI shell state: active screen, mobile sidebar drawer, and color theme. Kept
 * separate from the workflow store so graph state and chrome state evolve
 * independently. The theme lives here as the single source of truth; the
 * `.dark` class on the document is a derived side effect (see `useApplyTheme`).
 */
type UiState = {
  currentScreen: ScreenId;
  isSidebarOpen: boolean;
  theme: Theme;
};

type UiActions = {
  setScreen: (screen: ScreenId) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
};

export type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set) => ({
  currentScreen: 'workflows',
  isSidebarOpen: false,
  theme: 'light',

  setScreen: (screen) => {
    set({ currentScreen: screen });
  },
  openSidebar: () => {
    set({ isSidebarOpen: true });
  },
  closeSidebar: () => {
    set({ isSidebarOpen: false });
  },
  toggleSidebar: () => {
    set((s) => ({ isSidebarOpen: !s.isSidebarOpen }));
  },
  toggleTheme: () => {
    set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' }));
  },
}));
