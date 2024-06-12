import { getValue } from './get-value';

export const getFieldGroups = (fields: { [name: string]: unknown }) => {
  const propertiesArray = Object.entries(fields).reduce(
    (acc, [name, definition]) => {
      const group: string = getValue(definition, 'group', '');
      if (group === '' || group === 'common' || group === 'producer' || group === 'consumer') {
        acc.common.push(name);
      } else {
        acc.groups[group] ??= [];
        acc.groups[group].push(name);
      }
      return acc;
    },
    { common: [], groups: {} } as { common: string[]; groups: Record<string, string[]> },
  );

  return propertiesArray;
};
