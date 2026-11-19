import { describe, expect, it } from 'vitest';
import { pushSnapshot, type WorkflowSnapshot } from './history';

function snapshot(name: string): WorkflowSnapshot {
  return { nodes: [], edges: [], workflowName: name };
}

describe('pushSnapshot', () => {
  it('appends without mutating the original stack', () => {
    const past = [snapshot('a')];
    const next = pushSnapshot(past, snapshot('b'));
    expect(next.map((s) => s.workflowName)).toEqual(['a', 'b']);
    expect(past).toHaveLength(1);
  });

  it('caps the stack at 50 entries, dropping the oldest', () => {
    let past: WorkflowSnapshot[] = [];
    for (let i = 0; i < 60; i += 1)
      past = pushSnapshot(past, snapshot(`s${i}`));
    expect(past).toHaveLength(50);
    expect(past[0].workflowName).toBe('s10');
    expect(past[49].workflowName).toBe('s59');
  });
});
