import { FastifyInstance } from 'fastify';
import { uploadFiles } from './file-manager.controller.js';

export const fileManagerRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/upload', uploadFiles);
};
