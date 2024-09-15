import { ProcessorDefinition } from '@kaoto/camel-catalog/types';
import { NodeIconResolver, NodeIconType } from '../../../../../utils/node-icon-resolver';
import { IVisualizationNode } from '../../../base-visual-entity';
import { createVisualizationNode } from '../../../visualization-node';
import { CamelRouteVisualEntityData, ICamelElementLookupResult } from '../../support/camel-component-types';
import { BaseNodeMapper } from './base-node-mapper';
import { CamelComponentSchemaService } from '../../support/camel-component-schema.service';
import { getValue } from '../../../../../utils';

export abstract class ParallelProcessorBaseNodeMapper extends BaseNodeMapper {
  abstract getProcessorName(): keyof ProcessorDefinition;

  getVizNodeFromProcessor(
    path: string,
    _componentLookup: ICamelElementLookupResult,
    entityDefinition: unknown,
  ): IVisualizationNode {
    const processorName = this.getProcessorName();

    const data: CamelRouteVisualEntityData = {
      path,
      icon: NodeIconResolver.getIcon(processorName, NodeIconType.EIP),
      processorName,
      isGroup: true,
    };

    const vizNode = createVisualizationNode(processorName, data);
    const children = this.getChildrenFromBranch(`${path}.steps`, entityDefinition);
    children.forEach((child) => {
      vizNode.addChild(child);
    });

    return vizNode;
  }

  getChildrenFromBranch(path: string, entityDefinition: unknown): IVisualizationNode[] {
    const stepsList = getValue(entityDefinition, path, []) as ProcessorDefinition[];

    return stepsList.reduce((accStepsNodes, step, index) => {
      const singlePropertyName = Object.keys(step)[0];
      const childPath = `${path}.${index}.${singlePropertyName}`;
      const childComponentLookup = CamelComponentSchemaService.getCamelComponentLookup(
        childPath,
        getValue(step, singlePropertyName),
      );

      const vizNode = this.rootNodeMapper.getVizNodeFromProcessor(childPath, childComponentLookup, entityDefinition);
      this.addNodeInteraction(vizNode, childComponentLookup.processorName as keyof ProcessorDefinition);
      accStepsNodes.push(vizNode);
      return accStepsNodes;
    }, [] as IVisualizationNode[]);
  }

  addNodeInteraction(vizNode: IVisualizationNode, processorName: keyof ProcessorDefinition): void {
    const stepsProperties = CamelComponentSchemaService.getProcessorStepsProperties(processorName);
    const canHaveChildren = stepsProperties.find((property) => property.type === 'branch') !== undefined;
    const canHaveSpecialChildren = Object.keys(stepsProperties).length > 1;
    const canReplaceStep = CamelComponentSchemaService.canReplaceStep(processorName);
    const canRemoveStep = !CamelComponentSchemaService.DISABLED_REMOVE_STEPS.includes(processorName);
    const canBeDisabled = CamelComponentSchemaService.canBeDisabled(processorName);

    vizNode.addNodeInteraction({
      canHavePreviousStep: false,
      canHaveNextStep: false,
      canRemoveFlow: false,
      canHaveChildren,
      canHaveSpecialChildren,
      canReplaceStep,
      canRemoveStep,
      canBeDisabled,
    });
  }
}
