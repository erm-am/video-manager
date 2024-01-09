import { DefaultLayout } from '@/layouts/default';
import { Uploader } from '@/shared/ui/uploader';
import React, { useEffect, useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import styled from '@emotion/styled';

export const UploadManagerPage = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  };

  return (
    <DefaultLayout>
      <FileList>
        {files.map((file) => {
          return <File key={file.name}>{file.path} </File>;
        })}
      </FileList>

      <Uploader onDrop={onDrop} />
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
