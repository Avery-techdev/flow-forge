import type { ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { SECONDARY_BUTTON_CLASS } from './Screen';

type AreaErrorBoundaryProps = {
  /** Human-readable name of the guarded area, used in the message. */
  area: string;
  /** When any of these change, the boundary resets (e.g. on navigation). */
  resetKeys?: unknown[];
  children: ReactNode;
};

/** Reports the failure; the UI only ever shows a friendly message. */
function logError(error: unknown): void {
  console.error(error);
}

function AreaFallback({
  area,
  resetErrorBoundary,
}: FallbackProps & { area: string }): React.JSX.Element {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 p-6 text-sm text-content"
    >
      <p>Something went wrong in {area}. Your saved work is not affected.</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className={SECONDARY_BUTTON_CLASS}
      >
        Try again
      </button>
    </div>
  );
}

/** Error boundary for a critical UI area, with a retry action. */
export function AreaErrorBoundary({
  area,
  resetKeys,
  children,
}: AreaErrorBoundaryProps): React.JSX.Element {
  return (
    <ErrorBoundary
      resetKeys={resetKeys}
      onError={logError}
      fallbackRender={(props) => <AreaFallback {...props} area={area} />}
    >
      {children}
    </ErrorBoundary>
  );
}
