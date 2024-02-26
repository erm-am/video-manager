import { createChildProcess } from '@/utils/core.utils.js';
import { createGetVideoInfoCommand } from './commands.js';

import { groupVideoListByScreenResolution } from './utils.js';

import { ExcludeNull, FileRow, FileTableRow, ParsedMetaData } from '@/types.js';

const checkDistinctResolutions = (videoInfoList: FileTableRow[]): boolean => {
  return groupVideoListByScreenResolution(videoInfoList).length > 1;
};

const parseStdout = (stdout: string): ParsedMetaData => {
  const { streams, format } = JSON.parse(stdout);
  const [videoMeta] = streams;
  return {
    path: format.filename,
    width: parseInt(videoMeta.width),
    height: parseInt(videoMeta.height),
    displayAspectRatio: videoMeta.display_aspect_ratio,
    duration: parseFloat(videoMeta.duration),
    bitRate: parseFloat(videoMeta.bit_rate),
  };
};

const getMetaData = async (videoFile: FileRow): Promise<FileRow> => {
  const { stdout } = await createChildProcess('ffprobe', createGetVideoInfoCommand(videoFile.path));
  const parsedMetaData = parseStdout(stdout);
  return { ...videoFile, ...parsedMetaData };
};

const getVideoListToResize = (videoInfoList: FileTableRow[]) => {
  const videosGroupedByScreenResolution = groupVideoListByScreenResolution(videoInfoList);
  const [mostUsedVideoResolution, ...restVideos] = videosGroupedByScreenResolution.toSorted(([, a], [, b]) => b.length - a.length);
  const [resulution] = mostUsedVideoResolution;
  const [width, height] = resulution.split(':');
  const videosToResize = restVideos.flatMap(([_, videos]) => videos);
  return {
    targetResolution: {
      width: parseInt(width),
      height: parseInt(height),
    },
    videosToResize,
  };
};

export const videoAnalizer = {
  getMetaData,
  checkDistinctResolutions,
  getVideoListToResize,
};
