import { RedisConnectionOptions } from '@/configs/redis.connection.config.js';
import { videoAnalizer } from '@/modules/video-manager/analyzer/index.js';
import { Job, Processor, Queue, Worker } from 'bullmq';

export const createVideoAnalyzerWorker = (queueName: string, redisOptions: RedisConnectionOptions, processor: Processor) => {
  return new Worker(queueName, processor, { connection: redisOptions });
};

export const setupVideoAnalyzerWorkers = (
  queueName: string,
  redisOptions: RedisConnectionOptions,
  workerLimit: number,
  processor: Processor,
) => {
  return Array.from({ length: workerLimit }, () => {
    return createVideoAnalyzerWorker(queueName, redisOptions, processor);
  });
};
