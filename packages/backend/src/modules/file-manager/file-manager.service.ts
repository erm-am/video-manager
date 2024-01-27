import { UPLOAD_FOLDER_PATH } from '@/configs/core.config.js';
import { prisma } from '@/configs/prisma-connection.config.js';
import { videoAnalyzerQueue } from '@/queues/index.js';
import { Job } from 'bullmq';
import path from 'path';

const registerFile = async (userId: number, uploadId: string, fileName: string) => {
  const data = await prisma.file.create({
    data: { user_id: userId, upload_id: uploadId, name: fileName, status: 'uploaded' },
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
const startfileAnalysis = async (userId: number, uploadId: string) => {
  const files = await prisma.file.findMany({
    where: {
      upload_id: uploadId,
    },
  });

  const jobs = await Promise.all(
    files.map(async (file) => {
      const videoPath = path.resolve(UPLOAD_FOLDER_PATH, userId.toString(), file.name);
      return videoAnalyzerQueue.add(
        'get-meta-info',
        {
          videoPath,
          fileId: file.id,
          uploadId: file.upload_id,
          fileName: file.name,
        },
        { delay: 4000 },
      );
    }),
  );
  return jobs;
};

const updateFileStatus = async (fileId: number, status: string) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: { status },
  });
};

export const fileManegerService = {
  registerFile,
  getFileList,
  startfileAnalysis,
  updateFileStatus,
};
