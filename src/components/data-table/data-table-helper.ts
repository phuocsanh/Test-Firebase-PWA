import { SearchField, TextCell } from '@/components/data-table';
import { LOCAL_STORE_KEYS, deleteLabel, editLabel } from '@/constant/const';
import { getLocalStorage, setLocalStorage } from '@/lib/localStorage';
import { capitalizeFirstLetter } from '@/lib/text';
import { createFilterDateColumn } from '@/lib/utils';
import {
  ColumnMetaOption,
  ContextMenuItemType,
  DataTableAppearanceStore,
  FieldColumn,
  RowSpanInfo,
} from '@/types';
import {
  Column,
  ColumnDef,
  ColumnMeta,
  ColumnPinningPosition,
  InitialTableState,
  Row,
  Table,
} from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';
import { CSSProperties } from 'react';
import { DateRange } from 'react-day-picker';
import { MobileViewOptions } from './data-table-view-options-mobile';

/**
 * Reorders items in an array of columns.
 * @param items - The array of items to reorder.
 * @param sourceIndex - The source index of the item to move.
 * @param desIndex - The destination index where the item should be moved.
 * @returns A new array with items reordered.
 */
export const reorder = (items: string[], sourceIndex: number, desIndex: number | undefined) => {
  if (sourceIndex === undefined || desIndex === undefined) {
    return items;
  }

  const result = [...items];
  const [draggableId] = result.splice(sourceIndex, 1);
  result.splice(desIndex, 0, draggableId);

  return result;
};

/**
 * Returns the CSS properties for a column, including pinning if necessary.
 * @param table - The data table.
 * @param column - The column to style.
 * @param index - The index of the column.
 * @returns CSS properties for the column.
 */
export const getColumnPinnedStyle = <TData>(
  isPinned: ColumnPinningPosition,
  table: Table<TData>,
  column: Column<TData, unknown>
): CSSProperties => {
  if (!isPinned) {
    return {};
  }

  let objStyle = {};
  const columns = [...table.getVisibleFlatColumns()];
  const pinningList = table.options.state.columnPinning;
  const pinListByPosition =
    isPinned === 'left'
      ? [...(pinningList?.left ?? [])]
      : [...(pinningList?.right ?? [])].reverse();
  const currentColumn = { ...column };

  // get position by list
  const getPosition = () => {
    let position = 0;
    const indexToSlice = pinListByPosition.findIndex(pin => pin === currentColumn.id);
    if (indexToSlice > 0) {
      const pinLeftSlice = pinListByPosition.slice(0, indexToSlice);
      pinLeftSlice.map(item => {
        const colNext = columns.find(col => col.id === item);
        if (colNext) {
          position += colNext?.getSize();
        }
      });
    }
    return position;
  };

  if (isPinned === 'left') {
    objStyle = {
      left: getPosition(),
    };
  }

  if (isPinned === 'right') {
    objStyle = {
      right: getPosition(),
    };
  }

  if (Object.keys(objStyle).length) {
    objStyle = { ...objStyle, zIndex: 5 };
  }

  return {
    position: 'sticky',
    background: '#fafafa',
    ...objStyle,
  };
};

export const pin = <TData>(table: Table<TData>, columnId: string, targetSide: 'left' | 'right') => {
  const oppositeSide = targetSide === 'left' ? 'right' : 'left';

  const { columnPinning } = table.getState();
  const currentPinnedColumns = columnPinning[targetSide] || [];
  const targetPinnedColumnsByOrder = table.getState().columnOrder.filter(colId => {
    return columnPinning[targetSide]?.includes(colId) || colId === columnId;
  });

  const isOrderChanged = targetPinnedColumnsByOrder
    .filter(col => col !== columnId)
    .some((col, index) => col !== currentPinnedColumns?.[index]);

  const newPinning = isOrderChanged
    ? targetSide === 'right'
      ? [columnId, ...currentPinnedColumns]
      : [...currentPinnedColumns, columnId]
    : targetPinnedColumnsByOrder;

  table.setColumnPinning(prev => ({
    ...prev,
    [targetSide]: newPinning,
    [oppositeSide]: columnPinning[oppositeSide]?.filter(pinningColumn => {
      return pinningColumn !== columnId;
    }),
  }));
};

/**
 * Combines external and internal filter columns.
 * @param externalFilterColumn - The external filter columns.
 * @param internalFilterColumn - The internal filter columns.
 * @returns An array of combined filter columns.
 */
