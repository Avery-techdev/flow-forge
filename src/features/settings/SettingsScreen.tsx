import { useState } from 'react';
import { useUiStore } from '@/shared/stores';
import {
  SECONDARY_BUTTON_CLASS,
  Screen,
  ScreenHeader,
} from '@/shared/components';
import { useResetLocalData } from './useResetLocalData';

export function SettingsScreen(): React.JSX.Element {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const resetLocalData = useResetLocalData();

  return (
    <>
      <ScreenHeader
        title="Settings"
        description="Preferences and local data."
      />
      <Screen>
        <div className="flex max-w-xl flex-col gap-4">
          <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
            <h2 className="text-base font-semibold text-content">Appearance</h2>
            <p className="mt-1 text-sm text-content-secondary">
              Currently using the {theme} theme.
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              className={`${SECONDARY_BUTTON_CLASS} mt-3`}
            >
              Switch to {theme === 'light' ? 'dark' : 'light'} mode
            </button>
          </section>

          <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
            <h2 className="text-base font-semibold text-content">Local data</h2>
            <p className="mt-1 text-sm text-content-secondary">
              Workflows, drafts and run history are stored in this browser only.
            </p>
            {confirmingReset ? (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={resetLocalData}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Confirm reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className={SECONDARY_BUTTON_CLASS}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReset(true)}
                className={`${SECONDARY_BUTTON_CLASS} mt-3`}
              >
                Reset all data
              </button>
            )}
          </section>
        </div>
      </Screen>
    </>
  );
}
