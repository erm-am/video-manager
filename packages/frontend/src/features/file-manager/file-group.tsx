import { RegisteredFile } from '@/shared/api/file-manager';
import { Button } from '@/shared/ui/button';
import styled from '@emotion/styled';
import React, { useState } from 'react';

type FileGroupProps = {
  id: number;
  amount: number;
  status: string;
  stage: string;
  files: RegisteredFile[];
  onStart: (id: number) => void;
};
export const FileGroup: React.FC<FileGroupProps> = ({ amount, status, stage, id, onStart }) => {
  return (
    <FileGroupContainer>
      <Row>{id}</Row>
      <Row>{amount}</Row>
      <Row>{status}</Row>
      <Row>{stage}</Row>
      <Button onClick={() => onStart(id)}>Start</Button>
    </FileGroupContainer>
  );
};
const FileGroupContainer = styled.div`
  border: 1px solid black;
  display: flex;
  flex-direction: row;
`;

const Row = styled.button`
  border: 1px solid black;
  display: flex;
  flex: 1;
`;
