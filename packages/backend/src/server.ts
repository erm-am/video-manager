import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import cors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import secureSession from '@fastify/secure-session';

import { ONE_MINUTE_IN_SECONDS, SESSION_SECRET_KEY_PATH } from './configs/core.config.js';
import { fileManagerRoutes } from './modules/file-manager/file-manager.routes.js';

const server = async () => {
  const server = fastify({ logger: false });

  await server.register(secureSession, {
    sessionName: 'session',
    cookieName: 'my-session',
    key: fs.readFileSync(SESSION_SECRET_KEY_PATH),
    cookie: {
      path: '/',
      maxAge: ONE_MINUTE_IN_SECONDS,
    },
  });
  await server.register(cors);
  // await server.register(fastifyWebsocket);
  await server.register(fastifyMultipart, {
    limits: {
      fileSize: Number.MAX_SAFE_INTEGER,
    },
  });

  await server.register(
    async (fastify) => {
      fastify.register(fileManagerRoutes, { prefix: '/file-manager' });
    },
    { prefix: '/api/v1' },
  );

  return server;
};
export { server };
