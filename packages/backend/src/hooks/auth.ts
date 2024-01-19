export const authHook = async (request: any, reply: any) => {
  if (!request.session.get('user')) return reply.status(400).send('session not found');
};
