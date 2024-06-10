import { useMemo } from 'react';
import { getValue } from '.';

export const useFieldGroups = (fields: { [name: string]: unknown }) => {
  const propertiesArray = useMemo(() => {
    return Object.entries(fields).reduce(
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
  }, [fields]);

  return propertiesArray;
};
