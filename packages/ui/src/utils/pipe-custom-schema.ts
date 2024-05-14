import { getValue } from './get-value';
import { setValue } from './set-value';
import { Pipe } from '@kaoto/camel-catalog/types';

export const getCustomSchemaFromPipe = (pipe: Pipe) => {
  const name = getValue(pipe, 'metadata.name', '');
  const annotations = getValue(pipe, 'metadata.annotations', {} as Record<string, string>);
  const labels = getValue(pipe, 'metadata.labels', {} as Record<string, string>);

  const customSchema = {
    name,
    labels: labels,
    annotations: annotations,
  };

  return customSchema;
};

export const updatePipeFromCustomSchema = (pipe: Pipe, value: Record<string, unknown>): void => {
  const previousName = getValue(pipe, 'metadata.name');

  const newName: string = getValue(value, 'name');

  setValue(pipe, 'metadata.name', newName ?? previousName);
  
  const newLabels = Object.assign({}, getValue(value, 'labels', {}));
  const newAnnotations = Object.assign({}, getValue(value, 'annotations', {}));

  setValue(pipe, 'metadata.labels', newLabels);
  setValue(pipe, 'metadata.annotations', newAnnotations);
};