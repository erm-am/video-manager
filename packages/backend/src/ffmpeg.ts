import { execa } from 'execa';
import { createChildProcess, createFile, getUniqHash, removeFile, renameFile } from './utils.js';
import { createJoinVideosCommand, createSplitVideoCommand, createCudaResizeCommand } from './commands.js';
import { VideoMeta } from './ffprobe.js';

const prepareFileList = (fileList: string[]) => fileList.map((filePath: string) => `file '${filePath}'`).join('\n');

const mergeVideoList = async (fileList: string[], outputFileName: string) => {
  const textFile = prepareFileList(fileList);
  const uniqHash = getUniqHash();
  const inputTempFileName = `${uniqHash}_input.txt`;
  await createFile(inputTempFileName, textFile);
  const ffmpegProcess = await createChildProcess('ffmpeg', createJoinVideosCommand(inputTempFileName, outputFileName));
  // await removeFile(inputTempFileName);
  return ffmpegProcess;
};

const scaleVideoList = async (resulution: string, fileList: VideoMeta[]) => {
  // Паралельное преобразование разрешения видео через GPU
  const ffprobeProcesses = await Promise.all(
    fileList.map(async (file) => {
      const originalName = file.filePath;
      const tempFileName = originalName.replace(/(.*\\)([^\\]+)(\.mp4$)/, '$1$2_temp$3'); //todo
      await renameFile(originalName, tempFileName);
      return createChildProcess('ffmpeg', createCudaResizeCommand(resulution, tempFileName, originalName)).then(() =>
        removeFile(tempFileName),
      );
    }),
  );
  return ffprobeProcesses;
};

const splitVideoFile = async (inputFilePath: string, outputFilePath: string, outputFileName: string, maxDurationInSeconds: number) => {
  const ffmpegProcess = await createChildProcess(
    'ffmpeg',
    createSplitVideoCommand(inputFilePath, outputFilePath, outputFileName, maxDurationInSeconds),
  );
  return ffmpegProcess;
};

export { createChildProcess, mergeVideoList, splitVideoFile, scaleVideoList };
