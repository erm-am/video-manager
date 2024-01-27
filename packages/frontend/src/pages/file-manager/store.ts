import { httpClient } from '@/shared/api';
import { RegisteredFile } from '@/shared/api/file-manager';
import { create } from 'zustand';
const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));
type FileList = RegisteredFile[];
type GroupedFileList = {
  uploadId: string;
  files: FileList;
};

// state
type FileManagerState = {
  errors: string | null;
  isLoading: boolean;
  fileList: FileList;
  groupedFileList: GroupedFileList[];
};

// actions
type FileManagerActions = {
  getRegisteredFileList: () => Promise<void>;
  startFileAnalysis: (uploadId: string) => Promise<void>;
};

//utils
const groupFileListByUploadId = (fileList: FileList): GroupedFileList[] => {
  const grouped = Object.groupBy(fileList, ({ upload_id }) => upload_id);
  return Object.entries(grouped).map(([uploadId, files]) => ({ uploadId, files }));
};

export const useFileManagerStore = create<FileManagerState & FileManagerActions>((set, get) => ({
  fileList: [],
  groupedFileList: [],
  errors: null,
  isLoading: false,
  getRegisteredFileList: async () => {
    try {
      set({ isLoading: true });
      const response = await httpClient.fileManager.getRegisteredFileList();
      const fileList = response.data.fileList;
      const groupedFileList = groupFileListByUploadId(fileList);
      set({ fileList, groupedFileList: groupedFileList });
    } catch (e) {
      set({ errors: 'ошибка' + e });
    } finally {
      set({ isLoading: false });
    }
  },
  startFileAnalysis: async (uploadId: string) => {
    try {
      set({ isLoading: true });
      const response = await httpClient.fileManager.startFileAnalysis(uploadId);
    } catch (e) {
      set({ errors: 'ошибка' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
