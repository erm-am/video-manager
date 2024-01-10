import util from 'util';
import fs from 'fs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'stream';
import { getFiles } from '@/controllers/file-manager.controller.js';

const pump = util.promisify(pipeline);

export const fileManagerRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', getFiles);
  fastify.get('/1', getFiles);
  fastify.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    const parts = request.files();
    for await (const part of parts) {
      await pump(part.file, fs.createWriteStream(part.filename));
    }

    return reply.status(200).send({ status: 'загрузка завершена' });
  });
};
