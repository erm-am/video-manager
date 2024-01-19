import util from 'util';
import fs from 'fs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'stream';
import path from 'path';
import { UPLOAD_FOLDER_PATH } from '@/configs/core.config.js';
import { DoneUploadRequest, UploadFilesRequest } from './requests.js';

const pump = util.promisify(pipeline);
export const uploadFiles = async (request: FastifyRequest<UploadFilesRequest>, reply: FastifyReply) => {
  try {
    const { id } = request.session.get('user');
    const uploadId = request.headers['x-upload-id']?.toString();
    const userFolderPath = path.resolve(UPLOAD_FOLDER_PATH, id);
    const currentFolderPath = path.resolve(userFolderPath, uploadId!);
    if (!fs.existsSync(UPLOAD_FOLDER_PATH)) fs.mkdirSync(UPLOAD_FOLDER_PATH);
    if (!fs.existsSync(userFolderPath)) fs.mkdirSync(userFolderPath);
    if (!fs.existsSync(currentFolderPath)) fs.mkdirSync(currentFolderPath);

    for await (const part of request.files()) {
      await pump(part.file, fs.createWriteStream(path.resolve(currentFolderPath, part.filename)));
    }
    return reply.status(200).send({ status: 'Загрузка завершена' });
  } catch (e) {
    return reply.status(400).send({ status: 'Загрузка с ошибкой' });
  }
};

export const doneUpload = async (request: FastifyRequest<DoneUploadRequest>, reply: FastifyReply) => {
  try {
    return reply.status(200).send({ status: 'OK', uploadId: request.body.uploadId });
  } catch (e) {
    console.log(e);
    return reply.status(200).send({ status: 'ERROR' });
  }
};
