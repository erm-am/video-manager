import path from 'path';
import { UPLOAD_FOLDER_PATH } from '@/configs/core.config.js';
import { prisma } from '@/configs/prisma-connection.config.js';

import { FileStatus, FileTableRow, VideoResolution, TransformedFileTableRow } from '@/types.js';
import { videoAnalizer } from '../video-manager/analyzer/index.js';

const registerFiles = async (userId: number, uploadId: string, registredFiles: string[]) => {
  const upload = await prisma.upload.create({
    data: {
      amount: registredFiles.length,
      user_id: userId,
      upload_hash: uploadId,
      status: FileStatus.Uploaded,
      files: {
        create: registredFiles.map((fileName) => {
          return {
            name: fileName,
            status: FileStatus.Uploaded,
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
  return await prisma.upload.findMany({
    where: {
      user_id: userId,
    },
    include: {
      files: true,
    },
  });
};

const transformFileProperties = (registredFile: FileTableRow, userId: number): TransformedFileTableRow => {
  return {
    id: registredFile.id,
    path: path.resolve(UPLOAD_FOLDER_PATH, userId.toString(), registredFile.name),
    width: registredFile.width,
    height: registredFile.height,
    duration: registredFile.duration,
    displayAspectRatio: registredFile.display_aspect_ratio,
    bitRate: registredFile.bit_rate,
  };
};
const updateFileStatus = async (fileId: number, status: string) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: { status },
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
const updateUploadStatus = async (uploadId: number, status: string) => {
  return await prisma.upload.update({
    where: {
      id: uploadId,
    },
    data: { status },
  });
};
const updateFileProperties = async (fileId: number, status: string, fileProperties: TransformedFileTableRow) => {
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
const getMergeOptions = async (uploadId: number, userId: number) => {
  const files = await prisma.file.findMany({
    where: {
      upload_id: uploadId,
    },
  });
  const transformedFiles = files.map((file) => transformFileProperties(file, userId));
  const hasDistinctResolutions = videoAnalizer.checkDistinctResolutions(transformedFiles);
  if (hasDistinctResolutions) {
    const { targetResolution, videosToResize } = videoAnalizer.getVideoListToResize(transformedFiles);
    return {
      hasDistinctResolutions,
      targetResolution,
      videosToResize,
      files: transformedFiles,
    };
  } else {
    return {
      hasDistinctResolutions,
      files: transformedFiles,
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
  transformFileProperties,
  getMergeOptions,
};
