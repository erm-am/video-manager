import path from 'path';
import { videoCombine } from './services/video-combine/index.js';
import { ONE_HOUR_IN_SECONDS, VIDEO_FOLDER_PATH } from './shared/config.js';

// await videoCombine.merge({
//   inputVideoFolderPath: VIDEO_FOLDER_PATH,
//   outputVideoPath: path.resolve(process.cwd(), '1.mp4'),
// });

await videoCombine.split({
  inputVideoFilePath: path.resolve(process.cwd(), '1.mp4'),
  outputFolder: path.resolve(process.cwd(), 'output/'),
  maxDurationInSeconds: 60,
});
