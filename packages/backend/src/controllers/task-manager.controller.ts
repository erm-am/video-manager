import { FastifyRequest, FastifyReply } from 'fastify';

export const getTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({ status: 'tasks test' });
};
