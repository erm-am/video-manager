import { Queue } from 'bullmq';
import { RedisConnectionOptions } from '@/configs/redis.connection.config.js';

export const setupMergeVideoFilesQueue = (queueName: string, redisConnectionOptions: RedisConnectionOptions) =>
  new Queue(queueName, { connection: redisConnectionOptions });
