import { clearAllData } from '@/shared/services';

/** Clears persisted data and reloads so in-memory editor state resets too. */
export function useResetLocalData(): () => void {
  return () => {
    clearAllData();
    window.location.reload();
  };
}
