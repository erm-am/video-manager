import { TransformedFileTableRow } from '@/types.js';

export const groupVideoListByScreenResolution = (videoInfoList: TransformedFileTableRow[]) => {
  const groupedVideoList = Object.groupBy(videoInfoList, ({ width, height }) => `${width}:${height}`);
  return Object.entries(groupedVideoList);
};
