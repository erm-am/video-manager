import React from 'react';

import { Table, TableBody, TableBodyCell, TableBodyRow, TableHeader, TableHeaderCell, TableHeaderRow } from '../base';

//Todo: автоматический рендеринг имен заголовков

export const SubRow = ({ row }) => {
  const parentColumnsQuantity = Object.keys(row).length + 1;
  return (
    <TableBodyRow>
      <TableBodyCell colSpan={parentColumnsQuantity}>
        <Table width="100%">
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell size={60}>{/* expand all */}</TableHeaderCell>
              <TableHeaderCell>id</TableHeaderCell>
              <TableHeaderCell>stage</TableHeaderCell>
              <TableHeaderCell>status</TableHeaderCell>
              <TableHeaderCell>name</TableHeaderCell>
              <TableHeaderCell>width</TableHeaderCell>
              <TableHeaderCell>height</TableHeaderCell>
              <TableHeaderCell>bitRate</TableHeaderCell>
              <TableHeaderCell>displayAspectRatio</TableHeaderCell>
              <TableHeaderCell>duration</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {row.children.map((subRow) => {
              return (
                <>
                  <TableBodyRow key={`${row.id}-${subRow.id}`}>
                    <TableBodyCell>
                      {subRow.meta.canExpand && (
                        <span
                          style={{ paddingLeft: `${subRow.meta.level * 5}px` }}
                          onClick={() => {
                            subRow.meta.toggleExpand(subRow.meta.pathCode);
                          }}
                        >
                          {subRow.meta.expanded ? '👇' : '👉'}
                        </span>
                      )}
                    </TableBodyCell>
                    <TableBodyCell>{subRow.id}</TableBodyCell>
                    <TableBodyCell>{subRow.stage}</TableBodyCell>
                    <TableBodyCell>{subRow.status}</TableBodyCell>
                    <TableBodyCell>{subRow.name}</TableBodyCell>
                    <TableBodyCell>{subRow.width}</TableBodyCell>
                    <TableBodyCell>{subRow.height}</TableBodyCell>
                    <TableBodyCell>{subRow.bitRate}</TableBodyCell>
                    <TableBodyCell>{subRow.displayAspectRatio}</TableBodyCell>
                    <TableBodyCell>{subRow.duration}</TableBodyCell>
                  </TableBodyRow>
                  {subRow.meta.expanded && subRow.children.length && <SubRow row={subRow} />}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableBodyCell>
    </TableBodyRow>
  );
};
