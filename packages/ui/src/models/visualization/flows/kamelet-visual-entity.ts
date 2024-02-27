import { getCamelRandomId } from '../../../camel-utils/camel-random-id';
import { ROOT_PATH, setValue } from '../../../utils';
import { EntityType } from '../../camel/entities';
import { IKameletDefinition, IKameletMetadata, IKameletSpec } from '../../kamelets-catalog';
import { KaotoSchemaDefinition } from '../../kaoto-schema';
import { VisualComponentSchema } from '../base-visual-entity';
import { AbstractCamelVisualEntity } from './abstract-camel-visual-entity';
import { CamelCatalogService } from './camel-catalog.service';
import { CatalogKind } from '../../catalog-kind';

export class KameletVisualEntity extends AbstractCamelVisualEntity {
  id: string;
  readonly type = EntityType.Kamelet;
  spec: IKameletSpec;
  metadata: IKameletMetadata;

  constructor(public kamelet: IKameletDefinition) {
    super({ id: kamelet.metadata?.name, from: kamelet?.spec.template.from });
    this.id = (kamelet?.metadata?.name as string) ?? getCamelRandomId('kamelet');
    this.metadata = kamelet?.metadata ?? { name: this.id };
    this.metadata.name = kamelet?.metadata.name ?? this.id;
    this.spec = kamelet.spec;
  }

  /** Internal API methods */
  setId(routeId: string): void {
    this.id = routeId;
    this.metadata.name = this.id;
  }

  getComponentSchema(path?: string | undefined): VisualComponentSchema | undefined {
    const customSchema = {
      name: this.metadata.name,
      title: this.spec.definition.title,
      description: this.spec.definition.description,
      type: this.metadata.labels['camel.apache.org/kamelet.type'],
      icon: this.metadata.annotations['camel.apache.org/kamelet.icon'],
      supportLevel: this.metadata.annotations['camel.apache.org/kamelet.support.level'],
      catalogVersion: this.metadata.annotations['camel.apache.org/catalog.version'],
      provider: this.metadata.annotations['camel.apache.org/provider'],
      group: this.metadata.annotations['camel.apache.org/kamelet.group'],
      namespace: this.metadata.annotations['camel.apache.org/kamelet.namespace'],
      labels: {},
      annotations: {}
    }

    if (path === ROOT_PATH) {
      return {
        title: 'Kamelet',
        schema: this.getRootKameletSchema(),
        definition: customSchema,
      };
    }

    return super.getComponentSchema(path);
  }

  updateModel(path: string | undefined, value: Record<string, unknown>): void {
    if (!path) return;

    if (path === ROOT_PATH) {
      this.metadata.name = value.name as string;
      this.spec.definition.title = value.title as string;
      this.metadata.labels['camel.apache.org/kamelet.type'] = value.type as string;
      this.metadata.annotations['camel.apache.org/kamelet.icon'] = value.icon as string;
      this.metadata.annotations['camel.apache.org/kamelet.support.level'] = value.supportLevel as string;
      this.metadata.annotations['camel.apache.org/catalog.version'] = value.catalogVersion as string;
      this.metadata.annotations['camel.apache.org/provider'] = value.provider as string;
      this.metadata.annotations['camel.apache.org/kamelet.group'] = value.group as string;
      this.metadata.annotations['camel.apache.org/kamelet.namespace'] = value.namespace as string;

      // I tried doing this first
      // setValue(this.kamelet, path, this.kamelet);
      // return;

      // this for just for testing
      const customKamelet = {
        "apiVersion": "camel.apache.org/v1",
        "kind": "Kamelet",
        "metadata": {
          "annotations": {
              "camel.apache.org/catalog.version": "Shivam",
              "camel.apache.org/kamelet.group": "Shivam",
              "camel.apache.org/kamelet.icon": "Shivam",
              "camel.apache.org/kamelet.support.level": "Shivam",
              "camel.apache.org/provider": "Shivam"
          },
          "labels": {
              "camel.apache.org/kamelet.type": "source"
          },
          "name": "Shivam"
        },
        "spec": {
          "definition": {
              "description": "Shivam",
              "properties": {
                  "period": {
                      "default": 5000,
                      "description": "Shivam",
                      "title": "Period",
                      "type": "integer"
                  }
              },
              "title": "kamelet-4437",
              "type": "object"
          },
          "template": {
              "from": {
                  "steps": [
                      {
                          "to": "https://random-data-api.com/api/v2/users"
                      },
                      {
                          "to": "kamelet:sink"
                      }
                  ],
                  "id": "from-2033",
                  "parameters": {
                      "period": "{{period}}",
                      "timerName": "user"
                  },
                  "uri": "timer"
              }
          }
        }
      }

      setValue(this.kamelet, path, customKamelet);
      return;
    }

    super.updateModel(path, value);
  }

  private getRootKameletSchema(): KaotoSchemaDefinition['schema'] {
    const rootKameletDefinition = CamelCatalogService.getComponent(CatalogKind.Entity, 'KameletConfiguration');

    if (rootKameletDefinition === undefined) return {} as unknown as KaotoSchemaDefinition['schema'];

    let schema = {} as unknown as KaotoSchemaDefinition['schema'];
    if (rootKameletDefinition.propertiesSchema !== undefined) {
      schema = rootKameletDefinition.propertiesSchema;
    }

    return schema;
  }

  protected getRootUri(): string | undefined {
    return this.spec.template.from?.uri;
  }
}
