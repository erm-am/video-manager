import { prisma } from '@/configs/prisma-connection.config.js';
import { fileManegerService } from '@/modules/file-manager/file-manager.service.js';
import { Job, Queue, Worker } from 'bullmq';
type QueueEvents = {
  onWaiting: (job: Job) => void;
};
type WorkerEvents = {
  onActive: (job: Job) => void;
  onCompleted: (job: Job, result: any) => void;
  onFailed: (job?: Job, error?: Error) => void;
};

const queueEvents: QueueEvents = {
  onWaiting: async (job: Job) => {
    await fileManegerService.updateFileStatus(job.data.fileId, 'waiting');
  },
};
const workerEvents: WorkerEvents = {
  onActive: async (job: Job) => {
    await fileManegerService.updateFileStatus(job.data.fileId, 'active');
  },
  onCompleted: async (job: Job) => {
    await fileManegerService.updateFileStatus(job.data.fileId, 'completed');
  },
  onFailed: async (job?: Job, error?: Error) => {
    await fileManegerService.updateFileStatus(job?.data?.fileId, 'failed');
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
