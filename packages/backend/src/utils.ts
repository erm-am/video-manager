import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

type FileListConfig = {
  format: 'mp4' | 'mov';
};
type CompareFunction = (a: string, b: string) => number;
export const getUniqHash = (length: number = 16) => crypto.randomBytes(length).toString('hex');
export const removeFile = (filePath: string) => fs.unlink(filePath);
export const createFile = (inputTempFileName: string, textFile: string) => fs.writeFile(inputTempFileName, textFile);
export const getFileList = async (absuluteFolderPath: string, config: FileListConfig) => {
  const files = await fs.readdir(absuluteFolderPath);
  const fileList = files
    .filter((file) => file.endsWith(config.format))
    .map((fileName: string) => path.resolve(absuluteFolderPath, fileName));
  return fileList;
};
export const sortFileList = (fileList: string[], sorter: CompareFunction) => fileList.toSorted(sorter);
