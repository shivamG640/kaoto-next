import { ICamelElementLookupResult } from '../../support/camel-component-types';
import { RootNodeMapper } from '../root-node-mapper';
import { LoadBalanceNodeMapper } from './loadbalance-node-mapper';
import { MulticastNodeMapper } from './multicast-node-mapper';

describe('ParallelProcessorBaseNodeMapper', () => {
  let mapper: MulticastNodeMapper | LoadBalanceNodeMapper;
  let path: string;
  let routeDefinition: unknown;

  describe('with multicast', () => {
    beforeEach(() => {
      const rootNodeMapper = new RootNodeMapper();
      rootNodeMapper.registerDefaultMapper(mapper);

      mapper = new MulticastNodeMapper(rootNodeMapper);

      path = 'from.steps.0.multicast';
    });

    describe('getVizNodeFromProcessor', () => {
      it('should return a VisualizationNode', () => {
        routeDefinition = {
          from: {
            uri: 'timer:timerName',
            steps: [
              {
                multicast: {
                  id: 'multicast-123',
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
          processorName: 'multicast',
          isGroup: true,
        });
      });

      it('should return a VisualizationNode with children', () => {
        routeDefinition = {
          from: {
            uri: 'timer:timerName',
            steps: [
              {
                multicast: {
                  id: 'multicast-123',
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
      it('should return a VisualizationNode', () => {
        routeDefinition = {
          from: {
            uri: 'timer:timerName',
            steps: [
              {
                loadBalance: {
                  id: 'loadBalance-123',
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
          processorName: 'loadBalance',
          isGroup: true,
        });
      });

      it('should return a VisualizationNode with children', () => {
        routeDefinition = {
          from: {
            uri: 'timer:timerName',
            steps: [
              {
                loadBalance: {
                  id: 'loadBalance-123',
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
    });
  });
});
