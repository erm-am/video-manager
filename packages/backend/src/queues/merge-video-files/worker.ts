import { RedisConnectionOptions } from '@/configs/redis.connection.config.js';
import { Processor, Worker } from 'bullmq';

export const createMergeVideoFilesWorker = (queueName: string, redisOptions: RedisConnectionOptions, processor: Processor) => {
  return new Worker(queueName, processor, { connection: redisOptions });
};

export const setupMergeVideoFilesWorkers = (
  queueName: string,
  redisOptions: RedisConnectionOptions,
  workerLimit: number,
  processor: Processor,
) => {
  return Array.from({ length: workerLimit }, () => {
    return createMergeVideoFilesWorker(queueName, redisOptions, processor);
  });
};
