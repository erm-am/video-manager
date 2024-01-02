import { createChildProcess } from './utils.js';
import { createGetVideoInfoCommand } from './commands.js';

export type VideoMeta = {
  filePath: string;
  width: number;
  height: number;
  duration: number;
  displayAspectRatio: string;
  bitRate: number;
};
type GoupedVideoListByResolution = Record<`${number}:${number}`, VideoMeta[]>;

const checkDistinctResolutions = (videoList: GoupedVideoListByResolution): boolean => Object.entries(videoList).length > 1;

const getVideoListForScaling = (videoList: GoupedVideoListByResolution) => {
  const videoListEntries = Object.entries(videoList);
  const [mostUsedResolution, ...restVideoResolutions] = videoListEntries.toSorted(([, a], [, b]) => b.length - a.length);
  const [resulution] = mostUsedResolution;
  const videosToScale = restVideoResolutions.flatMap(([_resolution, videos]) => videos);
  return { resulution, videosToScale };
};

const getVideoMetaData = async (fileList: string[]) => {
  const ffprobeProcesses = await Promise.all(fileList.map(async (file) => createChildProcess('ffprobe', createGetVideoInfoCommand(file))));
  const videoMetaDataList = ffprobeProcesses.map<VideoMeta>(({ stdout }) => {
    const { streams, format } = JSON.parse(stdout);
    const [videoMeta] = streams;
    return {
      filePath: format.filename,
      width: videoMeta.width,
      height: videoMeta.height,
      duration: parseFloat(videoMeta.duration),
      displayAspectRatio: videoMeta.display_aspect_ratio,
      bitRate: parseFloat(videoMeta.bit_rate),
    };
  });
  return videoMetaDataList;
};

export { checkDistinctResolutions, getVideoListForScaling, getVideoMetaData };
