import { DefaultLayout } from '@/layouts/default';
import { Uploader } from '@/shared/ui/uploader';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { httpClient } from '@/shared/api';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { FileWithPath } from 'react-dropzone';
import { useFileManagerStore } from './store';

export const FileManagerPage = () => {
  const getRegisteredFileList = useFileManagerStore((state) => state.getRegisteredFileList);
  const startFileAnalysis = useFileManagerStore((state) => state.startFileAnalysis);
  const startMergeVideoFiles = useFileManagerStore((state) => state.startMergeVideoFiles);
  const fileList = useFileManagerStore((state) => state.fileList);
  const groupedFileList = useFileManagerStore((state) => state.groupedFileList);
  useEffect(() => {
    getRegisteredFileList();
  }, []);
  const [acceptedFiles, setAcceptedFiles] = useState<FileWithPath[]>([]);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles: FileWithPath[]) => setAcceptedFiles(acceptedFiles);
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
        {groupedFileList.map(({ uploadId, files }) => (
          <div key={uploadId}>
            <h3 onClick={() => startFileAnalysis(uploadId)}>(start meta parser){uploadId}</h3>

            <h3 onClick={() => startMergeVideoFiles(uploadId)}>(merge video files){uploadId}</h3>
            <div>
              {files.map((file) => (
                <div style={{ display: 'flex' }}>
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
