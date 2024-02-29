import { useState } from 'react';

export const useTable = (options) => {
  const toggleExpand = (code) => {
    function findAndUpdateExpanded(data, code) {
      return data.map((item) => {
        if (item.code === code) {
          item.meta.expanded = !item.meta.expanded;
        } else if (item.children) {
          item.children = findAndUpdateExpanded(item.children, code);
        }
        return item;
      });
    }

    setData((prev) => {
      return findAndUpdateExpanded(prev, code);
    });
  };

  const tableTreeEnhancer = (data, parentCode = '') => {
    const generateItemCode = (index, parentCode) => (parentCode ? `${parentCode}.${index + 1}` : (index + 1).toString());
    const level = parentCode.split('.').length;
    return data.map((item, index) => {
      const itemCode = generateItemCode(index, parentCode);
      const meta = { level, expanded: false, canExpand: !!item.children, toggleExpand: toggleExpand };
      return !item.children
        ? { ...item, meta, code: itemCode }
        : { ...item, meta, code: itemCode, children: tableTreeEnhancer(item.children, itemCode) };
    });
  };

  const [columns, setColumns] = useState(options.columns);
  const [data, setData] = useState(tableTreeEnhancer(options.data));

  const renderHeaderValue = ({ column }) => {
    return typeof column.header === 'function' ? column.header(column) : column.header;
  };

  const renderBodyValue = ({ column, row }) => {
    if (!column?.cell) return row[column.id];
    return typeof column.cell === 'function' ? column.cell({ column, row }) : column.cell;
  };

  return { data, columns, renderHeaderValue, renderBodyValue, SubRowComponent: options.callapsibleModel.subComponent };
};
