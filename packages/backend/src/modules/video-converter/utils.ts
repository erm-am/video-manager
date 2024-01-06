import { getUniqHash } from '@/shared/utils.js';
import { fileManager } from '../file-manager/index.js';

export const addPrefixToFileName = async (filePath: string, prefix: string) => {
  const newFilePath = filePath.replace(/(\.[^.]+)$/, `_${prefix}$1`);
  await fileManager.renameFile(filePath, newFilePath);
  return newFilePath;
};

export const createInputFileList = async (text: string) => {
  const uniqHash = getUniqHash();
  const inputFileName = `${uniqHash}.txt`;
  await fileManager.createFile(inputFileName, text);
  return inputFileName;
};

export const prepareVideoListFormat = (fileList: string[]) => fileList.map((filePath: string) => `file '${filePath}'`).join('\n');
