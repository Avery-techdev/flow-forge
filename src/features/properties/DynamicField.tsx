import type { Control, FieldValues, Path } from 'react-hook-form';
import type { FieldDescriptor } from './fieldConfig';
import {
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from './formFields';
import { HeadersField } from './HeadersField';
import { AuthField } from './AuthField';

/**
 * Renders a single properties field by mapping its declared `kind` to the
 * matching form primitive.
 */
type DynamicFieldProps<T extends FieldValues> = {
  control: Control<T>;
  descriptor: FieldDescriptor;
};

export function DynamicField<T extends FieldValues>({
  control,
  descriptor,
}: DynamicFieldProps<T>): React.JSX.Element {
  const name = descriptor.name as Path<T>;
  const common = {
    control,
    name,
    label: descriptor.label,
    placeholder: descriptor.placeholder,
    helpText: descriptor.helpText,
  };

  switch (descriptor.kind) {
    case 'textarea':
      return <TextAreaField {...common} />;
    case 'number':
      return <NumberField {...common} />;
    case 'select':
      return <SelectField {...common} options={descriptor.options ?? []} />;
    case 'headers':
      return (
        <HeadersField control={control} name={name} label={descriptor.label} />
      );
    case 'auth':
      return (
        <AuthField control={control} name={name} label={descriptor.label} />
      );
    case 'text':
    default:
      return <TextField {...common} />;
  }
}
