import { Icon } from '@patternfly/react-core';
import { BanIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  AnchorEnd,
  DefaultNode,
  DEFAULT_LAYER,
  DragObjectWithType,
  DragSourceSpec,
  DragSpecOperationType,
  DropTargetSpec,
  EditableDragOperationType,
  ElementModel,
  GraphElement,
  GraphElementProps,
  isNode,
  LabelBadge,
  Layer,
  Node,
  observer,
  Rect,
  TOP_LAYER,
  useAnchor,
  useCombineRefs,
  useHover,
  useDndDrop,
  useDragNode,
  useSelection,
  withContextMenu,
  withSelection,
  WithSelectionProps,
} from '@patternfly/react-topology';
import clsx from 'clsx';
import { FunctionComponent, useContext, useRef } from 'react';
import { IVisualizationNode, NodeToolbarTrigger } from '../../../../models';
import { SettingsContext } from '../../../../providers';
import { CanvasDefaults } from '../../Canvas/canvas.defaults';
import { CanvasNode } from '../../Canvas/canvas.models';
import { StepToolbar } from '../../Canvas/StepToolbar/StepToolbar';
import { NodeContextMenuFn } from '../ContextMenu/NodeContextMenu';
import { TargetAnchor } from '../target-anchor';
import './CustomNode.scss';
import { useEntityContext } from '../../../../hooks/useEntityContext/useEntityContext';

type DefaultNodeProps = Parameters<typeof DefaultNode>[0];
interface CustomNodeProps extends DefaultNodeProps, WithSelectionProps {
  element: GraphElement<ElementModel, CanvasNode['data']>;
  /** Toggle node collapse / expand */
  onCollapseToggle?: () => void;
}

const CustomNode: FunctionComponent<CustomNodeProps> = observer(({ element, onContextMenu, onCollapseToggle }) => {
  if (!isNode(element)) {
    throw new Error('CustomNode must be used only on Node elements');
  }

  const vizNode: IVisualizationNode | undefined = element.getData()?.vizNode;
  const entitiesContext = useEntityContext();
  const settingsAdapter = useContext(SettingsContext);
  const label = vizNode?.getNodeLabel(settingsAdapter.getSettings().nodeLabel);
  const isDisabled = !!vizNode?.getComponentSchema()?.definition?.disabled;
  const tooltipContent = vizNode?.getTooltipContent();
  const validationText = vizNode?.getNodeValidationText();
  const doesHaveWarnings = !isDisabled && !!validationText;
  const [isSelected, onSelect] = useSelection();
  const [isGHover, gHoverRef] = useHover<SVGGElement>();
  const [isToolbarHover, toolbarHoverRef] = useHover<SVGForeignObjectElement>();
  const childCount = element.getAllNodeChildren().length;
  const boxRef = useRef<Rect>(element.getBounds());
  const shouldShowToolbar =
    settingsAdapter.getSettings().nodeToolbarTrigger === NodeToolbarTrigger.onHover
      ? isGHover || isToolbarHover || isSelected
      : isSelected;

  useAnchor((element: Node) => {
    return new TargetAnchor(element);
  }, AnchorEnd.both);

  const labelX = (boxRef.current.width - CanvasDefaults.DEFAULT_LABEL_WIDTH) / 2;
  const toolbarWidth = CanvasDefaults.STEP_TOOLBAR_WIDTH;
  const toolbarX = (boxRef.current.width - toolbarWidth) / 2;
  const toolbarY = CanvasDefaults.STEP_TOOLBAR_HEIGHT * -1;

  if (!vizNode) {
    return null;
  }

  const nodeDragSourceSpec: DragSourceSpec<
    DragObjectWithType,
    DragSpecOperationType<EditableDragOperationType>,
    GraphElement,
    object,
    GraphElementProps
  > = {
    item: { type: '#node#' },
    begin: () => {
      const node = element as Node;

      // Hide connected edges when dragging starts
      node.getSourceEdges().forEach((edge) => edge.setVisible(false));
      node.getTargetEdges().forEach((edge) => edge.setVisible(false));
    },
    canDrag: () => {
      return element.getData()?.vizNode?.canDragNode() ? true : false;
    },
    end: () => {
      const node = element as Node;

      // Show edges again after dropping
      node.getSourceEdges().forEach((edge) => edge.setVisible(true));
      node.getTargetEdges().forEach((edge) => edge.setVisible(true));
    },
  };

  const nodeDropTargetSpec: DropTargetSpec<GraphElement, unknown, object, GraphElementProps> = {
    accept: ['#node#'],
    canDrop: (item) => {
      const targetNode = element as Node;
      const draggedNode = item as Node;
      // Ensure that the node is not dropped onto itself
      return draggedNode !== targetNode;
    },
    drop: (item) => {
      const draggedNodePath = item.getData().vizNode.data.path;

      // Switch the positions of the dragged and target nodes
      element.getData()?.vizNode?.switchSteps(draggedNodePath);

      /** Update entity */
      entitiesContext.updateEntitiesFromCamelResource();
    },
  };

  const [_, dragNodeRef] = useDragNode(nodeDragSourceSpec);
  const gCombinedRef = useCombineRefs<SVGGElement>(gHoverRef, dragNodeRef);
  const [__, dropNodeRef] = useDndDrop(nodeDropTargetSpec);

  return (
    <Layer id={DEFAULT_LAYER}>
      <g
        ref={gCombinedRef}
        className="custom-node"
        data-testid={`custom-node__${vizNode.id}`}
        data-nodelabel={label}
        data-selected={isSelected}
        data-disabled={isDisabled}
        data-warning={doesHaveWarnings}
        onClick={onSelect}
        onContextMenu={onContextMenu}
      >
        <foreignObject
          data-nodelabel={label}
          width={boxRef.current.width}
          height={boxRef.current.height}
          ref={dropNodeRef}
        >
          <div className="custom-node__container">
            <div title={tooltipContent} className="custom-node__container__image">
              <img src={vizNode.data.icon} />

              {isDisabled && (
                <Icon className="disabled-step-icon">
                  <BanIcon />
                </Icon>
              )}
            </div>
          </div>
        </foreignObject>

        <foreignObject
          x={labelX}
          y={boxRef.current.height - 1}
          width={CanvasDefaults.DEFAULT_LABEL_WIDTH}
          height={CanvasDefaults.DEFAULT_LABEL_HEIGHT}
        >
          <div
            className={clsx('custom-node__label', {
              'custom-node__label__error': doesHaveWarnings,
            })}
          >
            {doesHaveWarnings && (
              <Icon title={validationText}>
                <ExclamationCircleIcon />
              </Icon>
            )}
            <span title={label}>{label}</span>
          </div>
        </foreignObject>

        {shouldShowToolbar && (
          <Layer id={TOP_LAYER}>
            <foreignObject
              ref={toolbarHoverRef}
              className="custom-node__toolbar"
              x={toolbarX}
              y={toolbarY}
              width={toolbarWidth}
              height={CanvasDefaults.STEP_TOOLBAR_HEIGHT}
            >
              <StepToolbar
                data-testid="step-toolbar"
                vizNode={vizNode}
                isCollapsed={element.isCollapsed()}
                onCollapseToggle={onCollapseToggle}
              />
            </foreignObject>
          </Layer>
        )}

        {childCount && <LabelBadge badge={`${childCount}`} x={0} y={0} />}
      </g>
    </Layer>
  );
});

export const CustomNodeWithSelection = withSelection()(withContextMenu(NodeContextMenuFn)(CustomNode));
