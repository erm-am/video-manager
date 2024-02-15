import { FlowProducer } from 'bullmq';
import { createQueue, createWorkers, getNames } from '../factories.js';
import { REDIS_CONNECTION, RedisConnectionOptions } from '@/configs/redis.connection.config.js';
import { createMetaParserProcessor, createUploadStatusChangerProcessor } from './processors.js';
import { setupUploadStatusChangerEvents, setupMetaParserEvents } from './events.js';
import { TransformedFileTableRow } from '@/types.js';

const setupMetaParsingFlow = (redisConnectionOptions: RedisConnectionOptions) => {
  const flow = new FlowProducer({ connection: REDIS_CONNECTION });

  const metaParserNames = getNames('meta-parser');
  const uploadStatusChangerNames = getNames('upload-status-changer');

  const metaParserQueue = createQueue({ queueName: metaParserNames.queueName, redisConnectionOptions });
  const uploadStatusChangerQueue = createQueue({ queueName: uploadStatusChangerNames.queueName, redisConnectionOptions });

  const metaParserProcessor = createMetaParserProcessor();
  const uploadStatusChangerProcessor = createUploadStatusChangerProcessor();

  const metaParserWorkers = createWorkers({
    queueName: metaParserNames.queueName,
    processor: metaParserProcessor,
    redisConnectionOptions,
    workerLimit: 10,
  });
  const uploadStatusChangerWorkers = createWorkers({
    queueName: uploadStatusChangerNames.queueName,
    processor: uploadStatusChangerProcessor,
    redisConnectionOptions,
  });

  const uploadStatusChangerEvents = setupUploadStatusChangerEvents(uploadStatusChangerQueue);
  const metaParserEvents = setupMetaParserEvents(metaParserQueue);

  const startToParseMeta = (fileList: TransformedFileTableRow[], uploadId: number) => {
    return flow.add({
      name: uploadStatusChangerNames.jobName,
      queueName: uploadStatusChangerNames.queueName,
      data: { uploadId },
      children: fileList.map((file) => {
        return {
          name: metaParserNames.jobName,
          queueName: metaParserNames.queueName,
          data: { file, uploadId },
        };
      }),
    });
  };

  return {
    actions: { startToParseMeta },
    queues: [metaParserQueue, uploadStatusChangerQueue],
    workers: [metaParserWorkers, uploadStatusChangerWorkers],
    events: [metaParserEvents, uploadStatusChangerEvents],
  };
};

export { setupMetaParsingFlow };
