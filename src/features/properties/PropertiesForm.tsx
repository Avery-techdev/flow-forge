import { useEffect } from 'react';
import {
  useForm,
  useWatch,
  type FieldValues,
  type Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NodeConfig, WorkflowNode } from '@/shared/types';
import { useWorkflowStore } from '@/shared/stores';
import { NODE_SCHEMAS } from './schemas';
import { NODE_FIELDS } from './fieldConfig';
import { DynamicField } from './DynamicField';
import { TextAreaField, TextField } from './formFields';

/**
 * The per-node configuration form. Fields and validation are selected by the
 * node's type; edits are written straight to the store (single source of
 * truth) so the canvas reflects them live. Remounted per node via a `key` in
 * the panel, so form state always matches the selected node.
 */
type PropertiesFormProps = {
  node: WorkflowNode;
};

export function PropertiesForm({
  node,
}: PropertiesFormProps): React.JSX.Element {
  const { type } = node.data;
  const updateNodeConfig = useWorkflowStore((s) => s.updateNodeConfig);

  // Boundary: the schema is chosen dynamically by node type, so its inferred
  // input type widens to `unknown`. This single cast bridges the dynamic schema
  // to a `FieldValues` resolver; validation still runs against the real schema.
  const resolver = zodResolver(
    NODE_SCHEMAS[type] as never,
  ) as Resolver<FieldValues>;

  const form = useForm<FieldValues>({
    resolver,
    defaultValues: node.data.config as FieldValues,
    mode: 'onChange',
  });

  const values = useWatch({ control: form.control });

  useEffect(() => {
    // Boundary: RHF values are validated by the node's schema; a single
    // documented cast bridges the untyped form values to the store patch.
    updateNodeConfig(node.id, values as Partial<NodeConfig>);
  }, [values, node.id, updateNodeConfig]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-3 px-4 py-3"
    >
      <TextField control={form.control} name="label" label="Name" />
      <TextAreaField
        control={form.control}
        name="description"
        label="Description"
      />
      {NODE_FIELDS[type].map((descriptor) => (
        <DynamicField
          key={descriptor.name}
          control={form.control}
          descriptor={descriptor}
        />
      ))}
    </form>
  );
}
