import dxTreeList, { dxTreeListColumn } from 'devextreme/ui/tree_list';
import { array, boolean } from 'zod';

type ColumnProps = dxTreeListColumn & { index?: number; resizedCallbacks?: any };

function getColumnTree(tableInstance: dxTreeList<any, any> | undefined) {
  const columns = tableInstance?.getVisibleColumns();
  if (!columns) return;
  // Create a map to store the items by ownerBand
  const bandMap: Record<number, ColumnProps[]> = {};
  const bandColumnMap: Record<number, ColumnProps> = {};

  // Loop through the input to populate the bandMap
  columns.forEach(item => {
    // If item has ownerBand, push it to the corresponding band
    if (item.ownerBand !== undefined) {
      if (!bandColumnMap[item.ownerBand]) {
        const ownerBand = tableInstance?.columnOption?.(item.ownerBand) as ColumnProps;
        bandColumnMap[item.ownerBand] = ownerBand;
        columns.push(ownerBand);
      }
      if (!bandMap[item.ownerBand]) {
        bandMap[item.ownerBand] = [];
      }
      bandMap[item.ownerBand].push(item);
    }
  });

  // // Recursively build the tree structure
  function buildTree(items: ColumnProps[]) {
    if (!items) return;
    return items.map(item => {
      delete item.resizedCallbacks;
      const result = { ...item };
      // If this item has a matching ownerBand, it will have children
      const children = bandMap[item.index!];
      if (children) {
        result.columns = buildTree(children);
      }
      return result;
    });
  }

  // // Find root elements (those without an ownerBand)
  const rootItems = columns.filter(item => item.isBand || item.ownerBand === undefined);

  // // Generate the final output by recursively building the tree from root elements
  return buildTree(rootItems);
  // return columns;
}

export function saveTreeListState(
  storageKey: string,
  state: any,
  tableInstance: dxTreeList<any, any> | undefined
) {
  state.columnTree = getColumnTree(tableInstance);

  localStorage.setItem(
    storageKey,
    JSON.stringify(state, function (key: string, value: unknown) {
      // Ignore properties that cause circular references
      if (key === '_eventsStrategy' || key === '_owner') {
        return undefined; // Exclude these properties from being serialized
      }
      return value;
    })
  );
}

const indexFormats = [
  (i: number) => String.fromCharCode(65 + i), // A, B, C, ...
  (i: number) => (i + 1).toString().replace(/\d/g, d => 'ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ'[Number(d) - 1]), // I, II, III, ...
  (i: number) => (i + 1).toString(), // 1, 2, 3, ...
  (i: number, parent: string) => `${parent}.${i + 1}`, // 1.1, 1.2, ...
];

// Hàm sinh chỉ mục, nếu vượt cấp sẽ dùng định dạng `1.1.1.1`
function getIndexFormatter(level: number) {
  return indexFormats[level] ?? ((i: number, parent: string) => `${parent}.${i + 1}`);
}

function generateIndexedMap<T extends { parentId: number | null; id: number }>(
  data: T[],
  key: keyof T = 'id'
) {
  const map = new Map<T[keyof T], string>();
  const childrenMap: Map<number, T[keyof T][]> = new Map<number, T[keyof T][]>(); // Lưu danh sách con theo parentId
  const rootIds: T[keyof T][] = []; // Lưu các phần tử gốc (parentId === null)

  // Bước 1: Đưa toàn bộ dữ liệu vào Map
  data.forEach(item => {
    map.set(item[key], ''); // Thêm index mặc định rỗng
    if (item.parentId !== null) {
      if (!childrenMap.has(item.parentId)) {
        childrenMap.set(item.parentId, []);
      }
      childrenMap.get(item.parentId)?.push(item[key]);
    } else {
      rootIds.push(item[key]); // Nếu không có parent, đây là node gốc
    }
  });

  // Bước 2: Gán chỉ mục theo cấu trúc mong muốn
  function assignIndex(parentId: number | null = null, prefix: string = '', level: number = 0) {
    if (!parentId || !childrenMap.has(parentId)) return;

    childrenMap.get(parentId)?.forEach((childId, i) => {
      const indexFormatter = getIndexFormatter(level);
      const index = indexFormatter(i, prefix);
      map.set(childId, index);
      assignIndex(childId as number, index, level + 1);
    });
  }

  // Bước 3: Gán chỉ mục cho tất cả các phần tử gốc trước tiên
  rootIds.forEach((rootId, i) => {
    const rootIndex = String.fromCharCode(65 + i); // A, B, C, ...
    map.set(rootId, rootIndex);
    assignIndex(rootId as number, rootIndex, 1);
  });

  return map;
}

