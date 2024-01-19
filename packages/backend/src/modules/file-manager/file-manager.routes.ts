import { FastifyInstance } from 'fastify';
import { doneUpload, uploadFiles } from './file-manager.controller.js';
import { authHook } from '@/hooks/auth.js';

export const fileManagerRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/test', { preHandler: authHook }, (req, reply) => {
    return reply.status(200).send({ status: 'test' });
  });

  fastify.post(
    '/upload',
    {
      preHandler: authHook,
    },
    uploadFiles,
  );

  fastify.post('/upload/done', { preHandler: authHook }, doneUpload);
};
