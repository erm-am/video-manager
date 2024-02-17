import { AxiosProgressEvent } from 'axios';
import { v4 } from 'uuid';
import { axiosInstance as api } from './axios';

type OnUploadProgress = (percent: number) => void;
type UploadFilesResponse = {
  id: string;
};
export type RegisteredFile = {
  id: number;
  user_id: number;
  upload_id: string;
  name: string;
  status: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  bit_rate: number | null;
  display_aspect_ratio: string | null;
};

export type RegisteredUpload = {
  id: number;
  amount: number;
  user_id: number;
  upload_hash: string;
  files: RegisteredFile[];
};
export type RegistredUploadListResponse = {
  uploads: RegisteredUpload[];
};

export const uploadFiles = (files: File[], onUploadProgress?: OnUploadProgress): Promise<UploadFilesResponse> => {
  let formData = new FormData();
  files.forEach((file) => formData.append(`file`, file));
  return new Promise((resolve, reject) => {
    return api
      .post<UploadFilesResponse>(`api/v1/file-manager/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onUploadProgress) onUploadProgress(Math.floor(progressEvent.progress * 100));
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const getUploadList = () => api.get<RegistredUploadListResponse>(`api/v1/file-manager/upload-list`);
export const startMergeVideoFiles = (uploadId: number) => api.post(`api/v1/file-manager/merge-video-files`, { uploadId });
