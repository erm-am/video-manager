import { FastifyInstance } from 'fastify';
import { getRegisteredFileList, uploadFiles, startfileAnalysis } from './file-manager.controller.js';
import { authHook } from '@/hooks/auth.js';

export const fileManagerRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/upload',
    {
      preHandler: authHook,
    },
    uploadFiles,
  );

  fastify.get(
    '/registered-file-list',
    {
      preHandler: authHook,
    },
    getRegisteredFileList,
  );
  fastify.post(
    '/file-analysis',
    {
      preHandler: authHook,
    },
    startfileAnalysis,
  );
};
