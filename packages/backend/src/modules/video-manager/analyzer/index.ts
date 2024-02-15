import { createChildProcess } from '@/utils/core.utils.js';
import { createGetVideoInfoCommand } from './commands.js';

import { groupVideoListByScreenResolution } from './utils.js';

import { ExcludeNull, TransformedFileTableRow } from '@/types.js';

const checkDistinctResolutions = (videoInfoList: TransformedFileTableRow[]): boolean => {
  return groupVideoListByScreenResolution(videoInfoList).length > 1;
};

const parseStdout = (stdout: string): Partial<TransformedFileTableRow> => {
  const { streams, format } = JSON.parse(stdout);
  const [videoMeta] = streams;
  return {
    path: format.filename,
    width: videoMeta.width,
    height: videoMeta.height,
    displayAspectRatio: videoMeta.display_aspect_ratio,
    duration: parseFloat(videoMeta.duration),
    bitRate: parseFloat(videoMeta.bit_rate),
  };
};

const getMetaData = async (videoFile: TransformedFileTableRow): Promise<Partial<TransformedFileTableRow>> => {
  const { stdout } = await createChildProcess('ffprobe', createGetVideoInfoCommand(videoFile.path));
  const videoInfo = parseStdout(stdout);
  return { id: videoFile.id, ...videoInfo };
};

const getVideoListToResize = (videoInfoList: TransformedFileTableRow[]) => {
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
