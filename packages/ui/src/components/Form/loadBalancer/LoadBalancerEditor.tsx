import { FunctionComponent, useCallback, useContext, useMemo, useState } from 'react';
import { EntitiesContext } from '../../../providers';
import { CanvasNode } from '../../Visualization/Canvas/canvas.models';
import { LoadBalancerService } from './loadbalancer.service';
import './LoadBalancerEditor.scss';
import { ICamelLoadBalancerDefinition } from '../../../models/camel-loadbalancers-catalog';
import { TypeaheadEditor } from '../customField/TypeaheadEditor';

interface LoadBalancerEditorProps {
  selectedNode: CanvasNode;
}

export const LoadBalancerEditor: FunctionComponent<LoadBalancerEditorProps> = (props) => {
  const entitiesContext = useContext(EntitiesContext);

  const loadBalancerCatalogMap = useMemo(() => {
    return LoadBalancerService.getLoadBalancerMap();
  }, []);

  const initialLoadBalancerOptions = useMemo(() => {
    return Object.values(loadBalancerCatalogMap).map((option) => {
      return {
        value: option.model.name,
        children: option.model.title,
        description: option.model.description,
      };
    });
  }, [loadBalancerCatalogMap]);

  const visualComponentSchema = props.selectedNode.data?.vizNode?.getComponentSchema();
  if (visualComponentSchema) {
    if (!visualComponentSchema.definition) {
      visualComponentSchema.definition = {};
    }
  }
  const { loadBalancer, model: loadBalancerModel } = LoadBalancerService.parseLoadBalancerModel(
    loadBalancerCatalogMap,
    visualComponentSchema?.definition,
  );
  const [selected, setSelected] = useState<ICamelLoadBalancerDefinition | undefined>(loadBalancer);

  const loadBalancerSchema = useMemo(() => {
    return LoadBalancerService.getLoadBalancerSchema(loadBalancer);
  }, [loadBalancer]);

  const handleOnChange = useCallback(
    (selectedLoadBalancer: string, newLoadBalancerModel: Record<string, unknown>) => {
      const newLoadBalancer = LoadBalancerService.getDefinitionFromModelName(
        loadBalancerCatalogMap,
        selectedLoadBalancer,
      );
      setSelected(newLoadBalancer);
      const model = props.selectedNode.data?.vizNode?.getComponentSchema()?.definition;
      if (!model) return;
      LoadBalancerService.setLoadBalancerModel(
        loadBalancerCatalogMap,
        model,
        selectedLoadBalancer,
        newLoadBalancerModel,
      );
      props.selectedNode.data?.vizNode?.updateModel(model);
      entitiesContext?.updateSourceCodeFromEntities();
    },
    [entitiesContext, loadBalancerCatalogMap, props.selectedNode.data?.vizNode],
  );

  return (
    <TypeaheadEditor
      catalog={initialLoadBalancerOptions}
      title="Load Balancer"
      selected={selected}
      selectedModel={loadBalancerModel}
      selectedSchema={loadBalancerSchema}
      selectionOnChange={handleOnChange}
    ></TypeaheadEditor>
  );
};
