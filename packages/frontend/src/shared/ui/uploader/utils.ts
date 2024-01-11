const splitFileIntoChunks = (file: File, chunkSizeInBytes: number): Promise<Blob[]> => {
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
    resolve(chunks);
  });
};
