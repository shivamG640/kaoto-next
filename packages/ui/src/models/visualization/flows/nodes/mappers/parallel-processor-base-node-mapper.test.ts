import { createVisualizationNode } from '../../../visualization-node';
import { ICamelElementLookupResult } from '../../support/camel-component-types';
import { RootNodeMapper } from '../root-node-mapper';
import { LoadBalanceNodeMapper } from './loadbalance-node-mapper';
import { MulticastNodeMapper } from './multicast-node-mapper';

describe('ParallelProcessorBaseNodeMapper', () => {
  let mapper: MulticastNodeMapper | LoadBalanceNodeMapper;
  let path: string;
  let routeDefinition: unknown;

  const testGetVizNodeFromProcessor = (processorName: string) => {
    it(`should return a VisualizationNode for ${processorName}`, () => {
      routeDefinition = {
        from: {
          uri: 'timer:timerName',
          steps: [
            {
              [processorName]: {
                id: `${processorName}-test`,
              },
            },
          ],
        },
      };
      const vizNode = mapper.getVizNodeFromProcessor(path, {} as ICamelElementLookupResult, routeDefinition);

      expect(vizNode).toBeDefined();
      expect(vizNode.data).toMatchObject({
        path,
        icon: expect.any(String),
        processorName,
        isGroup: true,
      });
    });

    it(`should return a VisualizationNode with children for ${processorName}`, () => {
      routeDefinition = {
        from: {
          uri: 'timer:timerName',
          steps: [
            {
              [processorName]: {
                id: `${processorName}-123`,
                steps: [
                  {
                    log: {
                      id: 'log-123',
                      message: 'test',
                    },
                  },
                  {
                    log: {
                      id: 'log-456',
                      message: 'test',
                    },
                  },
                ],
              },
            },
          ],
        },
      };

      const vizNode = mapper.getVizNodeFromProcessor(path, {} as ICamelElementLookupResult, routeDefinition);
      expect(vizNode.getChildren()).toHaveLength(2);
      expect(vizNode.getChildren()?.[0].getNextNode()).toBeUndefined();
      expect(vizNode.getChildren()?.[1].getPreviousNode()).toBeUndefined();
    });
  };

  // Common test logic for `addNodeInteraction`
  const testAddNodeInteraction = () => {
    it('should not allow child nodes to have previous/next steps', () => {
      const ParentVizNode = createVisualizationNode('test', {});
      const childVizNode = createVisualizationNode('child', {});
      ParentVizNode.addChild(childVizNode);
      mapper.addNodeInteraction(ParentVizNode, 'log');

      expect(ParentVizNode.getChildren()).toHaveLength(1);
      expect(ParentVizNode.getChildren()?.[0].getNodeInteraction().canHavePreviousStep).toEqual(false);
      expect(ParentVizNode.getChildren()?.[0].getNodeInteraction().canHaveNextStep).toEqual(false);
    });
  };

  describe('with multicast', () => {
    beforeEach(() => {
      const rootNodeMapper = new RootNodeMapper();
      rootNodeMapper.registerDefaultMapper(mapper);

      mapper = new MulticastNodeMapper(rootNodeMapper);

      path = 'from.steps.0.multicast';
    });

    describe('getVizNodeFromProcessor', () => {
      testGetVizNodeFromProcessor('multicast');
    });

    describe('addNodeInteraction', () => {
      testAddNodeInteraction();
    });
  });

  describe('with loadbalance', () => {
    beforeEach(() => {
      const rootNodeMapper = new RootNodeMapper();
      rootNodeMapper.registerDefaultMapper(mapper);

      mapper = new LoadBalanceNodeMapper(rootNodeMapper);

      path = 'from.steps.0.loadBalance';
    });

    describe('getVizNodeFromProcessor', () => {
      testGetVizNodeFromProcessor('loadBalance');
    });

    describe('addNodeInteraction', () => {
      testAddNodeInteraction();
    });
  });
});
