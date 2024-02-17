import { DefaultLayout } from '@/layouts/default';
import { Uploader } from '@/shared/ui/uploader';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { httpClient } from '@/shared/api';
import { ProgressBar } from '@/shared/ui/progress-bar';

import { useFileManagerStore } from './store';

export const FileManagerPage = () => {
  const initSocket = useFileManagerStore((state) => state.initSocket);
  const closeSocket = useFileManagerStore((state) => state.closeSocket);
  const getRegisteredFileList = useFileManagerStore((state) => state.getRegisteredFileList);
  const startMergeVideoFiles = useFileManagerStore((state) => state.startMergeVideoFiles);
  const uploads = useFileManagerStore((state) => state.uploads);

  useEffect(() => {
    // getRegisteredFileList();
    initSocket();
  }, []);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

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
      <div onClick={closeSocket}>Close socket</div>
      <div>
        {uploads.map(({ id, files }) => (
          <div key={id}>
            <h3 onClick={() => startMergeVideoFiles(id)}>(merge video files){id}</h3>
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
