import { httpClient } from '@/shared/api';
import { RegisteredUpload } from '@/shared/api/file-manager';
import { create } from 'zustand';

type FileManagerState = {
  errors: string[] | null;
  isLoading: boolean;
  uploads: RegisteredUpload[];
};

type FileManagerActions = {
  updateUploadList: (payload: RegisteredUpload[]) => void;
  startToMergeVideoFiles: (uploadId: number) => Promise<void>;
};

const initState: FileManagerState = {
  uploads: [],
  errors: null,
  isLoading: false,
};
export const useFileManagerStore = create<FileManagerState & FileManagerActions>((set, get) => ({
  ...initState,
  updateUploadList: (payload) => {
    set({ uploads: payload });
  },
  startToMergeVideoFiles: async (uploadId: number) => {
    try {
      set({ isLoading: true });
      await httpClient.fileManager.startToMergeVideoFiles(uploadId);
    } catch (e) {
      set({ errors: ['error'] });
    } finally {
      set({ isLoading: false });
    }
  },
  reset: () => {
    set(initState);
  },
}));
