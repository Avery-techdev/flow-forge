/**
 * Shared identifier for the custom workflow edge type. Kept central so the
 * templates (which build edges) and the canvas (which registers the edge
 * component) agree without a duplicated magic string.
 */
export const WORKFLOW_EDGE_TYPE = 'workflow-edge';

/** MIME-like key used to carry a node type through a drag-and-drop transfer. */
export const NODE_DND_MIME = 'application/flowforge-node';
