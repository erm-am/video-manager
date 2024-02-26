import path from 'path';
import { UPLOAD_FOLDER_PATH } from '@/configs/core.config.js';
import { prisma } from '@/configs/prisma-connection.config.js';

import { VideoResolution, Stage, Status, FileRow, StageAndStatusOptions } from '@/types.js';
import { videoAnalizer } from '../video-manager/analyzer/index.js';

type FullPathConfig = {
  uploadFolder: string;
  userId: number;
  groupName: string;
  fileName: string;
};
const getFullPath = (config: FullPathConfig): string => {
  const fulPath = path.resolve(config.uploadFolder, config.userId.toString(), config.groupName, config.fileName);
  return fulPath;
};
const registerFiles = async (userId: number, groupName: string, registredFiles: string[]) => {
  const upload = await prisma.uploadGroup.create({
    data: {
      amount: registredFiles.length,
      userId,
      groupName,
      status: Status.COMPLETED,
      stage: Stage.UPLOAD,
      files: {
        create: registredFiles.map((fileName) => {
          const fullPath = getFullPath({
            uploadFolder: UPLOAD_FOLDER_PATH,
            userId,
            groupName,
            fileName,
          });
          return {
            name: fileName,
            path: fullPath,
            status: Status.COMPLETED,
            stage: Stage.UPLOAD,
          };
        }),
      },
    },
    include: {
      files: true,
    },
  });
  if (upload.files.length > 0) {
    return {
      uploadId: upload.id,
      files: upload.files,
    };
  } else {
    throw new Error('File registration error');
  }
};
const getUploadList = async (userId: number) => {
  return await prisma.uploadGroup.findMany({
    where: {
      userId,
    },
    include: {
      files: true,
    },
  });
};

const updateFileStatus = async (fileId: number, options: StageAndStatusOptions) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: { status: options.status, stage: options.stage },
  });
};
const updateFileResolution = async (fileId: number, resolution: VideoResolution) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      width: resolution.width,
      height: resolution.height,
    },
  });
};
const updateUploadStatus = async (uploadId: number, options: StageAndStatusOptions) => {
  return await prisma.uploadGroup.update({
    where: {
      id: uploadId,
    },
    data: { status: options.status, stage: options.stage },
  });
};

const updateFileProperties = async (fileId: number, options: StageAndStatusOptions & { fileProperties: FileRow }) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      ...options.fileProperties,
      status: options.status,
      stage: options.stage,
    },
  });
};
const getMergeOptions = async (uploadId: number, userId: number) => {
  const files = await prisma.file.findMany({
    where: {
      uploadId: uploadId,
    },
  });

  const hasDistinctResolutions = videoAnalizer.checkDistinctResolutions(files);
  if (hasDistinctResolutions) {
    const { targetResolution, videosToResize } = videoAnalizer.getVideoListToResize(files);
    return {
      hasDistinctResolutions,
      targetResolution,
      videosToResize,
      files,
    };
  } else {
    return {
      hasDistinctResolutions,
      files,
    };
  }
};

export const fileManegerService = {
  registerFiles,
  getUploadList,
  updateFileStatus,
  updateFileResolution,
  updateUploadStatus,
  updateFileProperties,
  getMergeOptions,
};
