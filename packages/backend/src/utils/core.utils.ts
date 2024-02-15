import crypto from 'crypto';
import { execa } from 'execa';

export const getUniqHash = (length: number = 16) => crypto.randomBytes(length).toString('hex');
export const createChildProcess = (appName: string, params: string[][]) => execa(appName, params.flat());
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const utils = {
  getUniqHash,
  createChildProcess,
  sleep,
};
