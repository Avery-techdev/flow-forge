import { describe, expect, it } from 'vitest';
import { createNodeData } from '@/shared/constants';
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
} from '@/shared/types';
import { isValidConnection } from './connectionRules';

function node(id: string, type: WorkflowNodeType): WorkflowNode {
  return { id, type, position: { x: 0, y: 0 }, data: createNodeData(type) };
}

function edge(source: string, target: string): WorkflowEdge {
  return { id: `${source}->${target}`, source, target };
}

const nodes = [
  node('trigger', 'manual-trigger'),
  node('http', 'http-request'),
  node('filter', 'filter'),
  node('email', 'email'),
];

function connect(source: string, target: string, edges: WorkflowEdge[] = []) {
  return isValidConnection(nodes, edges, {
    source,
    target,
    sourceHandle: null,
    targetHandle: null,
  });
}

describe('isValidConnection', () => {
  it('accepts a forward connection', () => {
    expect(connect('trigger', 'http')).toBe(true);
  });

  it('rejects self-links and unknown nodes', () => {
    expect(connect('http', 'http')).toBe(false);
    expect(connect('http', 'missing')).toBe(false);
  });

  it('rejects edges out of outputs and into triggers', () => {
    expect(connect('email', 'filter')).toBe(false);
    expect(connect('http', 'trigger')).toBe(false);
  });

  it('rejects duplicates', () => {
    expect(connect('trigger', 'http', [edge('trigger', 'http')])).toBe(false);
  });

  it('rejects connections that close a cycle', () => {
    const edges = [edge('http', 'filter')];
    expect(connect('filter', 'http', edges)).toBe(false);
  });
});
