import { REDIS_CONNECTION, RedisConnectionOptions } from '@/configs/redis.connection.config.js';
import { setupVideoAnalyzerQueue } from './queue.js';
import { setupVideoAnalyzerWorkers } from './worker.js';
import { Job } from 'bullmq';
import { videoAnalizer } from '@/modules/video-manager/analyzer/index.js';
import { attachEventsToQueue, attachEventsToWorkers } from './events.js';
import { setupVideoAnalyzerProcessor } from './processors.js';

export const createVideoAnalyzerQueue = (maxWorkers: number = 10, connection: RedisConnectionOptions) => {
  const queueName = 'video-analyzer';
  const processor = setupVideoAnalyzerProcessor(queueName);
  const queue = setupVideoAnalyzerQueue(queueName, connection);
  const workers = setupVideoAnalyzerWorkers(queueName, connection, maxWorkers, processor);

  attachEventsToQueue(queue);
  attachEventsToWorkers(workers);
  return queue;
};
