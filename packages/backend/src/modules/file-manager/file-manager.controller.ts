import util from 'util';
import fs from 'fs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'stream';
import path from 'path';
import { UPLOAD_FOLDER_PATH } from '@/configs/core.config.js';
import { StartMergeVideoFilesRequest, UploadFilesRequest } from './requests.js';
import { fileManegerService } from './file-manager.service.js';
import { fileMergingFlow, metaParsingFlow } from '@/flows/index.js';
import { getUniqHash } from '@/utils/core.utils.js';

const pump = util.promisify(pipeline);
export const uploadFiles = async (request: FastifyRequest<UploadFilesRequest>, reply: FastifyReply) => {
  try {
    const userId: number = request.session.get('user').id;
    const uploadedFiles: string[] = [];
    const uploadHash = getUniqHash();

    const userFolderPath = path.resolve(UPLOAD_FOLDER_PATH, userId.toString());
    if (!fs.existsSync(UPLOAD_FOLDER_PATH)) fs.mkdirSync(UPLOAD_FOLDER_PATH);
    if (!fs.existsSync(userFolderPath)) fs.mkdirSync(userFolderPath);

    for await (const part of request.files()) {
      await pump(part.file, fs.createWriteStream(path.resolve(userFolderPath, part.filename)));
      uploadedFiles.push(part.filename);
    }

    if (uploadedFiles.length > 0) {
      const { uploadId, files } = await fileManegerService.registerFiles(userId, uploadHash, uploadedFiles);
      if (files) {
        const registeredUploadedFiles = files.map((file) => {
          const transformedFileTableRow = fileManegerService.transformFileProperties(file, userId);
          return transformedFileTableRow;
        });
        await metaParsingFlow.actions.startToParseMeta(registeredUploadedFiles, uploadId);
        return reply.status(200).send({ status: 'ok' });
      } else {
        throw new Error('File registration error');
      }
    } else {
      throw new Error('No files found');
    }
  } catch (e) {
    return reply.status(400).send({ status: 'Error' }); // todo
  }
};

export const getUploadList = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.session.get('user');
    const uploads = await fileManegerService.getUploadList(id);
    return reply.status(200).send({ uploads });
  } catch (e) {
    return reply.status(400).send({ status: 'Error' }); // todo
  }
};

export const startMergeVideoFiles = async (request: FastifyRequest<StartMergeVideoFilesRequest>, reply: FastifyReply) => {
  try {
    const { uploadId } = request.body;
    const userId: number = request.session.get('user').id;
    const uniqHash = getUniqHash();

    const { hasDistinctResolutions, ...mergeOptions } = await fileManegerService.getMergeOptions(parseInt(uploadId), userId);
    if (hasDistinctResolutions) {
      await fileMergingFlow.actions.startToMergeWithResize({
        files: mergeOptions.files,
        uploadId: parseInt(uploadId),
        targetResolution: mergeOptions.targetResolution!,
        videosToResize: mergeOptions.videosToResize!,
        outputFileName: `merged-video.${uniqHash}.mp4`,
      });
      return reply.status(200).send({ message: 'Flow started' });
    } else {
      await fileMergingFlow.actions.startToMerge({
        uploadId: parseInt(uploadId),
        files: mergeOptions.files,
        outputFileName: `merged-video.${uniqHash}.mp4`,
      });
    }
    return reply.status(200).send({ message: 'Flow started' });
  } catch (e) {
    return reply.status(400).send({ status: 'Error' }); // todo
  }
};
