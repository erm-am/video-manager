import { videoConverter } from '@/modules/video-manager/converter/index.js';
import { TransformedFileTableRow, VideoResolution } from '@/types.js';
import { Job } from 'bullmq';

type ResizeJob = {
  targetResolution: VideoResolution;
  uploadId: number;
  file: TransformedFileTableRow;
};
type MergeJob = {
  uploadId: number;
  files: TransformedFileTableRow[];
  outputFileName: string;
};

const createResizerProcessor = () => {
  return async (job: Job<ResizeJob>) => {
    await videoConverter.scaleVideo(job.data.targetResolution, job.data.file.path);
    return { message: 'Video size has been changed' };
  };
};

const createMergerProcessor = () => {
  return async (job: Job<MergeJob>) => {
    const files = job.data.files;
    const outputFileName = job.data.outputFileName;
    const result = await videoConverter.mergeVideos(files, outputFileName);
    return { message: 'Videos have been merged', result };
  };
};

export { createResizerProcessor, createMergerProcessor };
