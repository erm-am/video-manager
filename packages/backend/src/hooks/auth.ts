export const authHook = async (request: any, reply: any) => {
  if (!request.session.get('user')) return reply.status(401).send('Unauthorized access');
};
