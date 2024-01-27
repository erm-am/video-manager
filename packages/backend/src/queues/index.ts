import { REDIS_CONNECTION } from '@/configs/redis.connection.config.js';
import { createVideoAnalyzerQueue } from './video-analyzer/index.js';

export const videoAnalyzerQueue = createVideoAnalyzerQueue(10, REDIS_CONNECTION);
