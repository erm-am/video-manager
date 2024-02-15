import { REDIS_CONNECTION } from '@/configs/redis.connection.config.js';
import { setupMetaParsingFlow } from './meta-parsing/index.js';
import { setupFileMergingFlow } from './file-merging/index.js';

export const metaParsingFlow = setupMetaParsingFlow(REDIS_CONNECTION);
export const fileMergingFlow = setupFileMergingFlow(REDIS_CONNECTION);
