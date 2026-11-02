import type { Orientation } from '@/shared/types';
import { MOBILE_MEDIA_QUERY } from '@/shared/constants';
import { useMediaQuery } from './useMediaQuery';

/**
 * Derives the canvas orientation from the viewport width: vertical (top-down)
 * on mobile, horizontal on wider screens. Purely derived — nothing is stored,
 * so the viewport stays the single source of truth.
 */
export function useOrientation(): Orientation {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  return isMobile ? 'vertical' : 'horizontal';
}
