import { describe, expect, it, vi } from 'vitest';
import { createNodeData } from '@/shared/constants';
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
} from '@/shared/types';
import {
  computeRunOrder,
  simulateExecution,
  type ExecutionHandlers,
} from './executionService';

function node(id: string, type: WorkflowNodeType): WorkflowNode {
  return { id, type, position: { x: 0, y: 0 }, data: createNodeData(type) };
}

function edge(source: string, target: string): WorkflowEdge {
  return { id: `${source}->${target}`, source, target };
}

function createHandlers(): ExecutionHandlers & { events: string[] } {
  const events: string[] = [];
  return {
    events,
    onStart: () => events.push('start'),
    onNodeRunning: (id) => events.push(`running:${id}`),
    onNodeSuccess: (id) => events.push(`success:${id}`),
    onNodeError: (id) => events.push(`error:${id}`),
    onComplete: (status) => events.push(`complete:${status}`),
  };
}

const FAST = { minDelayMs: 0, maxDelayMs: 0 };

describe('computeRunOrder', () => {
  const nodes = [
    node('trigger', 'manual-trigger'),
    node('a', 'filter'),
    node('b', 'email'),
    node('lonely', 'slack'),
  ];

  it('walks connected nodes breadth-first from the trigger', () => {
    const edges = [edge('trigger', 'a'), edge('a', 'b')];
    expect(computeRunOrder(nodes, edges)).toEqual(['trigger', 'a', 'b']);
  });

  it('excludes isolated nodes', () => {
    const edges = [edge('trigger', 'a')];
    expect(computeRunOrder(nodes, edges)).not.toContain('lonely');
  });
});

describe('simulateExecution', () => {
  const nodes = [
    node('trigger', 'manual-trigger'),
    node('http', 'http-request'),
    node('email', 'email'),
  ];
  const order = ['trigger', 'http', 'email'];

  it('runs every node in order and completes with success', async () => {
    const handlers = createHandlers();
    await simulateExecution(nodes, order, handlers, {
      ...FAST,
      random: () => 0.99,
    });
    expect(handlers.events).toEqual([
      'start',
      'running:trigger',
      'success:trigger',
      'running:http',
      'success:http',
      'running:email',
      'success:email',
      'complete:success',
    ]);
  });

  it('stops at a failing API node and leaves later nodes idle', async () => {
    const handlers = createHandlers();
    await simulateExecution(nodes, order, handlers, {
      ...FAST,
      random: () => 0,
    });
    expect(handlers.events).toEqual([
      'start',
      'running:trigger',
      'success:trigger',
      'running:http',
      'error:http',
      'complete:error',
    ]);
  });

  it('retries an API node before failing', async () => {
    const retryNodes = [node('http', 'http-request')];
    retryNodes[0].data = createNodeData('http-request', { retry: 2 });
    const random = vi
      .fn<() => number>()
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99);
    const handlers = createHandlers();
    await simulateExecution(retryNodes, ['http'], handlers, {
      ...FAST,
      random,
    });
    expect(random).toHaveBeenCalledTimes(3);
    expect(handlers.events).toContain('complete:success');
  });

  it('stops without completing when aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const handlers = createHandlers();
    await simulateExecution(nodes, order, handlers, {
      ...FAST,
      signal: controller.signal,
    });
    expect(handlers.events).toEqual(['start']);
  });
});
