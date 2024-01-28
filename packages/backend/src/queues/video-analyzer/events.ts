import { prisma } from '@/configs/prisma-connection.config.js';
import { fileManegerService } from '@/modules/file-manager/file-manager.service.js';
import { Job, Queue, Worker } from 'bullmq';
import { VideoAnalyzerJobData, VideoAnalyzerJobResult } from './types.js';
type QueueEvents = {
  onWaiting: (job: Job<VideoAnalyzerJobData>) => void;
};
type WorkerEvents = {
  onActive: (job: Job<VideoAnalyzerJobData>) => void;
  onCompleted: (job: Job<VideoAnalyzerJobData>, result: VideoAnalyzerJobResult) => void;
  onFailed: (job?: Job<VideoAnalyzerJobData>, error?: Error) => void;
};

const queueEvents: QueueEvents = {
  onWaiting: async (job) => {
    await fileManegerService.updateFileStatus(job.data.fileId, 'waiting');
  },
};
const workerEvents: WorkerEvents = {
  onActive: async (job) => {
    await fileManegerService.updateFileStatus(job.data.fileId, 'active');
  },
  onCompleted: async (job, data) => {
    await fileManegerService.updateFileProperties(job.data.fileId, 'completed', data.result);
  },
  onFailed: async (job?: Job) => {
    if (job) {
      await fileManegerService.updateFileStatus(job.data.fileId, 'failed');
    }
  },
};

const attachEventsToQueue = (queue: Queue) => {
  queue.on('waiting', queueEvents.onWaiting);
};
const attachEventsToWorkers = (workers: Worker[]) => {
  workers.forEach((worker) => {
    worker.on('active', workerEvents.onActive);
    worker.on('completed', workerEvents.onCompleted);
    worker.on('failed', workerEvents.onFailed);
  });
};

export { attachEventsToQueue, attachEventsToWorkers };
