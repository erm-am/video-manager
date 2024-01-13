import util from 'util';
import fs from 'fs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'stream';

const pump = util.promisify(pipeline);

export const uploadFiles = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const parts = request.files();
    for await (const part of parts) {
      await pump(part.file, fs.createWriteStream(part.filename));
    }
    return reply.status(200).send({ status: 'Загрузка завершена' });
  } catch (e) {
    console.log(e);
  }
};
