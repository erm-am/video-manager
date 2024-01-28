import { VideoMeta } from '@/modules/video-manager/types.js';

export type MergeVideoFilesJobData = {
  files: VideoMeta[];
  uploadId: string;
};

export type MergeVideoFilesResultJobData = {
  path: string;
  width: number;
  height: number;
  duration: number;
  displayAspectRatio: string;
  bitRate: number;
};

export type MergeVideoFilesJobResult = {
  queueName: string;
  job: {
    id: number;
    name: string;
    data: MergeVideoFilesJobData;
  };
  result: MergeVideoFilesResultJobData;
};
