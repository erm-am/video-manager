import axios from 'axios';

const createMainAxiosInstance = () => {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 300000,
  });
};

const createRequestInterceptorAuth = (instanse) => {
  instanse.interceptors.request.use(
    async (config) => {
      return config;
    },
    (error) => Promise.reject(error),
  );
};
const createResponseInterceptorAuth = (instanse) => {
  instanse.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error),
  );
};

const axiosInstance = createMainAxiosInstance();
createRequestInterceptorAuth(axiosInstance);
createResponseInterceptorAuth(axiosInstance);
export { axiosInstance };
