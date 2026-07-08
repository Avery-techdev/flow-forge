/**
 * Root application shell.
 * Placeholder for Step 1 — the real layout (Sidebar / Canvas / Properties /
 * Toolbar) is assembled in later steps. Kept intentionally minimal so the
 * design tokens and Tailwind pipeline can be verified.
 */
function App(): React.JSX.Element {
  return (
    <main className="grid min-h-screen place-items-center bg-background text-content">
      <div className="rounded-xl border border-border bg-surface px-8 py-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-primary">FlowForge</h1>
        <p className="mt-2 text-sm text-content-secondary">
          Visual Workflow Builder — project scaffold ready.
        </p>
      </div>
    </main>
  );
}

export default App;
