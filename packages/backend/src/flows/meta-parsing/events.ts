import { QueueEvents } from 'bullmq';
import { fileManegerService } from '@/modules/file-manager/file-manager.service.js';
import { Job, Queue } from 'bullmq';
import { ExcludeNull, ParsingMetaStatus, TransformedFileTableRow } from '@/types.js';

const setupUploadStatusChangerEvents = (queue: Queue) => {
  const queueEvents = new QueueEvents(queue.name);

  queueEvents.on('waiting-children', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, ParsingMetaStatus.InProgress);
    } else {
      throw new Error('Invalid job id');
    }
  });
  queueEvents.on('completed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, ParsingMetaStatus.Completed);
    } else {
      throw new Error('Invalid job id');
    }
  });

  queueEvents.on('failed', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateUploadStatus(job.data.uploadId, ParsingMetaStatus.Failed);
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
    } else {
      throw new Error('Invalid job id');
    }
  });
  queueEvents.on('waiting', async ({ jobId }) => {
    const job = await Job.fromId(queue, jobId);
    if (job) {
      await fileManegerService.updateFileStatus(job.data.file.id, ParsingMetaStatus.Waiting);
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
    } else {
      throw new Error('Invalid job id');
    }
  });

  {
    queueEvents.on('failed', async ({ jobId }) => {
      const job = await Job.fromId(queue, jobId);
      if (job) {
        await fileManegerService.updateFileStatus(job.data.file.id, ParsingMetaStatus.Failed);
      } else {
        console.log('Error');
      }
    });

    return queueEvents;
  }
};
export { setupUploadStatusChangerEvents, setupMetaParserEvents };
