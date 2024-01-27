import React, { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';
import css from '@emotion/core';

interface ProgressBarProps {
  progress: number;
}
export const ProgressBar = (props: ProgressBarProps) => {
  const { progress } = props;
  return (
    <ProgressBarContainer>
      <Progress progress={progress} />
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.div`
  display: flex;
  border-radius: 4px;
  height: 2px;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #d7d7d7;
`;

const Progress = styled.div<{ progress: number }>`
  height: 100%;

  width: ${({ progress }) => progress}%;
  background-color: #4bbd37;
  transition: width 0.3s ease-in-out;
`;
