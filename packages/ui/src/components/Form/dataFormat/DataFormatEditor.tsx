import { FunctionComponent, useCallback, useContext, useMemo, useState } from 'react';
import { EntitiesContext } from '../../../providers';
import { CanvasNode } from '../../Visualization/Canvas/canvas.models';
import './DataFormatEditor.scss';
import { DataFormatService } from './dataformat.service';
import { TypeaheadEditor } from '../customField/TypeaheadEditor';
import { ICamelDataformatDefinition } from '../../../models';

interface DataFormatEditorProps {
  selectedNode: CanvasNode;
}

export const DataFormatEditor: FunctionComponent<DataFormatEditorProps> = (props) => {
  const entitiesContext = useContext(EntitiesContext);
  const dataFormatCatalogMap = useMemo(() => {
    return DataFormatService.getDataFormatMap();
  }, []);

  const initialDataFormatOptions = useMemo(() => {
    return Object.values(dataFormatCatalogMap).map((option) => {
      return {
        value: option.model.name,
        children: option.model.title,
        description: option.model.description,
      };
    });
  }, [dataFormatCatalogMap]);

  const visualComponentSchema = props.selectedNode.data?.vizNode?.getComponentSchema();
  if (visualComponentSchema) {
    if (!visualComponentSchema.definition) {
      visualComponentSchema.definition = {};
    }
  }

  const { dataFormat, model: dataFormatModel } = DataFormatService.parseDataFormatModel(
    dataFormatCatalogMap,
    visualComponentSchema?.definition,
  );
  const [selected, setSelected] = useState<ICamelDataformatDefinition | undefined>(dataFormat);

  const dataFormatSchema = useMemo(() => {
    return DataFormatService.getDataFormatSchema(dataFormat);
  }, [dataFormat]);

  const handleOnChange = useCallback(
    (selectedDataFormat: string, newDataFormatModel: Record<string, unknown>) => {
      const newDataFormat = DataFormatService.getDefinitionFromModelName(dataFormatCatalogMap, selectedDataFormat);
      setSelected(newDataFormat);
      const model = props.selectedNode.data?.vizNode?.getComponentSchema()?.definition;
      if (!model) return;
      DataFormatService.setDataFormatModel(dataFormatCatalogMap, model, selectedDataFormat, newDataFormatModel);
      props.selectedNode.data?.vizNode?.updateModel(model);
      entitiesContext?.updateSourceCodeFromEntities();
    },
    [entitiesContext, dataFormatCatalogMap, props.selectedNode.data?.vizNode],
  );

  return (
    <TypeaheadEditor
      catalog={initialDataFormatOptions}
      title="Data Format"
      selected={selected}
      selectedModel={dataFormatModel}
      selectedSchema={dataFormatSchema}
      selectionOnChange={handleOnChange}
    ></TypeaheadEditor>
  );
};
