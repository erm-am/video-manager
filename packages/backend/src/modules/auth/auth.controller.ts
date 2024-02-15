import { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from './auth.service.js';
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const login = 'admin';
    const password = 'qwerty';
    const user = await authService.login(login, password);
    if (user) {
      const { id, name } = user;
      request.session.set('user', { id, name });
      return reply.status(200).send({ id, name });
    }
  } catch (error) {
    return reply.status(400).send('Wrong username or password');
  }
};
export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.session.get('user');
    if (user) {
      request.session.delete();
      return reply.status(200).send({ status: 'logged out' });
    } else {
      return reply.status(400).send('session not found');
    }
  } catch (e) {
    console.log(e);
  }
};
export const checkAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.session.get('user');
    if (user) {
      return reply.status(200).send(user);
    } else {
      return reply.status(400).send('session not found');
    }
  } catch (e) {
    console.log(e);
  }
};
