import { httpClient } from '@/shared/api';
import { RegisteredFile, RegisteredUpload } from '@/shared/api/file-manager';
import { create } from 'zustand';
const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));

// state
type FileManagerState = {
  socket: WebSocket | null;
  errors: string | null;
  isLoading: boolean;
  uploads: RegisteredUpload[];
};

// actions
type FileManagerActions = {
  getRegisteredFileList: () => Promise<void>;
  initSocket: () => void;
  closeSocket: () => void;
  startMergeVideoFiles: (uploadId: number) => Promise<void>;
};

export const useFileManagerStore = create<FileManagerState & FileManagerActions>((set, get) => ({
  socket: null,
  uploads: [],
  errors: null,
  isLoading: false,
  closeSocket: () => {
    get().socket.close();
  },
  initSocket: () => {
    const socket = new WebSocket('ws://127.0.0.1:4000/ws');

    socket.onopen = function () {
      console.log('Соединение установлено.');
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      set({ uploads: data.payload });
    };

    socket.onerror = function (error) {
      console.log('Ошибка ' + error);
    };
    set({ socket });
  },

  getRegisteredFileList: async () => {
    try {
      set({ isLoading: true });
      const response = await httpClient.fileManager.getUploadList();
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
