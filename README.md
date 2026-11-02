# FlowForge

A visual workflow automation builder inspired by n8n and Zapier. Drag nodes onto a canvas, connect them, configure each one, and watch the workflow execute node by node. Everything runs in the browser — there is no backend; the API is mocked locally.

## Highlights

- **Execution simulator** — "Run" walks the graph in connection order. Each node pulses green while it runs and settles into a Success/Error state, while the active edge lights up amber with a flowing dash. Built with Framer Motion and honors `prefers-reduced-motion`.
- **15 node types** across Trigger, Logic, API, Data and Output, driven by a single data catalog rather than per-type components.
- **Connection rules** — invalid connections (self-links, duplicates, cycles, edges out of Output nodes or into Triggers) are rejected while dragging and re-validated in the store.
- **Dynamic properties panel** — React Hook Form + Zod, with a schema and field set per node type and live validation.
- **Undo / redo** (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z) with a history that records structural edits only, so a rename is one step and dragging is not.
- **Autosave** to localStorage every 3 seconds, with a pending-save flush when leaving the editor.
- **Responsive** — the flow switches from horizontal to vertical on mobile, and the sidebar becomes an accessible drawer (focus trap, Escape to close).
- **Light and dark theme**, with canvas chrome themed from the same design tokens.
- **Screens** — Dashboard, Workflows, Templates (Lead Pipeline, CRM Sync, Invoice Automation), Executions history and Settings.
- **Mock API** — `GET/POST/PUT/DELETE /workflows` with simulated latency over localStorage, plus a node-by-node execution service.

## Tech stack

Vite · React 19 · TypeScript · React Flow (`@xyflow/react`) · Zustand · Tailwind CSS v4 · React Hook Form + Zod · Framer Motion

## Architecture

Feature-based structure; each feature exposes its public API through an `index.ts`.

```
src/
  features/
    canvas/ nodes/ properties/ sidebar/ toolbar/ execution/ editor/
    dashboard/ workflows/ templates/ executions/ settings/
  shared/
    types/ stores/ services/ constants/ hooks/ components/ utils/
```

- **Single source of truth** — the Zustand `useWorkflowStore` owns nodes, edges and execution state. Selection, per-node status and edge activity are derived through selectors, never duplicated.
- **Service layer** — `workflowService`, `executionService` and `storageService` are separate from the UI, so swapping the mock for a real API only touches `shared/services`.
- **Design tokens** — the palette lives in the Tailwind theme (`src/index.css`); dark mode overrides the same tokens.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint     # ESLint
npm run format   # Prettier
```

## Deployment

The project deploys to Vercel with zero configuration beyond the included `vercel.json` (Vite build, `dist` output, immutable caching for hashed assets and basic security headers). Import the repository in Vercel and deploy.
