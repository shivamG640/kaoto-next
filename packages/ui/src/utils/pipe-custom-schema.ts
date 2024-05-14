import { getValue } from './get-value';
import { setValue } from './set-value';
import { PipeMetadata } from '../models/camel/entities/pipe-overrides';

export const getCustomSchemaFromPipe = (metadata: PipeMetadata) => {
  const name = getValue(metadata, 'name', '');
  const annotations = getValue(metadata, 'annotations', {} as Record<string, unknown>);
  const labels = getValue(metadata, 'labels', {} as Record<string, unknown>);

  const customSchema = {
    name,
    labels: labels,
    annotations: annotations,
  };

  return customSchema;
};

export const updatePipeFromCustomSchema = (metadata: PipeMetadata, value: Record<string, unknown>): void => {
  const previousName = getValue(metadata, 'name');
  const newName: string = getValue(value, 'name');
  setValue(metadata, 'name', newName ?? previousName);

  const newLabels = Object.assign({}, getValue(value, 'labels', {}));
  const newAnnotations = Object.assign({}, getValue(value, 'annotations', {}));

  setValue(metadata, 'labels', newLabels);
  setValue(metadata, 'annotations', newAnnotations);
};
