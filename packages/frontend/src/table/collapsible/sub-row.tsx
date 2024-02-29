import React from 'react';

import { TableBodyCell, TableBodyRow } from '../base';

export const SubRow = ({ row }) => {
  return row.children.map((row) => {
    return (
      <>
        <TableBodyRow>
          <TableBodyCell>
            {row.meta.canExpand && (
              <div
                style={{ paddingLeft: `${row.meta.level * 5}px` }}
                onClick={() => {
                  row.meta.toggleExpand(row.code);
                }}
              >
                {row.meta.expanded ? '👇' : '👉'}
              </div>
            )}
          </TableBodyCell>
          {row.meta.level === 1 && <>{<TableBodyCell colSpan={5}>test</TableBodyCell>}</>}
        </TableBodyRow>
        {row.meta.expanded && row.children.length && <SubRow row={row} />}
      </>
    );
  });
};
