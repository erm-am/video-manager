import { DefaultLayout } from '@/layouts/default';
import { Uploader } from '@/shared/ui/uploader';
import React, { useEffect, useRef, useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import styled from '@emotion/styled';
import { httpClient } from '@/shared/api';
import { AxiosProgressEvent } from 'axios';

export const UploadManagerPage = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const onDrop = (acceptedFiles: FileWithPath[]) => setFiles(acceptedFiles);

  const handleUpload = async () => {
    await httpClient.fileUploader.parallelUploadFiles(files, (id, progressEvent: AxiosProgressEvent) => {
      const { loaded, total, progress } = progressEvent;
      let percent = Math.floor(progress * 100);
      console.log(`id:${id} -> ${percent}`);
    });
  };

  return (
    <DefaultLayout>
      <FileList>
        {files.map((file) => {
          return <File key={file.name}>{file.path} </File>;
        })}
      </FileList>
      <Uploader onDrop={onDrop} />
      <div onClick={handleUpload}>Загрузить</div>
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
