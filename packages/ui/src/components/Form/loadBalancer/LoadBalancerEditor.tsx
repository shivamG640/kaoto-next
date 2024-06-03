import { FunctionComponent, useCallback, useContext, useMemo, useState } from 'react';
import { EntitiesContext } from '../../../providers';
import { CanvasNode } from '../../Visualization/Canvas/canvas.models';
import { LoadBalancerService } from './loadbalancer.service';
import './LoadBalancerEditor.scss';
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
  const loadBalancerOption = loadBalancer && {
    name: loadBalancer!.model.name,
    title: loadBalancer!.model.title,
  };
  const [selectedLoadBalancerOption, setSelectedLoadBalancerOption] = useState<
    { name: string; title: string } | undefined
  >(loadBalancerOption);

  const loadBalancerSchema = useMemo(() => {
    return LoadBalancerService.getLoadBalancerSchema(loadBalancer);
  }, [loadBalancer]);

  const handleOnChange = useCallback(
    (
      selectedLoadBalancerOption: { name: string; title: string } | undefined,
      newLoadBalancerModel: Record<string, unknown>,
    ) => {
      setSelectedLoadBalancerOption(selectedLoadBalancerOption);
      const model = props.selectedNode.data?.vizNode?.getComponentSchema()?.definition;
      if (!model) return;
      LoadBalancerService.setLoadBalancerModel(
        loadBalancerCatalogMap,
        model,
        selectedLoadBalancerOption ? selectedLoadBalancerOption!.name : '',
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
      selected={selectedLoadBalancerOption}
      selectedModel={loadBalancerModel}
      selectedSchema={loadBalancerSchema}
      selectionOnChange={handleOnChange}
    ></TypeaheadEditor>
  );
};
