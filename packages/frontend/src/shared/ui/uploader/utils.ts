import { FileWithPath } from 'react-dropzone';

export type ChunksWithFileMeta = {
  chunks: Blob[];
  meta: {
    totalSize: number;
    name: string;
  };
};

export const splitFileIntoChunks = (file: FileWithPath, chunkSizeInBytes: number): Promise<ChunksWithFileMeta> => {
  return new Promise((resolve) => {
    let chunks: Blob[] = [];
    let fileSize = file.size;
    let start = 0;
    let end = chunkSizeInBytes;
    while (start < fileSize) {
      chunks.push(file.slice(start, end));
      start = end;
      end = start + chunkSizeInBytes;
    }
    resolve({
      chunks,
      meta: {
        name: file.name,
        totalSize: file.size,
      },
    });
  });
};
