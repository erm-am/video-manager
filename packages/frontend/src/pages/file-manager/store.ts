import { httpClient } from '@/shared/api';
import { RegisteredFile, RegisteredUpload } from '@/shared/api/file-manager';
import { create } from 'zustand';
const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));

// state
type FileManagerState = {
  errors: string | null;
  isLoading: boolean;
  uploads: RegisteredUpload[];
};

// actions
type FileManagerActions = {
  getRegisteredFileList: () => Promise<void>;
  startMergeVideoFiles: (uploadId: number) => Promise<void>;
};

export const useFileManagerStore = create<FileManagerState & FileManagerActions>((set, get) => ({
  uploads: [],
  errors: null,
  isLoading: false,
  getRegisteredFileList: async () => {
    try {
      set({ isLoading: true });
      const response = await httpClient.fileManager.getRegisteredUploadList();
      const uploads = response.data.uploads;
      set({ uploads });
    } catch (e) {
      set({ errors: 'ошибка' + e });
    } finally {
      set({ isLoading: false });
    }
  },

  startMergeVideoFiles: async (uploadId: number) => {
    try {
      set({ isLoading: true });
      const response = await httpClient.fileManager.startMergeVideoFiles(uploadId);
    } catch (e) {
      set({ errors: 'ошибка' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
