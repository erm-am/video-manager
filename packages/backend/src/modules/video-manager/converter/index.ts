import { createChildProcess } from '@/utils/core.utils.js';
import { createCudaResizeCommand, createJoinVideosCommand, createSplitVideoCommand } from './commands.js';
import { addPrefixToFileName, createInputFileList, prepareVideoListFormat } from './utils.js';

import { fileUtils } from '@/utils/file.utils.js';
import { VideoMeta } from '../types.js';

const scaleVideo = async (targetResolution: string, inputFilePath: string, autoRemover = true) => {
  const originalFilePath = inputFilePath;
  const newFilePath = await addPrefixToFileName(originalFilePath, 'original');
  return createChildProcess('ffmpeg', createCudaResizeCommand(targetResolution, newFilePath, originalFilePath)).then(() => {
    if (autoRemover) fileUtils.removeFile(newFilePath);
  });
};
const parallelScaleVideos = async (targetResolution: string, fileListWithMeta: VideoMeta[], autoRemover = true) => {
  // Паралельное преобразование разрешения видео через GPU
  const ffprobeProcesses = await Promise.all(
    fileListWithMeta.map(async (file) => {
      const originalFilePath = file.path;
      const newFilePath = await addPrefixToFileName(originalFilePath, 'original');
      return createChildProcess('ffmpeg', createCudaResizeCommand(targetResolution, newFilePath, originalFilePath)).then(() => {
        if (autoRemover) fileUtils.removeFile(newFilePath);
      });
    }),
  );
  return ffprobeProcesses;
};

const mergeVideos = async (videoFileList: string[], outputFilePath: string, autoRemover = true) => {
  const text = prepareVideoListFormat(videoFileList);
  const inputFile = await createInputFileList(text);

  const ffmpegProcess = await createChildProcess('ffmpeg', createJoinVideosCommand(inputFile, outputFilePath)).then(async () => {
    if (autoRemover) await fileUtils.removeFile(inputFile);
  });
  return ffmpegProcess;
};

const splitVideo = async (inputFilePath: string, outputFolderPath: string, maxDurationInSeconds: number) => {
  const ffmpegProcess = await createChildProcess('ffmpeg', createSplitVideoCommand(inputFilePath, outputFolderPath, maxDurationInSeconds));
  return ffmpegProcess;
};

export const videoConverter = {
  parallelScaleVideos,
  scaleVideo,
  mergeVideos,
  splitVideo,
};
