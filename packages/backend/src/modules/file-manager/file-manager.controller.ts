import util from 'util';
import fs from 'fs';
import crypto from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'stream';
import path from 'path';
import { UPLOAD_FOLDER_PATH } from '@/configs/core.config.js';
import { StartFileAnalysisRequest, StartMergeVideoFilesRequest, UploadFilesRequest } from './requests.js';
import { fileManegerService } from './file-manager.service.js';

const pump = util.promisify(pipeline);
export const uploadFiles = async (request: FastifyRequest<UploadFilesRequest>, reply: FastifyReply) => {
  try {
    // todo: hash file
    const { id } = request.session.get('user');
    const uploadId = request.headers['x-upload-id']!.toString();
    const userFolderPath = path.resolve(UPLOAD_FOLDER_PATH, id.toString());

    if (!fs.existsSync(UPLOAD_FOLDER_PATH)) fs.mkdirSync(UPLOAD_FOLDER_PATH);
    if (!fs.existsSync(userFolderPath)) fs.mkdirSync(userFolderPath);

    for await (const part of request.files()) {
      const file = path.resolve(userFolderPath, part.filename);
      await pump(part.file, fs.createWriteStream(file));
      await fileManegerService.registerFile(id, uploadId, part.filename);
    }
    return reply.status(200).send({ status: 'Загрузка завершена', uploadId });
  } catch (e) {
    return reply.status(400).send({ status: 'Загрузка с ошибкой', e });
  }
};

export const getRegisteredFileList = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.session.get('user');
    const fileList = await fileManegerService.getFileList(id);

    return reply.status(200).send({ fileList });
  } catch (e) {
    return reply.status(400).send({ status: 'Загрузка с ошибкой' });
  }
};
export const startFileAnalysis = async (request: FastifyRequest<StartFileAnalysisRequest>, reply: FastifyReply) => {
  try {
    const { id: userId } = request.session.get('user');
    const { uploadId } = request.body;
    const jobs = await fileManegerService.startFileAnalysis(userId, uploadId);
    return reply.status(200).send({ jobs });
  } catch (e) {
    return reply.status(400).send({ status: 'ошибка запуска startFileAnalysis' });
  }
};
export const startMergeVideoFiles = async (request: FastifyRequest<StartMergeVideoFilesRequest>, reply: FastifyReply) => {
  try {
    const { id: userId } = request.session.get('user');
    const { uploadId } = request.body;
    const jobs = await fileManegerService.startMergeVideoFiles(userId, uploadId);
    return reply.status(200).send({ jobs });
  } catch (e) {
    return reply.status(400).send({ status: 'ошибка запуска startMergeVideoFiles' });
  }
};
