import crypto from 'crypto';
import { execa } from 'execa';
import fs from 'fs/promises';
import path from 'path';
import { VideoFileExtensions } from './types.js';
type CompareFunction = (a: string, b: string) => number;
type FileListOptions = {
  extensions: VideoFileExtensions[];
};

export const getUniqHash = (length: number = 16) => crypto.randomBytes(length).toString('hex');
export const removeFile = (filePath: string) => fs.unlink(filePath);
export const createFile = (inputTempFileName: string, textFile: string) => fs.writeFile(inputTempFileName, textFile);
export const getFileList = async (absuluteFolderPath: string, options: FileListOptions) => {
  const files = await fs.readdir(absuluteFolderPath);
  const fileList = files
    .filter((file) => options.extensions.every((extension) => file.endsWith(extension)))
    .map((fileName: string) => path.resolve(absuluteFolderPath, fileName));
  return fileList;
};
export const sortFileList = (fileList: string[], sorter: CompareFunction) => fileList.toSorted(sorter);
export const createChildProcess = (appName: string, params: string[][]) => execa(appName, params.flat());
