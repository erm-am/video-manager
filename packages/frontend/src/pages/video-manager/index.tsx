import { FileManager } from '@/features/file-manager';
import { UploadManager } from '@/features/upload-manager';
import { DefaultLayout } from '@/layouts/default';
import styled from '@emotion/styled';
import React from 'react';

export const VideoManager = () => {
  return (
    <DefaultLayout>
      <VideoManagerContainer>
        <FileManager />
        <UploadManager />
      </VideoManagerContainer>
    </DefaultLayout>
  );
};

const VideoManagerContainer = styled.div`
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;
