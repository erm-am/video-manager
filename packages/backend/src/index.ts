import path from 'path';

import { VIDEO_FOLDER_PATH } from './configs/core.config.js';
import { PrismaClient } from '@prisma/client';
import { server } from './server.js';

server()
  .then((server) => {
    server.listen({ port: 4000 });
  })
  .catch((error) => {
    console.log(error);
  });

// await videoManager.merge({
//   inputVideoFolderPath: VIDEO_FOLDER_PATH,
//   outputVideoPath: path.resolve(process.cwd(), '1.mp4'),
// });

// await videoManager.split({
//   inputVideoFilePath: path.resolve(process.cwd(), '1.mp4'),
//   outputFolder: path.resolve(process.cwd(), 'output/'),
//   maxDurationInSeconds: 60,
// });
