import path from 'path';
import naturalCompare from 'natural-compare';
import { getFileList, sortFileList } from './utils.js';
import { mergeVideoList, splitVideoFile } from './ffmpeg.js';
import { ONE_HOUR_IN_SECONDS, ONE_MINUTE_IN_SECONDS, VIDEO_FOLDER_PATH } from './config.js';
import { checkDistinctResolutions, findMostUsedResolution, getVideoMetaData } from './ffprobe.js';
const merge = async () => {
  try {
    const fileList = await getFileList(VIDEO_FOLDER_PATH, { extensions: ['mp4', 'avi'] });
    const sortedFileList = sortFileList(fileList, (a, b) => naturalCompare(a, b));
    const fileListWithMeta = await getVideoMetaData(sortedFileList);
    const fileListGroupedByResolution = Object.groupBy(fileListWithMeta, ({ width, height }) => `${width}:${height}`);
    const hasDistinctResolutions = checkDistinctResolutions(fileListGroupedByResolution);
    if (hasDistinctResolutions) {
      // TODO
      const mostUsedResolution = findMostUsedResolution(fileListGroupedByResolution);
      console.log('mostUsedResolution', mostUsedResolution);
      console.log('fileList', fileList);
    } else {
      const ffmpegProcess = await mergeVideoList(sortedFileList, 'output1.mp4');
      console.log('done', ffmpegProcess);
    }
  } catch (error) {
    console.log(error);
  }
};

const split = async () => {
  const inputFile = path.resolve(process.cwd(), 'output_pw.mp4');
  const outputFilePath = path.resolve(process.cwd(), 'output_pw');
  const outputFileName = 'test';
  const maxDurationInseconds = ONE_HOUR_IN_SECONDS * 4 - ONE_MINUTE_IN_SECONDS; //3:59
  const ffmpegProcess = await splitVideoFile(inputFile, outputFilePath, outputFileName, maxDurationInseconds);
  console.log('done', ffmpegProcess);
};

merge();

//split();
