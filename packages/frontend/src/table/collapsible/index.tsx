import React, { useState } from 'react';
import { Table, TableHeader, TableHeaderRow, TableHeaderCell, TableBody, TableBodyRow, TableBodyCell } from '../base';
import styled from '@emotion/styled';
import { useTable } from '../use-table';
import { SubRow } from './sub-row';

export const CollapsibleTable: React.FC = (props) => {
  const dataSource = {
    columns: [
      {
        id: 'expand',
        header: '👉',
        // size: 60,
        cell: ({ row }) => {
          return (
            row.meta.canExpand && (
              <TableBodyCell>
                <span
                  style={{ paddingLeft: `${row.meta.level * 10}px` }}
                  onClick={() => {
                    row.meta.toggleExpand(row.code);
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
      { id: 'stage', header: 'stage', size: 120 },
      { id: 'status', header: 'status', size: 120 },
      {
        id: 'actions',
        header: <div>actions</div>,
        sticky: true,
        cell: <div>actions</div>,
      },
    ],
    data: [
      {
        id: 1,
        amount: 555,
        stage: 'parse',
        status: 'end',
        children: [
          {
            id: 1,
            children: [
              {
                id: 1,
                children: [
                  {
                    id: 1,
                    children: [
                      {
                        id: 1,
                        children: [{ id: 1, children: [{ id: 1, children: [{ id: 1, children: [{ id: 1, children: [{ id: 1 }] }] }] }] }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        id: 2,
        amount: 555,
        stage: 'parse',
        status: 'end',
      },
    ],
  };

  const { columns, data, renderHeaderValue, renderBodyValue, SubRowComponent } = useTable({
    columns: dataSource.columns,
    data: dataSource.data,
    callapsibleModel: {
      subComponent: SubRow,
    },
  });

  return (
    <Container>
      <Table>
        <TableHeader>
          <TableHeaderRow>
            {columns.map((column) => {
              return (
                <TableHeaderCell size={column.size} sticky={column.sticky}>
                  {renderHeaderValue({ column })}
                </TableHeaderCell>
              );
            })}
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            return (
              <>
                <TableBodyRow>
                  {columns.map((column) => {
                    return <TableBodyCell sticky={column.sticky}>{renderBodyValue({ column, row })}</TableBodyCell>;
                  })}
                </TableBodyRow>
                {row.meta.expanded && <SubRowComponent row={row} />}
              </>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
};
export const Container = styled.div`
  border: 1px solid green;
  overflow-x: auto;
  width: 100%;
`;
