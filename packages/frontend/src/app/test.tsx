import React, { useRef, useEffect } from 'react';
import { binarySearch, compareTimeRange } from '../shared/utils/bsearch';
import { englishMock } from '../shared/mocks/english-subtitles';
import { russianMock } from '../shared/mocks/russian-subtitles';
export const App1 = () => {
  // Todo
  // Todo
  // Todo
  const secToMs = (sec) => sec * 1000;

  const merge = (russian, english) => {
    if (russian.length !== english.length) throw new Error('Invalid length');
    return english.map((phrase, index) => ({
      english: phrase.text,
      russian: russian[index].text,
      startMs: phrase.startMs,
      endMs: phrase.startMs + phrase.durationMs,
      durationMs: phrase.durationMs,
      tokens: phrase.tokens && phrase.tokens.map((token) => ({ ...token, endMs: token.startMs + token.durationMs })),
    }));
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoLoaded = () => {
    console.log('Video duration:', videoRef.current.duration);
  };
  const handleVideoTimeUpdated = () => {
    if (videoRef.current) {
      const currentTime = secToMs(videoRef.current.currentTime);
      const result = merge(russianMock.subtitles, englishMock.subtitles);
      const phrase = binarySearch(result, currentTime, compareTimeRange);
      if (phrase) {
        console.log(phrase.english);
        if (phrase.tokens) {
          const token = binarySearch(phrase.tokens, currentTime, compareTimeRange);
          console.log(token.text);
        }
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleVideoLoaded);
      videoRef.current.addEventListener('timeupdate', handleVideoTimeUpdated);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleVideoLoaded);
        videoRef.current.removeEventListener('timeupdate', handleVideoTimeUpdated);
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} src="test.mp4" controls></video>
    </div>
  );
};
