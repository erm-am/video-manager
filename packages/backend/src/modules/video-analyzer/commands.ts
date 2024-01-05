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
