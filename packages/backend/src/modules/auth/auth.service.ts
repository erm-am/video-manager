import { prisma } from '@/configs/prisma-connection.config.js';
import { getUniqHash } from '@/utils/core.utils.js';

const login = async (login: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      name: login,
    },
  });

  if (user) {
    if (user.password === password) {
      return user;
    } else {
      throw new Error('wrong password');
    }
  } else {
    throw new Error('user not found');
  }
};

export const authService = {
  login,
};
