import { VisualizationProvider } from '@patternfly/react-topology';
import {
  BreadthFirstLayout,
  ColaGroupsLayout,
  ColaLayout,
  ComponentFactory,
  ConcentricLayout,
  DragObjectWithType,
  DragSourceSpec,
  DragSpecOperationType,
  DropTargetSpec,
  EditableDragOperationType,
  GraphElementProps,
  DagreGroupsLayout,
  DefaultEdge,
  ForceLayout,
  Graph,
  GraphComponent,
  GraphElement,
  GridLayout,
  Layout,
  LEFT_TO_RIGHT,
  ModelKind,
  TOP_TO_BOTTOM,
  Visualization as TopologyVisualization,
  withPanZoom,
  withDndDrop,
  withDragNode,
} from '@patternfly/react-topology';

import { FunctionComponent, PropsWithChildren, ReactNode, useContext, useMemo } from 'react';
import { BaseVisualCamelEntity } from '../../models/visualization/base-visual-entity';
import { CanvasFormTabsProvider, EntitiesContext } from '../../providers';
import { ErrorBoundary } from '../ErrorBoundary';
import { Canvas, LayoutType } from './Canvas';
import { CanvasFallback } from './CanvasFallback';
import { ContextToolbar } from './ContextToolbar/ContextToolbar';
import './Visualization.scss';
import { CustomGroupWithSelection, CustomNodeWithSelection, EdgeEndWithButton, NoBendpointsEdge } from './Custom';

interface CanvasProps {
  className?: string;
  entities: BaseVisualCamelEntity[];
  fallback?: ReactNode;
}

const baselineElementFactory = (kind: ModelKind): GraphElement | undefined => {
  switch (kind) {
    case ModelKind.edge:
      return new NoBendpointsEdge();
    default:
      return undefined;
  }
};

const baselineLayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  switch (type) {
    case LayoutType.BreadthFirst:
      return new BreadthFirstLayout(graph);
    case LayoutType.Cola:
      return new ColaLayout(graph);
    case LayoutType.ColaNoForce:
      return new ColaLayout(graph, { layoutOnDrag: false });
    case LayoutType.Concentric:
      return new ConcentricLayout(graph);
    case LayoutType.DagreVertical:
      return new DagreGroupsLayout(graph, {
        rankdir: TOP_TO_BOTTOM,
        ranker: 'network-simplex',
        nodesep: 20,
        edgesep: 20,
        ranksep: 0,
      });
    case LayoutType.DagreHorizontal:
      return new DagreGroupsLayout(graph, {
        rankdir: LEFT_TO_RIGHT,
        ranker: 'network-simplex',
        nodesep: 20,
        edgesep: 20,
        ranksep: 0,
      });
    case LayoutType.Force:
      return new ForceLayout(graph);
    case LayoutType.Grid:
      return new GridLayout(graph);
    case LayoutType.ColaGroups:
      return new ColaGroupsLayout(graph, { layoutOnDrag: false });
    default:
      return new ColaLayout(graph, { layoutOnDrag: false });
  }
};

export const Visualization: FunctionComponent<PropsWithChildren<CanvasProps>> = (props) => {
  const entitiesContext = useContext(EntitiesContext)!;

  const nodeDropTargetSpec: DropTargetSpec<GraphElement, unknown, object, GraphElementProps> = {
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

      // Swap the positions of the dragged and target nodes
      targetNode.getData().vizNode.rearrangeSteps(draggedNode.getData().vizNode);

      /** Update entity */
      entitiesContext.updateEntitiesFromCamelResource();

      return targetNode;
    },
  };

  const nodeDragSourceSpec: DragSourceSpec<
    DragObjectWithType,
    DragSpecOperationType<EditableDragOperationType>,
    GraphElement,
    object,
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

  const baselineComponentFactory = (kind: ModelKind, type: string): ReturnType<ComponentFactory> => {
    switch (type) {
      case 'group':
        return CustomGroupWithSelection;
      case 'edge-end':
        return EdgeEndWithButton;
      default:
        switch (kind) {
          case ModelKind.graph:
            return withPanZoom()(GraphComponent);
          case ModelKind.node:
            return withDndDrop(nodeDropTargetSpec)(withDragNode(nodeDragSourceSpec)(CustomNodeWithSelection));
          case ModelKind.edge:
            return DefaultEdge;
          default:
            return undefined;
        }
    }
  };

  const controller = useMemo(() => {
    const newController = new TopologyVisualization();

    newController.registerLayoutFactory(baselineLayoutFactory);
    newController.registerComponentFactory(baselineComponentFactory);
    newController.registerElementFactory(baselineElementFactory);
    newController.setFitToScreenOnLayout(true, 80);
    newController.fromModel({
      graph: {
        id: 'g1',
        type: 'graph',
      },
    });

    return newController;
  }, []);

  return (
    <VisualizationProvider controller={controller}>
      <div className={`canvas-surface ${props.className ?? ''}`}>
        <CanvasFormTabsProvider>
          <ErrorBoundary fallback={props.fallback ?? <CanvasFallback />}>
            <Canvas contextToolbar={<ContextToolbar />} entities={props.entities} />
          </ErrorBoundary>
        </CanvasFormTabsProvider>
      </div>
    </VisualizationProvider>
  );
};
