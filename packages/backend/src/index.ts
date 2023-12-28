import path from 'path';
import { getFileList, sortFileList } from './utils.js';
import { mergeVideoList, splitVideoFile } from './ffmpeg.js';
import { ONE_HOUR_IN_SECONDS, ONE_MINUTE_IN_SECONDS, VIDEO_FOLDER_PATH } from './config.js';
import naturalCompare from 'natural-compare';

const merge = async () => {
  try {
    const fileList = await getFileList(VIDEO_FOLDER_PATH, { format: 'mp4' });
    const sortedFileList = sortFileList(fileList, (a, b) => naturalCompare(a, b));
    const ffmpegProcess = await mergeVideoList(sortedFileList, 'output1.mp4');
    console.log('done', ffmpegProcess);
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

//merge();
//split();
