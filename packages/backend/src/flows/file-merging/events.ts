import { QueueEvents } from 'bullmq';
import { fileManegerService } from '@/modules/file-manager/file-manager.service.js';
import { Job, Queue } from 'bullmq';
import { MergeStatus, ResizeStatus } from '@/types.js';

const setupResizeEvents = (queue: Queue) => {
  const queueEvents = new QueueEvents(queue.name);

  queueEvents.on('completed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ResizeStatus.Completed);
      await fileManegerService.updateFileResolution(job.data.file.id, job.data.targetResolution);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('active', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ResizeStatus.InProgress);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('failed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ResizeStatus.Failed);
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
    } else {
      throw new Error('Invalid job id');
    }
  });
  queueEvents.on('active', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, MergeStatus.InProgress);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('completed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, MergeStatus.Completed);
    } else {
      throw new Error('Invalid job id');
    }
  });

  {
    queueEvents.on('failed', async ({ jobId }) => {
      const job = await Job.fromId(queue, jobId);
      if (job) {
        await fileManegerService.updateUploadStatus(job.data.uploadId, MergeStatus.Failed);
      } else {
        console.log('Error');
      }
    });

    return queueEvents;
  }
};
export { setupResizeEvents, setupMergeEvents };
