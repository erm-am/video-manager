import util from 'util';
import fs from 'fs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'stream';
import { getFiles } from '@/controllers/file-manager.controller.js';

const pump = util.promisify(pipeline);

export const fileManagerRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', getFiles);
  fastify.get('/1', getFiles);
  // fastify.get('/ws', { websocket: true }, (connection, req) => {
  //   //
  //   setInterval(() => {}, 1000);
  //   connection.socket.on('message', (message) => {
  //     connection.socket.send(`Hello Fastify WebSockets ${message}`);
  //   });
  // });

  fastify.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parts = request.files();
      for await (const part of parts) {
        await pump(part.file, fs.createWriteStream(part.filename));
      }
    } catch (e) {
      console.log(e);
    }

    return reply.status(200).send({ status: 'загрузка завершена' });
  });
};
