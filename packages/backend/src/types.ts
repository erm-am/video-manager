import { Prisma } from '@prisma/client';

export type ExcludeNull<T> = {
  [K in keyof T]: Exclude<T[K], null>;
};
export type FileTableRow = Prisma.$FilePayload['scalars'];
export type UploadTableRow = Prisma.$UploadPayload['scalars'];
export type UserTableRow = Prisma.$UserPayload['scalars'];

export type TransformedFileTableRow = {
  id: number;
  path: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  displayAspectRatio: string | null;
  bitRate: number | null;
};

export enum FileStatus {
  Uploaded = 'uploaded',
  Removed = 'removed',
}
export enum ParsingMetaStatus {
  Waiting = 'parsing_waiting',
  InProgress = 'parsing_in_progress',
  Completed = 'parsing_completed',
  Failed = 'parsing_failed',
}
export enum ResizeStatus {
  Waiting = 'resize_waiting',
  InProgress = 'resize_in_progress',
  Completed = 'resize_completed',
  Failed = 'resize_failed',
}
export enum MergeStatus {
  Waiting = 'merge_waiting',
  InProgress = 'merge_in_progress',
  Completed = 'merge_completed',
  Failed = 'merge_failed',
}

export type VideoResolution = {
  width: number;
  height: number;
};
