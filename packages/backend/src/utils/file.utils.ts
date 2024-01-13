import fs from 'fs/promises';
import path from 'path';

export type VideoFileExtensions = 'mp4' | 'avi' | 'mov';

export type CompareFunction = (a: string, b: string) => number;
export type FileListOptions = {
  extensions: VideoFileExtensions[];
};

const getFileList = async (absuluteFolderPath: string, options: FileListOptions) => {
  const files = await fs.readdir(absuluteFolderPath);
  const fileList = files
    .filter((file) => options.extensions.some((extension) => file.endsWith(extension)))
    .map((fileName: string) => path.resolve(absuluteFolderPath, fileName));
  return fileList;
};
const sortFileList = (fileList: string[], sorter: CompareFunction) => fileList.toSorted(sorter);
const renameFile = async (oldPath: string, newPath: string) => await fs.rename(oldPath, newPath);
const removeFile = async (filePath: string) => await fs.unlink(filePath);
const createFile = async (inputTempFileName: string, textFile: string) => await fs.writeFile(inputTempFileName, textFile);
const getFileInfo = (filePath: string) => path.parse(filePath);

export const fileUtils = {
  renameFile,
  getFileList,
  sortFileList,
  removeFile,
  createFile,
  getFileInfo,
};
