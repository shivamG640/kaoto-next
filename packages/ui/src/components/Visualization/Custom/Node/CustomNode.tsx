import { Tooltip } from '@patternfly/react-core';
import { BanIcon } from '@patternfly/react-icons';
import {
  Decorator,
  DefaultNode,
  DragObjectWithType,
  DragSourceSpec,
  DragSpecOperationType,
  DropTargetSpec,
  EditableDragOperationType,
  GraphElement,
  GraphElementProps,
  Node,
  NodeStatus,
  ScaleDetailsLevel,
  WithSelectionProps,
  observer,
  useSelection,
  withContextMenu,
  withSelection,
  withDndDrop,
  withDragNode,
} from '@patternfly/react-topology';
import clsx from 'clsx';
import { FunctionComponent, useContext } from 'react';
import { SettingsContext } from '../../../../providers';
import { doTruncateLabel } from '../../../../utils/truncate-label';
import { CanvasDefaults } from '../../Canvas/canvas.defaults';
import { CanvasNode } from '../../Canvas/canvas.models';
import './CustomNode.scss';
import { NodeContextMenuFn } from '../ContextMenu/NodeContextMenu';

interface CustomNodeProps extends WithSelectionProps {
  element: Node<CanvasNode, CanvasNode['data']>;
}
const noopFn = () => {};

const CustomNode: FunctionComponent<CustomNodeProps> = observer(({ element, ...rest }) => {
  const vizNode = element.getData()?.vizNode;
  const settingsAdapter = useContext(SettingsContext);
  const label = vizNode?.getNodeLabel(settingsAdapter.getSettings().nodeLabel);
  const isDisabled = !!vizNode?.getComponentSchema()?.definition?.disabled;
  const tooltipContent = vizNode?.getTooltipContent();
  const statusDecoratorTooltip = vizNode?.getNodeValidationText();
  const nodeStatus = !statusDecoratorTooltip || isDisabled ? NodeStatus.default : NodeStatus.warning;
  const detailsLevel = element.getGraph().getDetailsLevel();
  const [selected] = useSelection();
  const id = vizNode?.getTitle();

  return (
    <DefaultNode
      {...rest}
      element={element}
      label={selected ? label : doTruncateLabel(label)}
      scaleLabel={detailsLevel !== ScaleDetailsLevel.low}
      labelClassName={clsx('custom-node__label', {
        'custom-node__label--disabled': isDisabled,
        'custom-node__label--selected': selected,
      })}
      showStatusDecorator={!isDisabled}
      statusDecoratorTooltip={statusDecoratorTooltip}
      nodeStatus={nodeStatus}
      onStatusDecoratorClick={noopFn}
      secondaryLabel={id !== label ? id : undefined}
    >
      <g
        className="custom-node"
        data-testid={`custom-node__${vizNode?.id}`}
        data-nodelabel={label}
        data-disabled={isDisabled}
      >
        <foreignObject
          x="0"
          y="0"
          width={CanvasDefaults.DEFAULT_NODE_DIAMETER}
          height={CanvasDefaults.DEFAULT_NODE_DIAMETER}
        >
          <Tooltip content={tooltipContent}>
            <div className="custom-node__image">
              <img src={vizNode?.data.icon} />
            </div>
          </Tooltip>
        </foreignObject>

        {isDisabled && (
          <Decorator
            radius={12}
            x={CanvasDefaults.DEFAULT_NODE_DIAMETER}
            y={0}
            icon={<BanIcon className="custom-node--disabled" />}
            showBackground
          />
        )}
      </g>
    </DefaultNode>
  );
});

const nodeDropTargetSpec: DropTargetSpec<
GraphElement,
any,
{},
GraphElementProps
> = {
      accept: ['#node#'],
      canDrop: (item, monitor, props) => {
        const targetNode = props.element as Node;
        const draggedNode = monitor.getItem() as Node;
        // Ensure that the node is not dropped onto itself
        return draggedNode !== targetNode;
      },
      drop: (item, monitor, props) => {
        const draggedNode = item as Node;
        const targetNode = props.element as Node;
        // console.log(targetNode);
        // console.log(draggedNode);
        // Swap the positions of the dragged and target nodes
        targetNode.getData().vizNode.rearrangeSteps(draggedNode.getData().vizNode);

        return targetNode;
      }
    };

    const nodeDragSourceSpec: DragSourceSpec<
    DragObjectWithType,
    DragSpecOperationType<EditableDragOperationType>,
    GraphElement,
    {},
    GraphElementProps
  > = {
      item: { type: '#node#' },
      begin: (monitor, props) => {
        const node = props.element as Node;

        // Hide connected edges when dragging starts
        // node.getSourceEdges().forEach((edge) => edge.setVisible(false));
        // node.getTargetEdges().forEach((edge) => edge.setVisible(false));
        return props.element;
      },
      end: (dropResult, monitor, props) => {
        const node = props.element as Node;
        // reshuffle nodes
        if (monitor.didDrop() && dropResult && props) {
          // console.log(dropResult, node);
        }

        // Show edges again after dropping
        // node.getSourceEdges().forEach((edge) => edge.setVisible(true));
        // node.getTargetEdges().forEach((edge) => edge.setVisible(true));
      },
    };

export const CustomNodeWithSelection = withSelection()(withDndDrop(nodeDropTargetSpec)(withDragNode(nodeDragSourceSpec
  )(withContextMenu(NodeContextMenuFn)(CustomNode as typeof DefaultNode))),
) as typeof DefaultNode;
