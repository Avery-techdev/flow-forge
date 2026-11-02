import type { ReactNode } from 'react';

/** Visually hidden but programmatically associated label (`labelHidden`). */
export function HiddenLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}): React.JSX.Element {
  return (
    <label htmlFor={htmlFor} className="sr-only">
      {children}
    </label>
  );
}
