import { useState } from 'react';
import type { ExecutionRecord } from '@/shared/types';
import { loadExecutions } from '@/shared/services';

/** Run history (newest first), read once when the consuming screen mounts. */
export function useExecutions(): ExecutionRecord[] {
  const [executions] = useState<ExecutionRecord[]>(loadExecutions);
  return executions;
}
