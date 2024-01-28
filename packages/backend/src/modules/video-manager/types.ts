export type SplitConfig = {
  inputVideoFilePath: string;
  outputFolder: string;
  maxDurationInSeconds: number;
};

export type VideoMeta = {
  path: string;
  width: number;
  height: number;
  duration: number;
  displayAspectRatio: string;
  bitRate: number;
};

export type MergeConfig = {
  files: VideoMeta[];
  outputVideoPath: string;
};
