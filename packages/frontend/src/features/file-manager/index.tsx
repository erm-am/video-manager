import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { RegisteredUpload } from '@/shared/api/file-manager';
import { useWebSocket } from '@/shared/ws/use-web-socket';
import { useFileManagerStore } from './model';
import { TableBodyCell } from '@/table/base';
import { CollapsibleTable } from '@/table/collapsible';
import { Button } from '@/shared/ui/button';

export const FileManager: React.FC = () => {
  const fileManagerStore = useFileManagerStore();
  useWebSocket('ws://127.0.0.1:4000/ws', (message) => {
    if (message.type === 'UPLOAD_LIST') fileManagerStore.updateUploadList(message.payload);
  });

  const columns = useMemo(
    () => [
      {
        id: 'files',
        header: '👉',
        size: 60,
        cell: ({ row }) => {
          return (
            row.meta.canExpand && (
              <TableBodyCell>
                <span
                  style={{ paddingLeft: `${row.meta.level * 10}px` }}
                  onClick={() => {
                    row.meta.toggleExpand(row.meta.pathCode);
                  }}
                >
                  {row.meta.expanded ? '👇' : '👉'}
                </span>
              </TableBodyCell>
            )
          );
        },
      },
      { id: 'id', header: 'id', size: 60 },
      { id: 'amount', header: 'amount', size: 60 },
      { id: 'groupName', header: 'groupName', size: 120 },
      { id: 'stage', header: 'stage', size: 120 },
      { id: 'status', header: 'status', size: 120 },
      {
        id: 'actions',
        header: <div>actions</div>,
        sticky: true,
        cell: ({ row }) => {
          return <Button onClick={() => fileManagerStore.startToMergeVideoFiles(row.id)}>Merge</Button>;
        },
      },
    ],
    [],
  );
  return (
    <FileManagerContainer>
      <CollapsibleTable columns={columns} data={fileManagerStore.uploads} />
    </FileManagerContainer>
  );
};
const FileManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
