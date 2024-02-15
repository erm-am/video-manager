import { RedisConnectionOptions } from '@/configs/redis.connection.config.js';
import { Processor, Queue, Worker } from 'bullmq';

type CreateQueueOptions = {
  queueName: string;
  redisConnectionOptions: RedisConnectionOptions;
};

type CreateWorkerOptions = {
  queueName: string;
  processor: Processor;
  redisConnectionOptions: RedisConnectionOptions;
};

type CreateWorkersOptions = CreateWorkerOptions & {
  workerLimit?: number;
};

export const createQueue = (options: CreateQueueOptions) => new Queue(options.queueName, { connection: options.redisConnectionOptions });

export const createWorker = (options: CreateWorkerOptions) => {
  return new Worker(options.queueName, options.processor, { connection: options.redisConnectionOptions });
};

export const createWorkers = (options: CreateWorkersOptions) => {
  const defaultWorkerLimit = 1;
  const { workerLimit = defaultWorkerLimit, ...workerOptions } = options;
  return Array.from({ length: workerLimit }, () => createWorker(workerOptions));
};

export const getNames = (baseName: string) => {
  return {
    baseName,
    queueName: `${baseName}-queue`,
    jobName: `${baseName}-job`,
  };
};
