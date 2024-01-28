import { videoAnalizer } from '@/modules/video-manager/analyzer/index.js';
import { Job } from 'bullmq';
import { VideoAnalyzerJobData } from './types.js';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const setupVideoAnalyzerProcessor = (queueName: string) => {
  return async (job: Job<VideoAnalyzerJobData>) => {
    const { videoPath } = job.data;
    await sleep(10000);
    const result = await videoAnalizer.getMetaInfo(videoPath);
    return {
      queueName,
      job: { id: job.id, name: job.name, data: job.data },
      result,
    };
  };
};
