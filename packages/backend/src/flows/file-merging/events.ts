import { QueueEvents } from 'bullmq';
import { fileManegerService } from '@/modules/file-manager/file-manager.service.js';
import { Job, Queue } from 'bullmq';
import { MergeStatus, ResizeStatus } from '@/types.js';
import { socketManager } from '@/sockets/manager.js';

const setupResizeEvents = (queue: Queue) => {
  const queueEvents = new QueueEvents(queue.name);

  queueEvents.on('completed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ResizeStatus.Completed);
      await fileManegerService.updateFileResolution(job.data.file.id, job.data.targetResolution);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('active', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ResizeStatus.InProgress);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('failed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ResizeStatus.Failed);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      console.log('error');
    }
  });

  return queueEvents;
};

const setupMergeEvents = (queue: Queue) => {
  const queueEvents = new QueueEvents(queue.name);

  queueEvents.on('waiting-children', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, ResizeStatus.InProgress);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });
  queueEvents.on('active', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, MergeStatus.InProgress);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('completed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, MergeStatus.Completed);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });

  {
    queueEvents.on('failed', async ({ jobId }) => {
      const job = await Job.fromId(queue, jobId);
      if (job) {
        await fileManegerService.updateUploadStatus(job.data.uploadId, MergeStatus.Failed);
        await socketManager.sendUploadListToClient(job.data.userId);
      } else {
        console.log('Error');
      }
    });

    return queueEvents;
  }
};
export { setupResizeEvents, setupMergeEvents };
