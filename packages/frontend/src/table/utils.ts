type CollapsibleProps = {
  toggleExpand: () => void;
};
const generatePathCode = (index, path) => (path ? `${path}.${index + 1}` : (index + 1).toString());
export const createTreeEnhancer = (toggleExpand) => {
  const enhanceTree = (data, parentPathCode = '') => {
    return data.map((item, index) => {
      const pathCode = generatePathCode(index, parentPathCode);
      const level = pathCode.split('.').length;
      const meta = { level, expanded: false, canExpand: !!item.children, toggleExpand, pathCode: pathCode };
      return !item.children ? { ...item, meta } : { ...item, meta, children: enhanceTree(item.children, pathCode) };
    });
  };
  return enhanceTree;
};

export const findAndUpdateExpanded = (data, pathCode) => {
  return data.map((item) => {
    if (item.meta.pathCode === pathCode) {
      item.meta.expanded = !item.meta.expanded;
    } else if (item.children) {
      item.children = findAndUpdateExpanded(item.children, pathCode);
    }
    return item;
  });
};
