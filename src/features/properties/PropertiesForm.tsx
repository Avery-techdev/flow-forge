import type { Control, FieldValues } from 'react-hook-form';
import type { WorkflowNode, WorkflowNodeType } from '@/shared/types';
import { NODE_FIELDS } from './fieldConfig';
import { DynamicField } from './DynamicField';
import { TextAreaField, TextField } from './formFields';
import { useNodeConfigForm } from './useNodeConfigForm';

/** Presentational field list for a node type; all state comes from `control`. */
function PropertiesFields({
  type,
  control,
}: {
  type: WorkflowNodeType;
  control: Control<FieldValues>;
}): React.JSX.Element {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-3 px-4 py-3"
    >
      <TextField control={control} name="label" label="Name" />
      <TextAreaField control={control} name="description" label="Description" />
      {NODE_FIELDS[type].map((descriptor) => (
        <DynamicField
          key={descriptor.name}
          control={control}
          descriptor={descriptor}
        />
      ))}
    </form>
  );
}

/**
 * Container for the per-node configuration form: wires the form hook to the
 * presentational fields. Remounted per node via a `key` in the panel, so form
 * state always matches the selected node.
 */
export function PropertiesForm({
  node,
}: {
  node: WorkflowNode;
}): React.JSX.Element {
  const control = useNodeConfigForm(node);
  return <PropertiesFields type={node.data.type} control={control} />;
}
