import crypto from 'crypto';
import { execa } from 'execa';

export const getUniqHash = (length: number = 16) => crypto.randomBytes(length).toString('hex');
export const createChildProcess = (appName: string, params: string[][]) => execa(appName, params.flat());

export const coreUtils = {
  getUniqHash,
  createChildProcess,
};
