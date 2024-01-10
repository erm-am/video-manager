import { getTasks } from '@/controllers/task-manager.controller.js';
import { FastifyInstance } from 'fastify';

export const taskManagerRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', getTasks);
  fastify.get('/66', getTasks);
  fastify.get('/77', getTasks);
};
