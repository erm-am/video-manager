import { httpClient } from '@/shared/api';
import { RegisteredUpload } from '@/shared/api/file-manager';
import { create } from 'zustand';

// state
type FileManagerState = {
  errors: string | null;
  isLoading: boolean;
  uploads: RegisteredUpload[];
};

// actions
type FileManagerActions = {
  updateUploadList: (payload: RegisteredUpload[]) => void;
  startMergeVideoFiles: (uploadId: number) => Promise<void>;
};

export const useFileManagerStore = create<FileManagerState & FileManagerActions>((set, get) => ({
  uploads: [],
  errors: null,
  isLoading: false,
  updateUploadList: (payload) => {
    set({ uploads: payload });
  },
  startMergeVideoFiles: async (uploadId: number) => {
    try {
      set({ isLoading: true });
      const response = await httpClient.fileManager.startMergeVideoFiles(uploadId);
    } catch (e) {
      set({ errors: 'Error' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
