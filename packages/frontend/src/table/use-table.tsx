import { useEffect, useMemo, useState } from 'react';
import { createTreeEnhancer, findAndUpdateExpanded } from './utils';

export const useTable = (options) => {
  const [columns, setColumns] = useState(options.columns);
  const [data, setData] = useState([]);

  const toggleExpand = (pathCode) => {
    setData((prev) => {
      return findAndUpdateExpanded(prev, pathCode);
    });
  };

  const treeEnhancer = useMemo(() => createTreeEnhancer(toggleExpand), []);

  useEffect(() => {
    setData(treeEnhancer(options.data));
  }, [options.data]);

  const renderHeaderValue = ({ column }) => {
    return typeof column.header === 'function' ? column.header(column) : column.header;
  };

  const renderBodyValue = ({ column, row }) => {
    if (!column?.cell) return row[column.id];
    return typeof column.cell === 'function' ? column.cell({ column, row }) : column.cell;
  };

  return { data, columns, renderHeaderValue, renderBodyValue, SubRowComponent: options.callapsibleModel.subComponent };
};
