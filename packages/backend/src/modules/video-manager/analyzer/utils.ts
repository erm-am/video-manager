import { VideoMeta } from '../types.js';

export const groupVideoListByScreenResolution = (videoInfoList: VideoMeta[]) => {
  const groupedVideoList = Object.groupBy(videoInfoList, ({ width, height }) => `${width}:${height}`);
  return Object.entries(groupedVideoList);
};
