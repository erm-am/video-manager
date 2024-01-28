import { RedisConnectionOptions } from '@/configs/redis.connection.config.js';
import { setupMergeVideoFilesQueue } from './queue.js';
import { setupMergeVideoFilesWorkers } from './worker.js';

import { attachEventsToQueue, attachEventsToWorkers } from './events.js';
import { setupMergeVideoFilesProcessor } from './processors.js';

export const creatMergeVideoFilesQueue = (maxWorkers: number = 1, connection: RedisConnectionOptions) => {
  const queueName = 'merge-video-files';
  const processor = setupMergeVideoFilesProcessor(queueName);
  const queue = setupMergeVideoFilesQueue(queueName, connection);
  const workers = setupMergeVideoFilesWorkers(queueName, connection, maxWorkers, processor);

  attachEventsToQueue(queue);
  attachEventsToWorkers(workers);
  return queue;
};
