export const createJoinVideosCommand = (inputFilePath: string, outputFilePath: string) => {
  // Склеить видео без перекодирования
  // Есть ограничения (разрешения экрана должно совпадать)
  // Todo: использовать createCudaResizeCommand перед импортом видео.
  return [['-y'], ['-hide_banner'], ['-f', 'concat'], ['-safe', '0'], ['-i', inputFilePath], ['-c', 'copy'], [outputFilePath]];
};

export const createSplitVideoCommand = (
  inputFilePath: string,
  outputFilePath: string,
  outputFileName: string,
  maxDurationInSeconds: number,
) => {
  // Разбить видео на несколько частей
  return [
    ['-y'],
    ['-hide_banner'],
    ['-i', inputFilePath],
    ['-map', '0'],
    ['-c', 'copy'],
    ['-f', 'segment'],
    ['-segment_time', maxDurationInSeconds.toString()],
    ['-reset_timestamps', '1'],
    [`output_%03d.mp4`],
  ];
};

export const createReplaceAudioCommand = (inputVideoFilePath: string, inputAudioFilePath: string, outputFileName: string) => {
  // Заменить аудиодорожку в видео
  return [
    ['-y'],
    ['-hide_banner'],
    ['-i', inputVideoFilePath],
    ['-i', inputAudioFilePath],
    ['-map', '0:v'],
    ['-map', '1:a'],
    ['-c', 'copy'],
    ['shortest'],
    [outputFileName],
  ];
};
export const createCudaResizeCommand = (resulution: string, inputVideoFilePath: string, outputFileName: string) => {
  // Преобзование разрешение видео через GPU (функция только для Nvidia)
  // https://docs.nvidia.com/video-technologies/video-codec-sdk/12.1/ffmpeg-with-nvidia-gpu/index.html
  // https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new
  return [
    ['-y'],
    ['-hide_banner'],
    ['-vsync', '0'],
    ['-hwaccel', 'cuda'],
    ['-hwaccel_output_format', 'cuda'],
    ['-i', inputVideoFilePath],
    ['-vf', `scale_cuda=${resulution}`],
    ['-c:a', 'copy'],
    ['-c:v', 'h264_nvenc'],
    [outputFileName],
  ];
};

export const createAMDResizeCommand = () => {
  // Todo
  return [[]];
};

export const createGetVideoInfoCommand = (inputVideoFilePath: string) => {
  // Получить информацию о видео через ffprobe
  return [
    ['-hide_banner'],
    ['-show_format'],
    ['-v', 'panic'],
    ['-select_streams', 'v:0'],
    ['-print_format', 'json'],
    ['-show_entries', 'stream=bit_rate,width,height,display_aspect_ratio,duration'],
    [inputVideoFilePath],
  ];
};
