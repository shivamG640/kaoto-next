import { getUserUpdatedPropertiesSchema } from '.';
import { KaotoSchemaDefinition } from '../models/kaoto-schema';

describe('getUserUpdatedPropertiesSchema()', () => {
  const schema = {
    type: 'object',
    properties: {
      id: {
        title: 'Id',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      uri: {
        title: 'Uri',
        type: 'string',
      },
      variableReceive: {
        title: 'Variable Receive',
        type: 'string',
      },
      parameters: {
        type: 'object',
        title: 'Endpoint Properties',
        description: 'Endpoint properties description',
        properties: {
          timerName: {
            title: 'Timer Name',
            type: 'string',
          },
          delay: {
            title: 'Delay',
            type: 'string',
            default: '1000',
          },
          fixedRate: {
            title: 'Fixed Rate',
            type: 'boolean',
            default: false,
          },
          includeMetadata: {
            title: 'Include Metadata',
            type: 'boolean',
            default: false,
          },
          period: {
            title: 'Period',
            type: 'string',
            default: '1000',
          },
          repeatCount: {
            title: 'Repeat Count',
            type: 'integer',
          },
          exceptionHandler: {
            title: 'Exception Handler',
            type: 'string',
            $comment: 'class:org.apache.camel.spi.ExceptionHandler',
          },
          exchangePattern: {
            title: 'Exchange Pattern',
            type: 'string',
            enum: ['InOnly', 'InOut'],
          },
          synchronous: {
            title: 'Synchronous',
            type: 'boolean',
            default: false,
          },
          timer: {
            title: 'Timer',
            type: 'string',
            $comment: 'class:java.util.Timer',
          },
          runLoggingLevel: {
            title: 'Run Logging Level',
            type: 'string',
            default: 'TRACE',
            enum: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'],
          },
        },
        required: ['timerName'],
      },
    },
  } as unknown as KaotoSchemaDefinition['schema'];

  const inputModel: Record<string, unknown> = {
    id: 'from-2860',
    uri: 'timer',
    variableReceive: 'test',
    parameters: {
      period: '1000',
      timerName: 'template',
      exceptionHandler: '#test',
      exchangePattern: 'InOnly',
      fixedRate: true,
      runLoggingLevel: 'OFF',
      repeatCount: '2',
      time: undefined,
      timer: '#testbean',
    },
    steps: [
      {
        log: {
          id: 'log-2942',
          message: 'template message',
        },
      },
    ],
  };

  const expectedSchema = {
    id: {
      title: 'Id',
      type: 'string',
    },
    uri: {
      title: 'Uri',
      type: 'string',
    },
    parameters: {
      type: 'object',
      title: 'Endpoint Properties',
      description: 'Endpoint properties description',
      properties: {
        timerName: {
          title: 'Timer Name',
          type: 'string',
        },
        fixedRate: {
          title: 'Fixed Rate',
          type: 'boolean',
          default: false,
        },
        repeatCount: {
          title: 'Repeat Count',
          type: 'integer',
        },
        exceptionHandler: {
          title: 'Exception Handler',
          type: 'string',
          $comment: 'class:org.apache.camel.spi.ExceptionHandler',
        },
        exchangePattern: {
          title: 'Exchange Pattern',
          type: 'string',
          enum: ['InOnly', 'InOut'],
        },
        timer: {
          title: 'Timer',
          type: 'string',
          $comment: 'class:java.util.Timer',
        },
        runLoggingLevel: {
          title: 'Run Logging Level',
          type: 'string',
          default: 'TRACE',
          enum: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'],
        },
      },
      required: ['timerName'],
    },
  };

  it('should return only the properties which are user Modified', () => {
    const procesedSchema = getUserUpdatedPropertiesSchema(schema.properties!, inputModel);
    expect(procesedSchema).toMatchObject(expectedSchema);
  });
});
