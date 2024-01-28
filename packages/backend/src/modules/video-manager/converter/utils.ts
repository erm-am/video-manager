import { getUniqHash } from '@/utils/core.utils.js';
import { fileUtils } from '@/utils/file.utils.js';
import { VideoMeta } from '../types.js';

export const addPrefixToFileName = async (filePath: string, prefix: string) => {
  const newFilePath = filePath.replace(/(\.[^.]+)$/, `_${prefix}$1`);
  await fileUtils.renameFile(filePath, newFilePath);
  return newFilePath;
};

export const createInputFileList = async (text: string) => {
  const uniqHash = getUniqHash();
  const inputFileName = `${uniqHash}.txt`;
  await fileUtils.createFile(inputFileName, text);
  return inputFileName;
};

export const prepareVideoListFormat = (fileList: VideoMeta[]) => fileList.map((file: VideoMeta) => `file '${file.path}'`).join('\n');
