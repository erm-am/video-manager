import { DefaultLayout } from '@/layouts/default';
import { Uploader } from '@/shared/ui/uploader';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { httpClient } from '@/shared/api';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { useWebSocket } from '@/shared/ws/use-web-socket';
import { useFileManagerStore } from './store';
export const FileManagerPage = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  const updateUploadList = useFileManagerStore((state) => state.updateUploadList);
  const startMergeVideoFiles = useFileManagerStore((state) => state.startMergeVideoFiles);
  const uploads = useFileManagerStore((state) => state.uploads);
  const { status, sendMessage, closeSocket } = useWebSocket('ws://127.0.0.1:4000/ws', (message) => {
    if (message.type === 'UPLOAD_LIST') updateUploadList(message.payload);
  });
  const onDrop = (acceptedFiles: File[]) => setAcceptedFiles(acceptedFiles);
  const handleRemoveAll = () => {
    setProgress(0);
    setAcceptedFiles([]);
  };
  const handleUploadFiles = () => {
    httpClient.fileManager.uploadFiles(acceptedFiles, (percent) => setProgress(percent)).catch(() => setProgress(0));
  };
  // TODO, временное решение

  return (
    <DefaultLayout>
      <div>
        {uploads.map(({ id, files, status }) => (
          <div key={id}>
            <h3 onClick={() => startMergeVideoFiles(id)}>
              (merge video files){id} - <span style={{ color: 'red' }}>{status}</span>
            </h3>
            <div>
              {files.map((file) => (
                <div key={file.name} style={{ display: 'flex' }}>
                  <div>{file.name}</div>
                  <div> - {file.status}</div>
                  <div>
                    - {file.height}x{file.height} - {file.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ProgressBar progress={progress} />
      <FileList>
        {acceptedFiles.map((file) => {
          return (
            <div key={file.name}>
              <File>{file.name}</File>
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
