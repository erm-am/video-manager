import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTreeEnhancer } from './utils';

export const useTable = (options) => {
  const [expandedIds, setExpandedIds] = useState<Map<string, boolean>>(new Map());
  const [columns, setColumns] = useState(options.columns);
  const [data, setData] = useState([]);

  const getColumns = useCallback(({ level }) => {
    return columns.find((item) => item.level === level).columns;
  }, []);

  const renderBodyValue = useCallback(({ column, row }) => {
    if (!column?.cell) return row[column.id];
    return typeof column.cell === 'function' ? column.cell({ column, row }) : column.cell;
  }, []);
  const renderHeaderValue = useCallback(({ column }) => {
    return typeof column.header === 'function' ? column.header({ column }) : column.header;
  }, []);

  const toggleExpand = useCallback((pathCode) => {
    setExpandedIds((prev) => new Map(prev).set(pathCode, !prev.get(pathCode)));
  }, []);
  const getIsExpanded = useCallback((pathCode: string) => !!expandedIds.get(pathCode), [expandedIds]);
  const treeEnhancer = useMemo(() => createTreeEnhancer(toggleExpand, getColumns, renderBodyValue, renderHeaderValue, getIsExpanded), []);

  useEffect(() => {
    setData(treeEnhancer(options.data));
  }, [options.data]);

  return {
    data,
    columns,
    getIsExpanded,
    renderHeaderValue,
    renderBodyValue,
    getColumns,
    SubRowComponent: options.callapsibleModel.subComponent,
  };
};
