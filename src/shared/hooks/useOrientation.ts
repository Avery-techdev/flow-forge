import type { Orientation } from '@/shared/types';
import { useMediaQuery } from './useMediaQuery';

/**
 * Derives the canvas orientation from the viewport width: vertical (top-down)
 * on mobile, horizontal on wider screens. Purely derived — nothing is stored,
 * so the viewport stays the single source of truth.
 */
export function useOrientation(): Orientation {
  const isMobile = useMediaQuery('(max-width: 767px)');
  return isMobile ? 'vertical' : 'horizontal';
}
