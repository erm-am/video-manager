import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

import { socketManager } from './manager.js';
import { authHook } from '@/hooks/auth.js';

const setupWebSockets = async (server: fastify.FastifyInstance) => {
  await server.register(fastifyWebsocket);
  server.get(
    '/ws',
    {
      websocket: true,
      preHandler: authHook,
    },
    async (connection, request) => {
      const user = request.session.get('user');
      if (user) {
        socketManager.addUser(user.id, connection.socket);
        socketManager.sendUploadListToClient(user.id);
      }

      connection.on('close', () => {
        socketManager.removeUser(user.id);
      });
    },
  );

  return server;
};

export { setupWebSockets };
