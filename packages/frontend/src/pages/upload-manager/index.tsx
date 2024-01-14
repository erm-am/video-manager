import { DefaultLayout } from '@/layouts/default';
import { AcceptedFile, Uploader } from '@/shared/ui/uploader';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { httpClient } from '@/shared/api';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { useBufferTimer } from './use-buffer-timer';

export const UploadManagerPage = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<AcceptedFile[]>([]);
  const bufferTimer = useBufferTimer({
    delayedCallback: (bufferProgress) => {
      setAcceptedFiles((prev) => {
        return prev.map((file) => ({
          ...file,
          progress: bufferProgress.has(file.id) ? bufferProgress.get(file.id) : file.progress,
        }));
      });
    },
    delay: 1000,
  });

  const onDrop = (acceptedFiles: AcceptedFile[]) => setAcceptedFiles(acceptedFiles);
  const handleRemoveAll = () => setAcceptedFiles([]);
  const handleUploadFiles = () => {
    bufferTimer.start();
    const files = acceptedFiles.map(({ id, file }) => ({ id, file }));
    httpClient.fileUploader
      .parallelUploadFiles(files, (id, percent: number) => {
        bufferTimer.addToBuffer(id, percent);
      })
      .finally(() => {
        bufferTimer.stop();
      });
  };

  console.log('render');
  return (
    <DefaultLayout>
      <FileList>
        {acceptedFiles.map(({ id, file, progress }) => {
          return (
            <div key={id}>
              <ProgressBar progress={progress} />
              <File>{file.path}</File>
            </div>
          );
        })}
      </FileList>

      <Uploader onDrop={onDrop} />
      <div onClick={handleUploadFiles}>Загрузить</div>
      <div onClick={handleRemoveAll}>Удалить все</div>
    </DefaultLayout>
  );
};

const FileList = styled.div`
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
`;

const File = styled.div`
  border: 1px solid black;
`;
