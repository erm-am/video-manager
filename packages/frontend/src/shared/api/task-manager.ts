import { axiosInstance as api } from './axios';

export const getTasks = () => {
  return api.get(`/tasks`);
};
