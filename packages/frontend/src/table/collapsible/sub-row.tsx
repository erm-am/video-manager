import React from 'react';

import { Table, TableBody, TableBodyCell, TableBodyRow, TableHeader, TableHeaderCell, TableHeaderRow } from '../base';

export const SubRow = ({ row }) => {
  const parentColumnsQuantity = Object.keys(row).length + 1;
  return (
    <TableBodyRow>
      <TableBodyCell colSpan={parentColumnsQuantity}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              {row.meta.getColumns({ level: row.meta.level + 1 }).map((column) => {
                return (
                  <TableHeaderCell key={column.id} size={column.size} sticky={column.sticky}>
                    {row.meta.renderHeaderValue({ column })}
                  </TableHeaderCell>
                );
              })}
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {row.children.map((row) => {
              return (
                <>
                  <TableBodyRow key={row.id}>
                    {row.meta.getColumns({ level: row.meta.level }).map((column) => {
                      return (
                        <TableBodyCell key={column.id} sticky={column.sticky}>
                          {row.meta.renderBodyValue({ column, row })}
                        </TableBodyCell>
                      );
                    })}
                  </TableBodyRow>
                  {row.meta.getIsExpanded(row.meta.pathCode) && <SubRow key={row.id} row={row} />}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableBodyCell>
    </TableBodyRow>
  );
};
