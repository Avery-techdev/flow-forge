import { createElement } from 'react';
import type { LucideIcon } from 'lucide-react';

/** Presentational icon button used across the toolbar. */
export type ToolbarButtonProps = {
  icon: LucideIcon;
  /** Accessible label; also used as the hover tooltip. */
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary';
};

const VARIANT_CLASSES: Record<
  NonNullable<ToolbarButtonProps['variant']>,
  string
> = {
  default:
    'text-content-secondary hover:bg-background hover:text-content disabled:opacity-40 disabled:hover:bg-transparent',
  primary:
    'gap-1.5 bg-primary px-3 text-white hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary',
};

/**
 * A single toolbar control. Icon-only by default (label exposed via
 * `aria-label`); the primary variant also renders the visible label text.
 */
export function ToolbarButton({
  icon,
  label,
  onClick,
  disabled = false,
  variant = 'default',
}: ToolbarButtonProps): React.JSX.Element {
  const showText = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${VARIANT_CLASSES[variant]}`}
    >
      {createElement(icon, { className: 'h-4 w-4', 'aria-hidden': true })}
      {showText && <span>{label}</span>}
    </button>
  );
}
