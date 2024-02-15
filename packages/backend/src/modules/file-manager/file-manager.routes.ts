import { FastifyInstance } from 'fastify';
import { getUploadList, uploadFiles, startMergeVideoFiles } from './file-manager.controller.js';
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
    '/upload-list',
    {
      preHandler: authHook,
    },
    getUploadList,
  );

  fastify.post(
    '/merge-video-files',
    {
      preHandler: authHook,
    },
    startMergeVideoFiles,
  );
};
