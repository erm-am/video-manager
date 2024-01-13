export type SplitConfig = {
  inputVideoFilePath: string;
  outputFolder: string;
  maxDurationInSeconds: number;
};
export type MergeConfig = {
  inputVideoFolderPath: string;
  outputVideoPath: string;
};

export type VideoMeta = {
  path: string;
  width: number;
  height: number;
  duration: number;
  displayAspectRatio: string;
  bitRate: number;
};
