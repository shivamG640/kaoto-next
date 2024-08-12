import { Card, CardBody, CardHeader, SearchInput, ToggleGroup, ToggleGroupItem, Tooltip } from '@patternfly/react-core';
import { FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { VisibleFlowsContext, FilteredFieldContext } from '../../../providers';
import { ErrorBoundary } from '../../ErrorBoundary';
import './CanvasForm.scss';
import { CanvasFormHeader } from './Form/CanvasFormHeader';
import { CanvasNode } from './canvas.models';
import { CanvasFormTabs } from './CanvasFormTabs';
import { FormTabsModes, getTabTooltip } from './canvasformtabs.modes';
import { CanvasFormTabsContext } from '../../../providers/canvas-form-tabs.provider';

interface CanvasFormProps {
  selectedNode: CanvasNode;
  onClose?: () => void;
}

export const CanvasForm: FunctionComponent<CanvasFormProps> = (props) => {
  const { visualFlowsApi } = useContext(VisibleFlowsContext)!;
  const { filteredFieldText, onFilterChange } = useContext(FilteredFieldContext);
  const { selectedTab, onTabChange } = useContext(CanvasFormTabsContext);
  const flowIdRef = useRef<string | undefined>(undefined);

  const visualComponentSchema = useMemo(() => {
    const answer = props.selectedNode.data?.vizNode?.getComponentSchema();
    // Overriding parameters with an empty object When the parameters property is mistakenly set to null
    if (answer?.definition?.parameters === null) {
      answer!.definition.parameters = {};
    }
    return answer;
  }, [props.selectedNode.data?.vizNode]);
  const title = visualComponentSchema?.title;

  /** Store the flow's initial Id */
  useEffect(() => {
    flowIdRef.current = props.selectedNode.data?.vizNode?.getBaseEntity()?.getId();
  }, []);

  const onClose = useCallback(() => {
    props.onClose?.();
    const newId = props.selectedNode.data?.vizNode?.getBaseEntity()?.getId();
    if (typeof flowIdRef.current === 'string' && typeof newId === 'string' && flowIdRef.current !== newId) {
      visualFlowsApi.renameFlow(flowIdRef.current, newId);
    }
  }, [props, visualFlowsApi]);

  return (
    <ErrorBoundary key={props.selectedNode.id} fallback={<p>This node cannot be configured yet</p>}>
      <Card className="canvas-form">
        <CardHeader>
          <CanvasFormHeader
            nodeId={props.selectedNode.id}
            title={title}
            onClose={onClose}
            nodeIcon={props.selectedNode.data?.vizNode?.data?.icon}
          />
          <ToggleGroup aria-label="Single selectable form tabs" className="form-tabs">
            {Object.values(FormTabsModes).map((mode) => (
              <Tooltip content={getTabTooltip(mode)}>
                <ToggleGroupItem
                  key={mode}
                  text={mode}
                  buttonId={mode}
                  isSelected={selectedTab === mode}
                  onChange={onTabChange}
                />
              </Tooltip>
            ))}
          </ToggleGroup>
          <SearchInput
            className="filter-fields"
            placeholder="Find properties by name"
            data-testid="filter-fields"
            value={filteredFieldText}
            onChange={onFilterChange}
            onClear={onFilterChange}
          />
        </CardHeader>

        <CardBody className="canvas-form__body">
          <CanvasFormTabs selectedNode={props.selectedNode} />
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};
