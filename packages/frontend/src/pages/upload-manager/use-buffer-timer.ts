import { useEffect, useRef, useState } from 'react';

type Buffer = Map<number, number>;
type Options = {
  delayedCallback: (buffer: Buffer) => void;
  delay: number;
};
type UseBufferTimerReturn = {
  addToBuffer: (key: number, value: number) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
  isRunning: boolean;
};

//
// Описание:
// 1) Накопление данных в Map структуре.
// 2) Запуск отложенного колбека с использованием накопленных данных.
//
// Пример #1:
// При параллельном получении Axios.ProgressEvent из onUploadProgress нам необходимо рендерить прогресс столько раз, сколько срабатывает ProgressEvent.
// Для предотвращения нескольких рендеров мы агрегируем все данные в одном месте и выводим их отложенно.

export const useBufferTimer = (options: Options): UseBufferTimerReturn => {
  const buffer = useRef<Buffer>(new Map());
  const [timer, setTimer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const start = () => setIsRunning(true);
  const stop = () => {
    delay(options.delay).then(() => setIsRunning(false));
  };
  const addToBuffer = (key, value) => {
    if (buffer.current) buffer.current.set(key, value);
  };
  const destroy = () => {
    if (buffer.current) buffer.current.clear();
    clearInterval(timer);
  };
  useEffect(() => {
    if (isRunning) {
      const timerId = setInterval(() => {
        if (buffer.current && isRunning && options.delayedCallback) {
          options.delayedCallback(buffer.current);
        }
      }, options.delay);
      if (!timer) setTimer(timerId);
    } else {
      clearInterval(timer);
      setTimer(null);
    }

    return () => destroy();
  }, [isRunning]);

  return { addToBuffer, destroy, stop, start, isRunning };
};
