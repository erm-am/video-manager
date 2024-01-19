import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}
const createMainAxiosInstance = () => {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 300000,
  });
};

const createRequestInterceptorAuth = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: AdaptAxiosRequestConfig): AdaptAxiosRequestConfig => config,
    (error: AxiosError) => Promise.reject(error),
  );
};
const createResponseInterceptorAuth = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError) => Promise.reject(error),
  );
};

const axiosInstance = createMainAxiosInstance();
createRequestInterceptorAuth(axiosInstance);
createResponseInterceptorAuth(axiosInstance);
export { axiosInstance };
