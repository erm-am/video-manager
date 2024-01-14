import { AxiosProgressEvent } from 'axios';
import { axiosInstance as api } from './axios';

type OnUploadProgress = (percent: number) => void;
type OnParallelUploadProgress = (indexFile: number, percent: number) => void;
type FileList = {
  id: number;
  file: File;
};
export const uploadFiles = (files: FileList[], onUploadProgress?: OnUploadProgress) => {
  let formData = new FormData();
  files.forEach(({ id, file }) => formData.append(`file_${id}`, file));
  return api.post(`api/v1/file-manager/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (onUploadProgress) onUploadProgress(Math.floor(progressEvent.progress * 100));
    },
  });
};

export const parallelUploadFiles = async (files: FileList[], onParallelUploadProgress: OnParallelUploadProgress) => {
  return Promise.all(
    files.map(({ id, file }) => {
      let formData = new FormData();
      formData.append(`file_${id}`, file);
      return api.post(`api/v1/file-manager/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onParallelUploadProgress) onParallelUploadProgress(id, Math.floor(progressEvent.progress * 100));
        },
      });
    }),
  );
};
