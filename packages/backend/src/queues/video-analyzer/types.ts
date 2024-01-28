export type VideoAnalyzerJobData = {
  videoPath: string;
  fileId: number;
  uploadId: string;
  fileName: string;
};

export type VideoAnalyzerResultJobData = {
  path: string;
  width: number;
  height: number;
  duration: number;
  displayAspectRatio: string;
  bitRate: number;
};

export type VideoAnalyzerJobResult = {
  queueName: string;
  job: {
    id: number;
    name: string;
    data: VideoAnalyzerJobData;
  };
  result: VideoAnalyzerResultJobData;
};
