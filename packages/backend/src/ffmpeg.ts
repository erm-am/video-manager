import { execa } from 'execa';
import { createChildProcess, createFile, getUniqHash, removeFile } from './utils.js';
import { createJoinVideosCommand, createSplitVideoCommand } from './commands.js';

const prepareFileList = (fileList: string[]) => fileList.map((filePath: string) => `file '${filePath}'`).join('\n');

const mergeVideoList = async (fileList: string[], outputFileName: string) => {
  const textFile = prepareFileList(fileList);
  const uniqHash = getUniqHash();
  const inputTempFileName = `${uniqHash}_input.txt`;
  await createFile(inputTempFileName, textFile);
  const ffmpegProcess = await createChildProcess('ffmpeg', createJoinVideosCommand(inputTempFileName, outputFileName));
  await removeFile(inputTempFileName);
  return ffmpegProcess;
};

const splitVideoFile = async (
  inputFilePath: string,
  outputFilePath: string,
  outputFileName: string,
  maxDurationInSeconds: number,
) => {
  const ffmpegProcess = await createChildProcess(
    'ffmpeg',
    createSplitVideoCommand(inputFilePath, outputFilePath, outputFileName, maxDurationInSeconds),
  );
  return ffmpegProcess;
};

export { createChildProcess, mergeVideoList, splitVideoFile };
