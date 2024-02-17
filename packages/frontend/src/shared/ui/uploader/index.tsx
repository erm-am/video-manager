import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';

type UploaderProps = {
  onDrop: (acceptedFiles: File[]) => void;
};
export const Uploader = (props: UploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      props.onDrop(acceptedFiles);
    },
    [props.onDrop],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <UploaderContainer {...getRootProps()}>
      <UploaderInput {...getInputProps()} />
      <Message>Click to upload or drag and drop</Message>
    </UploaderContainer>
  );
};

const UploaderContainer = styled.div`
  display: flex;
  height: 300px;
  background-color: gray;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
`;
const UploaderInput = styled.input``;
const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
