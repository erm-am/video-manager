import { REDIS_CONNECTION } from '@/configs/redis.connection.config.js';
import { createVideoAnalyzerQueue } from './video-analyzer/index.js';
import { creatMergeVideoFilesQueue } from './merge-video-files/index.js';

export const videoAnalyzerQueue = createVideoAnalyzerQueue(10, REDIS_CONNECTION);
export const mergeVideoFilesQueue = creatMergeVideoFilesQueue(1, REDIS_CONNECTION);
