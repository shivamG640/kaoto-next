import { AutoField } from '@kaoto-next/uniforms-patternfly';
import { ComponentType, createElement } from 'react';
import { useForm } from 'uniforms';
import { KaotoSchemaDefinition } from '../../models';
import { getValue } from '../../utils';
import { Card, CardBody, ExpandableSection, capitalize } from '@patternfly/react-core';
import { useMemo } from 'react';
import './CustomAutoFields.scss';

export type AutoFieldsProps = {
  autoField?: ComponentType<{ name: string }>;
  element?: ComponentType | string;
  fields?: string[];
  omitFields?: string[];
};

export function CustomAutoFields({
  autoField = AutoField,
  element = 'div',
  fields,
  omitFields = [],
  ...props
}: AutoFieldsProps) {
  const { schema } = useForm();
  const rootField = schema.getField('');

  /** Special handling for oneOf schemas */
  if (Array.isArray((rootField as KaotoSchemaDefinition['schema']).oneOf)) {
    return createElement(element, props, [createElement(autoField!, { key: '', name: '' })]);
  }

  const actualFields = (fields ?? schema.getSubfields()).filter((field) => !omitFields!.includes(field));

  const propertiesArray = useMemo(() => {
    return actualFields.reduce(
      (acc, name) => {
        const group: string = getValue(schema.getField(name), 'group', '');
        if (group === '' || group === 'common') {
          acc.common.push(name);
        } else {
          acc.groups[group] ??= [];
          acc.groups[group].push(name);
        }
        return acc;
      },
      { common: [], groups: {} } as { common: string[]; groups: Record<string, string[]> },
    );
  }, [actualFields]);

  return createElement(
    element,
    props,
    <>
      {propertiesArray.common.map((field) => (
        <AutoField key={field} name={field} />
      ))}

      {Object.entries(propertiesArray.groups).map(([groupName, groupFields]) => (
        <ExpandableSection
          key={`${groupName}-section-toggle`}
          toggleText={capitalize(`${groupName} properties`)}
          toggleId="expandable-section-toggle"
          contentId="expandable-section-content"
        >
          <Card className="nest-field-card">
            <CardBody className="nest-field-card-body">
              {groupFields.map((field) => (
                <AutoField key={field} name={field} />
              ))}
            </CardBody>
          </Card>
        </ExpandableSection>
      ))}
    </>,
  );
}
