export type VideoFileExtensions = 'mp4' | 'avi' | 'mov';

export type CompareFunction = (a: string, b: string) => number;
export type FileListOptions = {
  extensions: VideoFileExtensions[];
};
