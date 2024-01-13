import { createChildProcess } from '@/utils/core.utils.js';
import { createGetVideoInfoCommand } from './commands.js';
import { VideoMeta } from './types.js';
import { groupVideoListByScreenResolution } from './utils.js';

const checkDistinctResolutions = (videoInfoList: VideoMeta[]): boolean => {
  return groupVideoListByScreenResolution(videoInfoList).length > 1;
};

const parseStdout = (stdout: string): VideoMeta => {
  const { streams, format } = JSON.parse(stdout);
  const [videoMeta] = streams;
  return {
    path: format.filename,
    width: videoMeta.width,
    height: videoMeta.height,
    duration: parseFloat(videoMeta.duration),
    displayAspectRatio: videoMeta.display_aspect_ratio,
    bitRate: parseFloat(videoMeta.bit_rate),
  };
};
const getMetaInfo = async (videoFilePath: string): Promise<VideoMeta> => {
  const { stdout } = await createChildProcess('ffprobe', createGetVideoInfoCommand(videoFilePath));
  const videoInfo = parseStdout(stdout);
  return videoInfo;
};

const getMetaInfoList = async (videoFilePathList: string[]): Promise<VideoMeta[]> => {
  const ffprobeProcesses = await Promise.all(
    videoFilePathList.map((videoFilePath) => createChildProcess('ffprobe', createGetVideoInfoCommand(videoFilePath))),
  );
  const videoInfoList = ffprobeProcesses.map(({ stdout }) => parseStdout(stdout));
  return videoInfoList;
};

const getVideoListForScaling = (videoInfoList: VideoMeta[]) => {
  const videoListEntries = groupVideoListByScreenResolution(videoInfoList);
  const [mostUsedResolution, ...restVideoResolutions] = videoListEntries.toSorted(([, a], [, b]) => b.length - a.length);
  const [resolution] = mostUsedResolution;
  const videosToScale = restVideoResolutions.flatMap(([_resolution, videos]) => videos);
  return { resolution, videosToScale };
};

export const videoAnalizer = {
  getMetaInfo,
  getMetaInfoList,
  checkDistinctResolutions,
  getVideoListForScaling,
};
