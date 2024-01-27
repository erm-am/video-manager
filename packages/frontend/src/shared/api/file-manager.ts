import { AxiosProgressEvent } from 'axios';
import { v4 } from 'uuid';
import { axiosInstance as api } from './axios';
import { FileWithPath } from 'react-dropzone';

type OnUploadProgress = (percent: number) => void;
type UploadFilesResponse = {
  id: string;
};

export type RegisteredFile = {
  id: number;
  id_user: number;
  upload_id: string;
  name: string;
};
export type RegistredFileListResponse = {
  fileList: RegisteredFile[];
};

export const uploadFiles = (files: FileWithPath[], onUploadProgress?: OnUploadProgress): Promise<UploadFilesResponse> => {
  const id: string = v4();
  let formData = new FormData();
  files.forEach((file) => formData.append(`file`, file));

  return new Promise((resolve, reject) => {
    return api
      .post<UploadFilesResponse>(`api/v1/file-manager/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Upload-Id': id,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onUploadProgress) onUploadProgress(Math.floor(progressEvent.progress * 100));
        },
      })
      .then((response) => {
        resolve({ id: response.data.id });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getRegisteredFileList = () => api.get<RegistredFileListResponse>(`api/v1/file-manager/registered-file-list`);
export const startFileAnalysis = (uploadId: string) => api.post(`api/v1/file-manager/file-analysis`, { uploadId });
