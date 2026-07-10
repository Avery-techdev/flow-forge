import { create } from 'zustand';
import type { ScreenId } from '@/shared/types';

/**
 * UI shell state: which screen is active and whether the mobile sidebar drawer
 * is open. Kept separate from the workflow store so graph state and chrome
 * state evolve independently.
 */
type UiState = {
  currentScreen: ScreenId;
  isSidebarOpen: boolean;
};

type UiActions = {
  setScreen: (screen: ScreenId) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set) => ({
  currentScreen: 'workflows',
  isSidebarOpen: false,

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
}));