export const getCombinedFilterColumn = (
  externalFilterColumn = [] as FieldColumn[],
  internalFilterColumn: FieldColumn[]
) => {
  if (!internalFilterColumn) {
    return externalFilterColumn;
  }

  const onlyNewFilterColumn = externalFilterColumn.filter(externalColumn => {
    return !internalFilterColumn.some(internalColumn => {
      return internalColumn.column.toLowerCase() === externalColumn.column.toLowerCase();
    });
  });

  return [...onlyNewFilterColumn, ...internalFilterColumn];
};

/**
 * Creates a filter column based on a search field.
 * @param field - The search field.
 * @returns A filter column or null if no value is provided.
 */
export const createFilterColumn = (field: SearchField): FieldColumn | null => {
  const { name, value, expression } = field;
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    !expression
  ) {
    return null;
  }

  const { from, to } = value as DateRange;

  if (from && to) {
    return createFilterDateColumn(name, from, to);
  }

  const keySearch =
    Array.isArray(value) && value.length > 0 ? `(${value.toString()})` : String(value);

  return {
    column: capitalizeFirstLetter(name),
    keySearch,
    expression,
  };
};

/**
 * Returns meta feature properties for a column.
 * @param feature - The feature type ('filter' or 'editable').
 * @param type - The meta type ('single' or 'multiple').
 * @param multipleProps - Additional properties for 'multiple' type.
 * @returns Column meta feature properties.
 */
export const getMetaFeatureProps = <TData, TValue>(
  feature: 'filter' | 'editable',
  type: ColumnMetaOption['type'],
  multipleProps?: Omit<ColumnMetaOption, 'type'>
): ColumnMeta<TData, TValue> => {
  if ((type === 'multiple' || type === 'boolean') && multipleProps) {
    return {
      [feature]: {
        type,
        model: multipleProps.model,
        searchKey: multipleProps.searchKey,
        queryKey: multipleProps.queryKey,
        createQueryFn: multipleProps.createQueryFn,
        options: multipleProps.options,
        showFields: multipleProps.showFields,
      },
    };
  }

  return { [feature]: { type } };
};

/**
 * Generates a context menu for data table rows.
 * @param onEdit - Function to call when the edit option is selected.
 * @param onDelete - Function to call when the delete option is selected.
 * @param options - Additional context menu items.
 * @returns An array of context menu items.
 */
export const getDataTableRowContextMenu = <TData>({
  onEdit,
  onDelete,
  options = [],
}: {
  onEdit?: (original: TData) => void;
  onDelete?: (original: TData) => void;
  options?: ContextMenuItemType<TData>[];
}) => {
  const result: ContextMenuItemType<TData>[] = options;

  if (onEdit) {
    result.unshift({
      icon: Pencil,
      label: editLabel,
      className: 'text-primary-600 hover:text-primary-600',
      onClick: original => {
        if (onEdit) onEdit(original);
      },
    });
  }

  if (onDelete) {
    result.push({
      icon: Trash,
      label: deleteLabel,
      className: 'text-red-600 hover:text-red-600',
      onClick: original => {
        if (onDelete) onDelete(original);
      },
    });
  }

  return result;
};

/**
 * Save appearance settings for a specific table.
 *
 * @param tableId - The identifier of the table.
 * @param appearance - The appearance settings to be saved.
 */
export const saveAppearance = (tableId: string, appearance: InitialTableState) => {
  const DATA_TABLE_APPEARANCE = LOCAL_STORE_KEYS.DATA_TABLE_APPEARANCE();
  const appearanceStore = getLocalStorage<Record<string, InitialTableState>>(DATA_TABLE_APPEARANCE);

  if (typeof appearanceStore !== 'string') {
    setLocalStorage(DATA_TABLE_APPEARANCE, {
      ...appearanceStore,
      [tableId]: { ...(appearanceStore?.[tableId] ?? {}), ...appearance },
    });
  }
};

export const saveAppearanceMobile = (tableId: string, appearance: MobileViewOptions) => {
  const DATA_TABLE_APPEARANCE_MOBILE = LOCAL_STORE_KEYS.DATA_TABLE_APPEARANCE_MOBILE();
  const appearanceStore = getLocalStorage<Record<string, MobileViewOptions>>(
    DATA_TABLE_APPEARANCE_MOBILE
  );

  if (typeof appearanceStore !== 'string') {
    setLocalStorage(DATA_TABLE_APPEARANCE_MOBILE, {
      ...appearanceStore,
      [tableId]: { ...(appearanceStore?.[tableId] ?? {}), ...appearance },
    });
  }
};

