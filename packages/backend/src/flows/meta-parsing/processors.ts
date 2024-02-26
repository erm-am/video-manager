import { videoAnalizer } from '@/modules/video-manager/analyzer/index.js';
import { FileRow } from '@/types.js';
import { utils } from '@/utils/core.utils.js';
import { Job } from 'bullmq';

type MetaParserJob = {
  file: FileRow;
  uploadId: number;
  userId: number;
};
type UploadStatusChangerJob = {
  uploadId: number;
  userId: number;
};

export const createMetaParserProcessor = () => {
  return async (job: Job<MetaParserJob>) => {
    const updatedFileProperties = await videoAnalizer.getMetaData(job.data.file);
    return { message: 'Video metadata has been parsed', updatedFileProperties };
  };
};
export const createUploadStatusChangerProcessor = () => {
  return async (job: Job<UploadStatusChangerJob>) => {
    return { message: 'Upload status has been changed', uploadId: job.data.uploadId };
  };
};
