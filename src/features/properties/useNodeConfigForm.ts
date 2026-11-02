import { useEffect } from 'react';
import {
  useForm,
  useWatch,
  type Control,
  type FieldValues,
  type Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NodeConfig, WorkflowNode } from '@/shared/types';
import { useWorkflowStore } from '@/shared/stores';
import { NODE_SCHEMAS } from './schemas';

/**
 * Form state for one node's configuration. The node's config seeds the form
 * (`initialValues` come from outside) and edits are written straight to the
 * store, the single source of truth, so the canvas reflects them live. Call it
 * from a component remounted per node (keyed by node id).
 */
export function useNodeConfigForm(node: WorkflowNode): Control<FieldValues> {
  const updateNodeConfig = useWorkflowStore((s) => s.updateNodeConfig);

  // Boundary: the schema is chosen dynamically by node type, so its inferred
  // input type widens to `unknown`. This single cast bridges the dynamic schema
  // to a `FieldValues` resolver; validation still runs against the real schema.
  const resolver = zodResolver(
    NODE_SCHEMAS[node.data.type] as never,
  ) as Resolver<FieldValues>;

  const { control } = useForm<FieldValues>({
    resolver,
    defaultValues: node.data.config as FieldValues,
    mode: 'onChange',
  });

  const values = useWatch({ control });

  useEffect(() => {
    // Boundary: RHF values are validated by the node's schema; a single
    // documented cast bridges the untyped form values to the store patch.
    updateNodeConfig(node.id, values as Partial<NodeConfig>);
  }, [values, node.id, updateNodeConfig]);

  return control;
}
