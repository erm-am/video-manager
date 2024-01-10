import { AxiosProgressEvent } from 'axios';
import { axiosInstance as api } from './axios';

type OnUploadProgress = (progressEvent: AxiosProgressEvent) => void;
type OnParallelUploadProgress = (indexFile: number, progressEvent: AxiosProgressEvent) => void;
export const uploadFiles = (files: File[], onUploadProgress: OnUploadProgress) => {
  let formData = new FormData();
  files.forEach((file, index) => formData.append(`file_${index}`, file));
  return api.post(`api/v1/file-manager/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => onUploadProgress(progressEvent),
  });
};

export const parallelUploadFiles = async (files: File[], onParallelUploadProgress: OnParallelUploadProgress) => {
  return Promise.all(
    files.map((file, index) => {
      let formData = new FormData();
      formData.append(`file_${index}`, file);
      return api.post(`api/v1/file-manager/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => onParallelUploadProgress(index, progressEvent),
      });
    }),
  );
};
