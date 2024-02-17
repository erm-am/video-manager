import { FlowProducer } from 'bullmq';
import { createQueue, createWorkers, getNames } from '../factories.js';
import { REDIS_CONNECTION, RedisConnectionOptions } from '@/configs/redis.connection.config.js';
import { createResizerProcessor, createMergerProcessor } from './processors.js';
import { setupResizeEvents, setupMergeEvents } from './events.js';
import { VideoResolution, TransformedFileTableRow } from '@/types.js';

type StartToMergeWithResizeOptions = {
  uploadId: number;
  userId: number;
  files: TransformedFileTableRow[];
  targetResolution: VideoResolution;
  videosToResize: TransformedFileTableRow[];
  outputFileName: string;
};

type StartToMergeOptions = {
  uploadId: number;
  userId: number;
  files: TransformedFileTableRow[];
  outputFileName: string;
};

const setupFileMergingFlow = (redisConnectionOptions: RedisConnectionOptions) => {
  const flow = new FlowProducer({ connection: REDIS_CONNECTION });

  const resizeNames = getNames('resize');
  const mergeNames = getNames('merge');

  const resizeQueue = createQueue({ queueName: resizeNames.queueName, redisConnectionOptions });
  const mergeQueue = createQueue({ queueName: mergeNames.queueName, redisConnectionOptions });

  const resizeProcessor = createResizerProcessor();
  const mergeProcessor = createMergerProcessor();

  const resizeWorkers = createWorkers({
    queueName: resizeNames.queueName,
    processor: resizeProcessor,
    redisConnectionOptions,
    workerLimit: 10,
  });
  const mergeWorkers = createWorkers({
    queueName: mergeNames.queueName,
    processor: mergeProcessor,
    redisConnectionOptions,
  });

  const resizeEvents = setupResizeEvents(resizeQueue);
  const mergeEvents = setupMergeEvents(mergeQueue);

  const startToMergeWithResize = (options: StartToMergeWithResizeOptions) => {
    const { files, uploadId, userId, targetResolution, videosToResize } = options;
    return flow.add({
      name: mergeNames.jobName,
      queueName: mergeNames.queueName,
      data: { uploadId, files, userId },
      children: videosToResize.map((file) => {
        return {
          name: resizeNames.jobName,
          queueName: resizeNames.queueName,
          data: { targetResolution, uploadId, file, userId },
        };
      }),
    });
  };

  const startToMerge = (options: StartToMergeOptions) => {
    const { files, uploadId, userId, outputFileName } = options;
    return flow.add({
      name: mergeNames.jobName,
      queueName: mergeNames.queueName,
      data: {
        files,
        uploadId,
        userId,
        outputFileName,
      },
    });
  };

  return {
    actions: { startToMerge, startToMergeWithResize },
    queues: [resizeQueue, mergeQueue],
    workers: [resizeWorkers, mergeWorkers],
    events: [resizeEvents, mergeEvents],
  };
};

export { setupFileMergingFlow };
