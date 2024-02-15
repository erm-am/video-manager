import { createChildProcess } from '@/utils/core.utils.js';
import { createCudaResizeCommand, createJoinVideosCommand, createSplitVideoCommand } from './commands.js';
import { addPrefixToFileName, createInputFileList, prepareVideoListFormat } from './utils.js';

import { fileUtils } from '@/utils/file.utils.js';

import { TransformedFileTableRow, VideoResolution } from '@/types.js';

const scaleVideo = async (targetResolution: VideoResolution, inputFilePath: string, autoRemover = true) => {
  const originalFilePath = inputFilePath;
  const newFilePath = await addPrefixToFileName(originalFilePath, 'original');
  return createChildProcess('ffmpeg', createCudaResizeCommand(targetResolution, newFilePath, originalFilePath)).then(() => {
    if (autoRemover) fileUtils.removeFile(newFilePath);
  });
};

const mergeVideos = async (videoFileList: TransformedFileTableRow[], outputFilePath: string, autoRemover = true) => {
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
  scaleVideo,
  mergeVideos,
  splitVideo,
};