export function getIndexedList<T extends { parentId: number | null; id: number }>(
  items: T[],
  displayColumn: keyof T,
  dataColumn: keyof T = displayColumn,
  indexKeyColumn: keyof T = 'id'
) {
  if (!items) return [];
  const indexedMap = generateIndexedMap(items, indexKeyColumn);
  return items.map(item => ({
    ...item,
    [displayColumn]: `${indexedMap.get(item[indexKeyColumn])}. ${String(item[dataColumn])}`,
  }));
}

type TreeNode = {
  parentId: number | null | undefined | '';
  id: number;
};

// check parentId is null or null or undefined or 0 or -1 or ''
function isRootNode<T extends TreeNode>(parentId: T['parentId']) {
  return (
    parentId === null ||
    parentId === undefined ||
    parentId === 0 ||
    parentId === -1 ||
    parentId === ''
  );
}

// get name visible column of tree list
// mark column is lookup column
export function getVisibleColumnNames(tableInstance: dxTreeList<any, any> | undefined) {
  const columns = tableInstance?.getVisibleColumns();
  if (!columns) return [];

  return columns.map(column => ({
    caption: column.caption,
    dataField: column.dataField,
    width: column.width,
    lookup: column.lookup || undefined,
    cellTemplate: column.cellTemplate,
  }));
}

// get tree list instance from ref
export function getTreeListInstance(ref: React.RefObject<dxTreeList<any, any>>) {
  return ref.current?.instance();
}

// calculate depth of node in tree list
export function calculateDepth<T extends TreeNode>(node: T, data: T[]) {
  let depth = 0;
  let parentId = node.parentId;
  while (!isRootNode(parentId)) {
    depth++;
    const parent = data.find(item => item.id === parentId);
    parentId = parent?.parentId;
  }
  return depth;
}

// create list of depth of node in tree list, include root node
export function getDepthOfNodes<T extends TreeNode>(data: T[]) {
  return data
    .map(node => calculateDepth(node, data))
    .map((depth, index) => ({
      nodeId: data[index].id,
      depth,
    })) as { nodeId: number; depth: number }[];
}

export type RenderValues = {
  dataType: any;
  items: any[] | { trueText: string; falseText: string };
};

/**
 * Get actual displayed in cell
 * @param targetColumnValues values get from tree list datasource
 * @param renderValues list containing contains cell id and label
 *
 * @returns actual value that displayed on cell
 */

export function getColumnRenderLabel(
  targetColumnValues: number | string | boolean,
  renderValues: RenderValues
) {
  if (!targetColumnValues) {
    return '';
  }

  if (renderValues?.dataType === boolean) {
    const items = renderValues.items;
    if (!Array.isArray(items)) {
      return targetColumnValues ? items.trueText : items.falseText;
    }
  }

  if (renderValues?.dataType === array) {
    const labelIds = targetColumnValues.toString().split(',').map(Number);
    return labelIds
      .map((id: number): string | undefined => {
        const item = (renderValues.items as any[]).find((item: any) => item.id === id) as
          | { name?: string }
          | undefined;
        return item?.name;
      })
      .filter((name): name is string => Boolean(name))
      .join(', ');
  }
}

export const insertTreeItem = <
  T extends { columnIndex: number | null; parentId: number | null; id: number },
>(
  editableData: T[],
  selectedTask: T,
  newTask: T
): [T[], number] => {
  const newRecords = [...editableData];

  const siblingTasks = newRecords.filter(item => item.parentId === selectedTask.id);

  let insertIndex = (selectedTask.columnIndex ?? 0) + 1;
  if (siblingTasks.length) {
    insertIndex = (siblingTasks.at(-1)?.columnIndex ?? 0) + 1;
  }

  newRecords.splice(insertIndex, 0, newTask);

  const reindexedRecords = newRecords.map((_, i) => ({ ..._, columnIndex: i }));

  return [reindexedRecords, insertIndex];
};
