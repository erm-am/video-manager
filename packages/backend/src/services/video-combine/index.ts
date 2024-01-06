import naturalCompare from 'natural-compare';

import { SplitConfig, MergeConfig } from './types.js';
import { fileManager } from '@/modules/file-manager/index.js';
import { videoAnalizer } from '@/modules/video-analyzer/index.js';
import { videoConverter } from '@/modules/video-converter/index.js';

const merge = async (config: MergeConfig) => {
  const { inputVideoFolderPath, outputVideoPath } = config;
  try {
    const fileList = await fileManager.getFileList(inputVideoFolderPath, { extensions: ['mp4', 'avi'] });
    const sortedFileList = fileManager.sortFileList(fileList, (a, b) => naturalCompare(a, b));
    const fileListWithMeta = await videoAnalizer.getMetaInfoList(sortedFileList);
    const hasDistinctResolutions = videoAnalizer.checkDistinctResolutions(fileListWithMeta);
    if (hasDistinctResolutions) {
      const { resolution, videosToScale } = videoAnalizer.getVideoListForScaling(fileListWithMeta);
      console.log(`Перед склеиванием необходимо преобразовать ${videosToScale.length} видео к ${resolution}`);
      await videoConverter.parallelScaleVideos(resolution, videosToScale);
      console.log('Преобразование завершено');
    }
    console.log('Начали склеивать', sortedFileList);
    await videoConverter.mergeVideos(sortedFileList, outputVideoPath);
    console.log('Склейка завершена');
  } catch (error) {
    console.log(error);
  }
};

const split = async (config: SplitConfig) => {
  const { inputVideoFilePath, outputFolder, maxDurationInSeconds } = config;
  try {
    const ffmpegProcess = await videoConverter.splitVideo(inputVideoFilePath, outputFolder, maxDurationInSeconds);
    return ffmpegProcess;
  } catch (error) {
    console.log(error);
  }
};

export const videoCombine = {
  merge,
  split,
};
