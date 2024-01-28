import { videoAnalizer } from '@/modules/video-manager/analyzer/index.js';
import { Job } from 'bullmq';
import { MergeVideoFilesJobData } from './types.js';
import { videoConverter } from '@/modules/video-manager/converter/index.js';
import { videoManager } from '@/modules/video-manager/video-manager.service.js';
import path from 'path';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const setupMergeVideoFilesProcessor = (queueName: string) => {
  return async (job: Job<MergeVideoFilesJobData>) => {
    const { uploadId, files } = job.data;
    await sleep(4000);
    const result = await videoManager.merge({ files, outputVideoPath: path.resolve(process.cwd(), 'todo1.mp4') });

    return {
      queueName,
      job: { id: job.id, name: job.name, data: job.data },
      result,
    };
  };
};
