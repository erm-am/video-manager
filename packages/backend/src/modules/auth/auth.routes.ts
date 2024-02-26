import { FastifyInstance } from 'fastify';
import { login, logout, checkAuth } from './auth.controller.js';
import { authHook } from '@/hooks/auth.js';

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/login', login);
  fastify.post('/logout', { preHandler: authHook }, logout);
  fastify.post('/check-auth', { preHandler: authHook }, checkAuth);
};
