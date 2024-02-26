import styled from '@emotion/styled';
import React from 'react';
import { FileGroup } from './file-group';
import { RegisteredUpload } from '@/shared/api/file-manager';
import { useWebSocket } from '@/shared/ws/use-web-socket';
import { useFileManagerStore } from './model';

type FileManagerProps = {
  fileGroupList?: RegisteredUpload[];
};
export const FileManager: React.FC<FileManagerProps> = ({ fileGroupList }) => {
  const fileManagerStore = useFileManagerStore();
  useWebSocket('ws://127.0.0.1:4000/ws', (message) => {
    if (message.type === 'UPLOAD_LIST') fileManagerStore.updateUploadList(message.payload);
  });

  return (
    <FileManagerContainer>
      {fileManagerStore.uploads.map((fileGroup) => {
        return (
          <FileGroup
            key={fileGroup.id}
            id={fileGroup.id}
            files={fileGroup.files}
            amount={fileGroup.amount}
            status={fileGroup.status}
            stage={fileGroup.stage}
            onStart={fileManagerStore.startToMergeVideoFiles}
          />
        );
      })}
    </FileManagerContainer>
  );
};
const FileManagerContainer = styled.div`
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;
