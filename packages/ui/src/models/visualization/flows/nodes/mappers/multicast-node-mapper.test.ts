import { RouteDefinition } from '@kaoto/camel-catalog/types';
import { RootNodeMapper } from '../root-node-mapper';
import { noopNodeMapper } from './testing/noop-node-mapper';
import { MulticastNodeMapper } from './multicast-node-mapper';

describe('MulticastNodeMapper', () => {
  let mapper: MulticastNodeMapper;
  let routeDefinition: RouteDefinition;
  const path = 'from.steps.0.multicast';

  beforeEach(() => {
    const rootNodeMapper = new RootNodeMapper();
    rootNodeMapper.registerDefaultMapper(mapper);
    rootNodeMapper.registerMapper('log', noopNodeMapper);

    mapper = new MulticastNodeMapper(rootNodeMapper);

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
                    message: 'test'
                  }
                },
                {
                  log: {
                    id: 'log-456',
                    message: 'test'
                  }
                }
              ]
            },
          },
        ],
      },
    };
  });

  it('should return children', () => {
    const vizNode = mapper.getVizNodeFromProcessor(path, { processorName: 'multicast' }, routeDefinition);

    expect(vizNode.getChildren()).toHaveLength(2);
  });
});
