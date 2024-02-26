import { Prisma } from '@prisma/client';

export type ExcludeNull<T> = {
  [K in keyof T]: Exclude<T[K], null>;
};
export type FileTableRow = Prisma.$FilePayload['scalars'];
export type UploadTableRow = Prisma.$UploadGroupPayload['scalars'];
export type UserTableRow = Prisma.$UserPayload['scalars'];
export type FileRow = ExcludeNull<FileTableRow>;
export type UploadRow = ExcludeNull<UploadTableRow>;
export type UserRow = ExcludeNull<UserTableRow>;

export enum Stage {
  UPLOAD = 'UPLOAD',
  PARSE = 'PARSE',
  RESIZE = 'RESIZE',
  MERGE = 'MERGE',
}
export enum Status {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type VideoResolution = {
  width: number;
  height: number;
};

export type ParsedMetaData = {
  path: string;
  width: number;
  height: number;
  displayAspectRatio: string;
  duration: number;
  bitRate: number;
};

export type StageAndStatusOptions = {
  status: Status;
  stage: Stage;
};
