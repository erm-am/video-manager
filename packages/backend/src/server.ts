import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';

import { fileManagerRoutes } from './routes/file-manager.routes.js';
import { taskManagerRoutes } from './routes/task-manager.routes.js';

const server = async () => {
  const server = fastify({ logger: false });

  await server.register(fastifyMultipart, {
    limits: {
      fileSize: Number.MAX_SAFE_INTEGER,
    },
  });

  await server.register(
    async (api) => {
      api.register(taskManagerRoutes, { prefix: '/task-manager' });
      api.register(fileManagerRoutes, { prefix: '/file-manager' });
    },
    { prefix: '/api/v1' },
  );

  return server;
};
export { server };
