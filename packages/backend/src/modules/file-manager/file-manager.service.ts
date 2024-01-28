import { UPLOAD_FOLDER_PATH } from '@/configs/core.config.js';
import { prisma } from '@/configs/prisma-connection.config.js';
import { mergeVideoFilesQueue, videoAnalyzerQueue } from '@/queues/index.js';
import { MergeVideoFilesJobData } from '@/queues/merge-video-files/types.js';
import { VideoAnalyzerJobData, VideoAnalyzerResultJobData } from '@/queues/video-analyzer/types.js';

import path from 'path';
import { VideoMeta } from '../video-manager/types.js';

const registerFile = async (userId: number, uploadId: string, fileName: string) => {
  const data = await prisma.file.create({
    data: {
      user_id: userId,
      upload_id: uploadId,
      name: fileName,
      status: 'uploaded',
    },
  });
  return data;
};
const getFileList = async (userId: number) => {
  const data = await prisma.file.findMany({
    where: {
      user_id: userId,
    },
  });
  return data;
};
async function startFileAnalysis(userId: number, uploadId: string) {
  const files = await prisma.file.findMany({
    where: {
      upload_id: uploadId,
    },
  });

  const jobs = await Promise.all(
    files.map(async (file) => {
      const videoPath = path.resolve(UPLOAD_FOLDER_PATH, userId.toString(), file.name);
      const jobName = 'get-meta-info';
      const jobData: VideoAnalyzerJobData = {
        videoPath,
        fileId: file.id,
        uploadId: file.upload_id,
        fileName: file.name,
      };
      return videoAnalyzerQueue.add(jobName, jobData);
    }),
  );
  return jobs;
}
async function startMergeVideoFiles(userId: number, uploadId: string) {
  const files = await prisma.file.findMany({
    where: {
      upload_id: uploadId,
    },
    select: {
      name: true,
      width: true,
      height: true,
      duration: true,
      bit_rate: true,
      display_aspect_ratio: true,
    },
  });

  const filesWithPaths = files.map((file) => {
    return {
      path: path.resolve(UPLOAD_FOLDER_PATH, userId.toString(), file.name),
      width: file.width,
      height: file.height,
      duration: file.duration,
      displayAspectRatio: file.display_aspect_ratio,
      bitRate: file.bit_rate,
    };
  }) as VideoMeta[];

  const jobName = 'merge-videos';
  const jobData: MergeVideoFilesJobData = {
    uploadId: uploadId,
    files: filesWithPaths,
  };
  const job = await mergeVideoFilesQueue.add(jobName, jobData);
  return job;
}

const updateFileStatus = async (fileId: number, status: string) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: { status },
  });
};
const updateFileProperties = async (fileId: number, status: string, fileProperties: VideoAnalyzerResultJobData) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      width: fileProperties.width,
      height: fileProperties.height,
      duration: fileProperties.duration,
      bit_rate: fileProperties.bitRate,
      display_aspect_ratio: fileProperties.displayAspectRatio,
      status,
    },
  });
};

export const fileManegerService = {
  registerFile,
  getFileList,
  startFileAnalysis,
  updateFileStatus,
  updateFileProperties,
  startMergeVideoFiles,
};
