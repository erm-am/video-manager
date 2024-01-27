import { Job, Queue, Worker } from 'bullmq';
import { RedisConnectionOptions } from '@/configs/redis.connection.config.js';

export const setupVideoAnalyzerQueue = (queueName: string, redisConnectionOptions: RedisConnectionOptions) =>
  new Queue(queueName, { connection: redisConnectionOptions });
