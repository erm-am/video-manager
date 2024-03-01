import React, { useState } from 'react';
import { Table, TableHeader, TableHeaderRow, TableHeaderCell, TableBody, TableBodyRow, TableBodyCell } from '../base';
import styled from '@emotion/styled';
import { useTable } from '../use-table';
import { SubRow } from './sub-row';

type CollapsibleTableProps = {
  data: any;
  columns: any;
};

export const CollapsibleTable: React.FC<CollapsibleTableProps> = (props) => {
  const { columns, data, renderHeaderValue, renderBodyValue, SubRowComponent } = useTable({
    columns: props.columns,
    data: props.data,
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
                <TableHeaderCell key={column.id} size={column.size} sticky={column.sticky}>
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
                <TableBodyRow key={row.id}>
                  {columns.map((column) => {
                    return (
                      <TableBodyCell key={column.id} sticky={column.sticky}>
                        {renderBodyValue({ column, row })}
                      </TableBodyCell>
                    );
                  })}
                </TableBodyRow>
                {row.meta.expanded && <SubRowComponent key={row.id} row={row} />}
              </>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
};
export const Container = styled.div`
  overflow-x: auto;
  width: 100%;
`;
