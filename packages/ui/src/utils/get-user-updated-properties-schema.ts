import { KaotoSchemaDefinition } from '../models';
import { isDefined } from './is-defined';
import { resolveRefIfNeeded } from './resolve-ref-if-needed';

export function getUserUpdatedPropertiesSchema(
  schemaProperties?: KaotoSchemaDefinition['schema']['properties'],
  inputModel?: Record<string, unknown>,
  resolveFromSchema?: KaotoSchemaDefinition['schema']['properties'],
): KaotoSchemaDefinition['schema'] {
  if (!isDefined(schemaProperties) || !isDefined(inputModel) || !isDefined(resolveFromSchema)) return {};

  const nonDefaultFormSchema = Object.entries(schemaProperties).reduce(
    (acc, [property, definition]) => {
      if (property in inputModel && isDefined(inputModel[property])) {
        if (
          definition['type'] === 'string' ||
          definition['type'] === 'boolean' ||
          definition['type'] === 'integer' ||
          definition['type'] === 'number'
        ) {
          if ('default' in definition) {
            if (definition['default'] != inputModel[property]) {
              acc![property] = definition;
            }
          } else {
            acc![property] = definition;
          }
        } else if (
          definition['type'] === 'object' &&
          'properties' in definition &&
          Object.keys(inputModel[property] as object).length > 0
        ) {
          const subSchema = getUserUpdatedPropertiesSchema(
            definition['properties'],
            inputModel[property] as Record<string, unknown>,
            resolveFromSchema,
          );
          if (Object.keys(subSchema).length > 0) {
            acc![property] = { ...definition, properties: subSchema };
          }
        } else if ('$ref' in definition) {
          const objectDefinition = resolveRefIfNeeded(definition, resolveFromSchema);
          const subSchema = getUserUpdatedPropertiesSchema(
            objectDefinition['properties'] as KaotoSchemaDefinition['schema']['properties'],
            inputModel[property] as Record<string, unknown>,
            resolveFromSchema,
          );
          if (Object.keys(subSchema).length > 0) {
            acc![property] = { ...objectDefinition, properties: subSchema };
          }
        } else if (definition['type'] === 'array' && (inputModel[property] as unknown[]).length > 0) {
          acc![property] = definition;
        }
      }

      return acc;
    },
    {} as KaotoSchemaDefinition['schema']['properties'],
  );

  return nonDefaultFormSchema!;
}
