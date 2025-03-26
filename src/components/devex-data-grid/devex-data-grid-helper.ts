import dxDataGrid, { CellPreparedEvent, dxDataGridColumn } from 'devextreme/ui/data_grid';

type ColumnProps = dxDataGridColumn & { index?: number; resizedCallbacks?: any };

function getColumnTree(tableInstance: dxDataGrid<any, any> | undefined) {
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

export function saveDataGridState(
  storageKey: string,
  state: any,
  tableInstance: dxDataGrid<any, any> | undefined
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

const getMergeCellsMap = <T>(items: T[], mergeColumns: (keyof T)[]) => {
  const mergeCellsMap: Map<keyof T, Map<number, number>> = new Map();
  const size = items?.length;

  // empty input
  if (!size || !mergeColumns?.length) return mergeCellsMap;

  for (const column of mergeColumns) {
    const rowSpanByColumnMap: Map<number, number> = new Map<number, number>();
    let row = 0;

    for (let i = 1; i < items.length; i++) {
      let span = 1;

      // calculate span for consecutive matching rows
      while (i < size && items[row][column] === items[i][column]) {
        span++;
        i++;
      }

      // Record the span for the current row
      rowSpanByColumnMap.set(row, span);
      // Update the starting row for the next group
      row = i;
    }

    // Add the column map to the main merge map
    mergeCellsMap.set(column, rowSpanByColumnMap);
  }

  return mergeCellsMap;
};

export const createCellPrepareEventWithMergeColumns = <T>(
  items: T[],
  mergeColumns: (keyof T)[]
) => {
  const mergeCellsMap = getMergeCellsMap(items, mergeColumns);

  return (e: CellPreparedEvent) => {
    for (const [column, rowSpans] of mergeCellsMap) {
      if (e.rowType === 'data' && e.column.dataField === column) {
        const rowSpan = rowSpans.get(e.rowIndex);
        const cellElement = e.cellElement as HTMLTableCellElement;
        if (rowSpan !== undefined) {
          cellElement.rowSpan = rowSpan;
        } else {
          cellElement.setAttribute('style', 'display:none');
        }
      }
    }
  };
};
