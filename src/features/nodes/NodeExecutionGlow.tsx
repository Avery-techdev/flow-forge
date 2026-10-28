import { motion, useReducedMotion } from 'framer-motion';
import type { NodeStatus } from '@/shared/types';

/**
 * Execution overlay for a node card. Pulses in the success green while the
 * node is "executing", then settles into a status-colored ring. Rendered as a
 * non-interactive overlay so it never fights the card's own selection ring.
 */
type NodeExecutionGlowProps = {
  status: NodeStatus;
};

const GREEN = '16, 185, 129';
const RED = '239, 68, 68';

const RING_NONE = '0 0 0 0px rgba(0, 0, 0, 0)';
const RING_SUCCESS = `0 0 0 2px rgba(${GREEN}, 0.7)`;
const RING_ERROR = `0 0 0 2px rgba(${RED}, 0.7)`;

const PULSE_FROM = `0 0 0 0px rgba(${GREEN}, 0.6)`;
const PULSE_TO = `0 0 0 10px rgba(${GREEN}, 0)`;

export function NodeExecutionGlow({
  status,
}: NodeExecutionGlowProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();

  const animate =
    status === 'running'
      ? { boxShadow: reduceMotion ? RING_SUCCESS : [PULSE_FROM, PULSE_TO] }
      : {
          boxShadow:
            status === 'success'
              ? RING_SUCCESS
              : status === 'error'
                ? RING_ERROR
                : RING_NONE,
        };

  const transition =
    status === 'running' && !reduceMotion
      ? { duration: 0.5, ease: 'easeOut' as const, repeat: Infinity }
      : { duration: 0.25 };

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-lg"
      initial={false}
      animate={animate}
      transition={transition}
    />
  );
}
