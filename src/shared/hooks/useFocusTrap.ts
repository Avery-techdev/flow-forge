import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a container while `active`. On activation it
 * focuses the first focusable element and remembers the trigger; Escape and
 * Tab-cycling are handled; on deactivation focus returns to the trigger.
 *
 * Required for overlays (the mobile sidebar drawer) per the accessibility
 * guidelines.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  onEscape: () => void,
): RefObject<T | null> {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const trigger = document.activeElement as HTMLElement | null;
    const focusables = (): HTMLElement[] =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));

    focusables()[0]?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;

      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      trigger?.focus();
    };
  }, [active, onEscape]);

  return containerRef;
}