/**
 * Get appearance settings for a specific table.
 *
 * @param tableId - The identifier of the table.
 * @returns The appearance settings for the specified table, or null if not found.
 */
export const getAppearance = (tableId: string) => {
  const DATA_TABLE_APPEARANCE = LOCAL_STORE_KEYS.DATA_TABLE_APPEARANCE();
  const tableAppearance = getLocalStorage<DataTableAppearanceStore>(DATA_TABLE_APPEARANCE);

  if (typeof tableAppearance !== 'string' && tableAppearance !== null) {
    return tableAppearance[tableId];
  }

  return null;
};

export const getAppearanceMobile = (tableId: string) => {
  const DATA_TABLE_APPEARANCE_MOBILE = LOCAL_STORE_KEYS.DATA_TABLE_APPEARANCE_MOBILE();
  const tableAppearanceMobile = getLocalStorage<Record<string, MobileViewOptions>>(
    DATA_TABLE_APPEARANCE_MOBILE
  );

  if (typeof tableAppearanceMobile !== 'string' && tableAppearanceMobile !== null) {
    return tableAppearanceMobile[tableId];
  }

  return null;
};

export const unHighlightCodeColumn = <T>(columns: ColumnDef<T>[]) => {
  return columns.map(column => {
    if (column.id === 'code')
      return {
        ...column,
        cell: TextCell,
      };
    return column;
  });
};

// export const getRowSpanInfo = <TData>(table: Table<TData>) => {
//   const headerRowSpan: RowSpanInfo = {};
//   const rows = table.getRowModel().rows;
//   const spanIndex: Record<string, number> = {};
//
//   const computeRowValue = <TData>(rowData: TData | undefined, rowSpanByColumn: (keyof TData)[]) => {
//     return rowSpanByColumn.map(field => String(rowData?.[field] ?? '')).join('');
//   };
//
//   rows.forEach((row, rowIndex) => {
//     row.getVisibleCells().forEach(cell => {
//       const rowSpanByColumn = cell.column.columnDef.meta?.rowSpanByColumn as (keyof TData)[];
//
//       if (rowSpanByColumn && rowSpanByColumn.length > 0) {
//         const columnId = cell.column.id;
//         const prevRow = rows[rowIndex - 1];
//
//         const currentRowSpan = headerRowSpan[columnId] || {};
//
//         const value = computeRowValue(cell.row.original, rowSpanByColumn);
//         const prevValue = computeRowValue(prevRow?.original, rowSpanByColumn);
//
//         if (value !== prevValue) {
//           headerRowSpan[columnId] = { ...currentRowSpan, [rowIndex]: 1 };
//           spanIndex[columnId] = rowIndex;
//         } else {
//           currentRowSpan[spanIndex[columnId]] = (currentRowSpan[spanIndex[columnId]] || 1) + 1;
//         }
//       }
//     });
//   });
//
//   return headerRowSpan;
// };
//
//

export const getRowSpanInfo = <TData>(table: Table<TData>) => {
  const rows = table.getRowModel().rows;
  const headerRowSpan: RowSpanInfo = {};

  // Helper to compute a uniue key for a row based on the columns to span
  const getRowKey = <TData>(row: Row<TData>, columns: (keyof TData)[]) => {
    return columns.map(field => String(row.original[field] ?? '')).join('');
  };

  rows.forEach((row, rowIndex) => {
    row.getVisibleCells().forEach(cell => {
      const rowSpanByColumns = cell.column.columnDef.meta?.rowSpanByColumn as (keyof TData)[];

      if (rowSpanByColumns && rowSpanByColumns.length > 0) {
        const columnId = cell.column.id;

        // Ensure headerRowSpan has an entry for this column
        if (!headerRowSpan[columnId]) {
          headerRowSpan[columnId] = {};
        }

        const currentRowKey = getRowKey(row, rowSpanByColumns);

        // Check if this row starts a new group
        const previousRow = rows[rowIndex - 1];
        const previousRowKey = previousRow ? getRowKey(previousRow, rowSpanByColumns) : null;

        if (previousRowKey !== currentRowKey) {
          // New group, start a new span
          headerRowSpan[columnId][rowIndex] = 1;
        } else {
          // Continue the span
          const lastSpanIndex = Object.keys(headerRowSpan[columnId]).map(Number).pop();
          console.log({ lastSpanIndex });
          if (lastSpanIndex !== undefined) {
            headerRowSpan[columnId][lastSpanIndex]++;
          }
        }
      }
    });
  });

  return headerRowSpan;
};
