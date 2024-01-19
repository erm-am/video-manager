import { AxiosProgressEvent } from 'axios';
import { v4 } from 'uuid';
import { axiosInstance as api } from './axios';

type OnUploadProgress = (percent: number) => void;
type OnParallelUploadProgress = (indexFile: number, percent: number, uploadId: string) => void;
type FileList = {
  id: number;
  file: File;
};

export const doneParallelUploadFiles = async (uploadId: string) => api.post(`api/v1/file-manager/upload/done`, { uploadId });
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
  const uploadId: string = v4();
  return new Promise(async (resolve, reject) => {
    Promise.all(
      files.map(({ id, file }) => {
        let formData = new FormData();
        formData.append(`file`, file);
        return api.post(`api/v1/file-manager/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Upload-Id': uploadId,
            'X-File-Id': id,
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (onParallelUploadProgress) onParallelUploadProgress(id, Math.floor(progressEvent.progress * 100), uploadId);
          },
        });
      }),
    )
      .then((responses) => {
        const isUploadComplete = responses.every((response) => response.status === 200);
        if (responses.length > 0 && isUploadComplete) {
          doneParallelUploadFiles(uploadId).then(() => resolve(uploadId));
        } else {
          throw new Error('ERROR_UPLOAD_FAILED');
        }
      })
      .catch((error) => reject(error));
  });
};
