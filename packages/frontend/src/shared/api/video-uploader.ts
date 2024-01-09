import { axiosInstance as api } from './axios';

export const uploadFiles = (files) => {
  return api.post(`/upload`);
};
