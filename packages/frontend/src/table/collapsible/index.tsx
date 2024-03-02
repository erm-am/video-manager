import React, { ReactElement, useState } from 'react';
import { Table, TableHeader, TableHeaderRow, TableHeaderCell, TableBody, TableBodyRow, TableBodyCell } from '../base';
import styled from '@emotion/styled';
import { useTable } from '../use-table';
import { SubRow } from './sub-row';

//todo
type Row = {
  [key: string]: any;
  children?: Row[];
};
type EnhancedRow = Row & { meta: Meta };
type Meta = {
  level: number;
  pathCode: string;
  canExpand: boolean;
  expanded: boolean;
  getColumns: (props: { level: number }) => ReactElement;
  renderBodyValue: (props: { column: Column; row: EnhancedRow }) => ReactElement;
  renderHeaderValue: (props: { column: Column }) => ReactElement;
  toggleExpand: (pathCode: string) => void;
};

type Column = {
  id: string;
  header?: string | ((props: { column: Column }) => ReactElement);
  cell?: string | ((props: { column: Column; row: EnhancedRow }) => ReactElement);
  size?: number;
  sticky?: boolean;
};
type ColumnOptions = {
  level: number;
  columns: Column[];
};
type CollapsibleTableProps = {
  data: Row[];
  columns: ColumnOptions[];
};

export const CollapsibleTable: React.FC<CollapsibleTableProps> = (props) => {
  const { data, renderHeaderValue, renderBodyValue, getColumns, SubRowComponent } = useTable({
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
            {getColumns({ level: 1 }).map((column) => {
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
                  {getColumns({ level: 1 }).map((column) => {
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
