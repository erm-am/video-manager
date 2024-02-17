import fs from 'fs';
import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import cors from '@fastify/cors';

import secureSession from '@fastify/secure-session';
import { ONE_HOUR_IN_SECONDS, SESSION_SECRET_KEY_PATH } from './configs/core.config.js';
import { fileManagerRoutes } from './modules/file-manager/file-manager.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { FastifyAdapter } from '@bull-board/fastify';
import { metaParsingFlow, fileMergingFlow } from './flows/index.js';

const setupWebServer = async () => {
  const server = fastify({ logger: false });
  await server.register(secureSession, {
    sessionName: 'session',
    cookieName: 'my-session',
    key: fs.readFileSync(SESSION_SECRET_KEY_PATH),
    cookie: {
      path: '/',
      maxAge: ONE_HOUR_IN_SECONDS * 10,
    },
  });

  await server.register(cors);
  await server.register(fastifyMultipart, {
    limits: {
      fileSize: Number.MAX_SAFE_INTEGER,
    },
  });

  await server.register(
    async (fastify) => {
      fastify.register(fileManagerRoutes, { prefix: '/file-manager' });
      fastify.register(authRoutes, { prefix: '/auth' });
    },
    { prefix: '/api/v1' },
  );
  await setupBullBoard(server);
  return server;
};

const setupBullBoard = async (server: fastify.FastifyInstance) => {
  const serverAdapter = new FastifyAdapter();
  serverAdapter.setBasePath('/ui');
  createBullBoard({
    queues: [...fileMergingFlow.queues, ...metaParsingFlow.queues].map((queue) => new BullMQAdapter(queue)),
    serverAdapter,
  });
  await server.register(serverAdapter.registerPlugin() as any, { prefix: '/ui' });
};
export { setupWebServer };
