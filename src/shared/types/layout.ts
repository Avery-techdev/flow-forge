/**
 * Canvas layout orientation. Derived from the viewport (see `useOrientation`),
 * never stored: horizontal flow on desktop, vertical (top-down) on mobile.
 */
export type Orientation = 'horizontal' | 'vertical';

/** Active color theme. Light is the default; dark is an opt-in toggle. */
export type Theme = 'light' | 'dark';

/** Autosave lifecycle used by the toolbar's save indicator. */
export type SaveStatus = 'idle' | 'saving' | 'saved';
