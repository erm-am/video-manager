import { QueueEvents } from 'bullmq';
import { fileManegerService } from '@/modules/file-manager/file-manager.service.js';
import { Job, Queue } from 'bullmq';
import { ExcludeNull, ParsingMetaStatus, TransformedFileTableRow } from '@/types.js';
import { socketManager } from '@/sockets/manager.js';

const setupUploadStatusChangerEvents = (queue: Queue) => {
  const queueEvents = new QueueEvents(queue.name);

  queueEvents.on('waiting-children', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, ParsingMetaStatus.InProgress);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });
  queueEvents.on('completed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, ParsingMetaStatus.Completed);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('failed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, ParsingMetaStatus.Failed);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      console.log('error');
    }
  });

  return queueEvents;
};

const setupMetaParserEvents = (queue: Queue) => {
  const queueEvents = new QueueEvents(queue.name);
  queueEvents.on('active', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ParsingMetaStatus.InProgress);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });
  queueEvents.on('waiting', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ParsingMetaStatus.Waiting);
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });
  queueEvents.on('completed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileProperties(
        job.data.file.id,
        ParsingMetaStatus.Completed,
        job.returnvalue.metaData as unknown as ExcludeNull<TransformedFileTableRow>,
      );
      await socketManager.sendUploadListToClient(job.data.userId);
    } else {
      throw new Error('Invalid job id');
    }
  });

  {
    queueEvents.on('failed', async ({ jobId }) => {
      const job = await Job.fromId(queue, jobId);
      if (job) {
        await fileManegerService.updateFileStatus(job.data.file.id, ParsingMetaStatus.Failed);
        await socketManager.sendUploadListToClient(job.data.userId);
      } else {
        console.log('Error');
      }
    });

    return queueEvents;
  }
};
export { setupUploadStatusChangerEvents, setupMetaParserEvents };
