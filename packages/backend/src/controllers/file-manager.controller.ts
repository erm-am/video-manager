import { FastifyRequest, FastifyReply } from 'fastify';

export const getFiles = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({ status: 'getFiles route' });
};
