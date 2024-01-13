import { getUniqHash } from '@/shared/utils.js';
import { FastifyRequest, FastifyReply } from 'fastify';

export const getFiles = async (request: FastifyRequest, reply: FastifyReply) => {
  if (request.session.get('id')) {
    return reply.status(200).send({ status: request.session.get('id') });
  } else {
    request.session.set('id', getUniqHash(16));
    return reply.status(200).send({ status: request.session.get('id') });
  }
};
