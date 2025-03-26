import { Model } from '@/services';
import { QueryKey, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import {
  ColumnDef,
  GroupingState,
  InitialTableState,
  PaginationState,
  Row,
  RowSelectionState,
  Table,
} from '@tanstack/react-table';
import { LucideIcon } from 'lucide-react';
import React, { ChangeEvent, Dispatch, ReactNode, SetStateAction } from 'react';
import { FieldColumn, PaginationResponse, QueryPaginationParams } from './network';
import { UserPermission } from './permission';
import { IUserPermission } from './user';
import { MobileViewOptions } from '@/components/data-table/data-table-view-options-mobile';

export type DataTableWithActionsProps<T> = {
  role?: IUserPermission;
  onAddNewClick?: () => void;
  onEditClick?: (e: T) => void;
  onDeleteClick?: (e: T) => void;
};

export type EditableDataTableRefType<T> = {
  getEditableData: () => T[];
};

export type RowSpanInfo = Record<string, Record<number, number>>;
export type SortState = {
  column: string | undefined;
  dir: 0 | 1;
};

/**
 * Context for managing data table state and actions.
 * @template TData - The type of the data items in the table.
 * @template TValue - The type of the value in the table columns.
 */
export type DataTableContextResult<TData, TValue> = {
  // states
  filterColumns: FieldColumn[];
  setFilterColumns: Dispatch<SetStateAction<FieldColumn[]>>;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sortState: SortState;
  setSortState: React.Dispatch<React.SetStateAction<SortState>>;

  /** Type of row selection: checkbox or radio. */
  rowSelectionType?: 'checkbox' | 'radio';
  /** Setter for row selection state. */
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  /** Optional callback when rows are selected. */
  onRowSelected?: Dispatch<SetStateAction<TData[]>>;

  onRowDoubleClick?: (row: TData) => void;

  /** Optional custom sub row rendered */
  renderSubRow?: (props: { table: Table<TData>; row: Row<TData> }) => JSX.Element | JSX.Element[];

  // remote data
  fetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PaginationResponse<TData>, Error>>;
  data: {
    items: TData[];
    summary: Record<string, number> | undefined;
    total: number;
    isLoading: boolean;
  };
  // configure
  columns: ColumnDef<TData, TValue>[];
  table: Table<TData>;
  rowSpanInfo: RowSpanInfo;

  mobileViewOptions: MobileViewOptions | undefined;
  setMobileViewOptions: React.Dispatch<React.SetStateAction<MobileViewOptions | undefined>>;

  // default actions
  handleImport: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  importState: {
    isImporting: boolean;
    errorsImport: DataTableErrorImport;
    openErrorImport: boolean;
    toggleErrorImport: () => void;
  };
  handleExport: () => void;
  handleDownloadImportTemplate: () => void;
  handleResetAppearance: () => void;

  /** */
  tableContentAttributes?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

/**
 * Defines the shape of an item in the context menu for each row in the data table.
 * @template TData - The type of the data item.
 */
export type ContextMenuItemType<TData> = {
  /** Icon to be displayed for the menu item. */
  icon?: LucideIcon;
  /** Label text for the menu item. */
  label: string;
  /** Click handler function for the menu item. */
  onClick: (originalRow: TData) => void;
  /** Optional class name for additional styling. */
  className?: string;
};

/**
 * Represents an import error in the data table.
 */
export type DataTableErrorImport = {
  /** Line number in the import file where the error occurred. */
  line: number;
  /** Error message describing what went wrong. */
  message: string;
}[];

/**
 * Defines the stored appearance settings for a data table.
 */
export type DataTableAppearanceStore = Record<string, InitialTableState>;

/**
 * Props for the `DataTableProvider` component.
 * @template TData - The type of the data items in the table.
 * @template TValue - The type of the value in the table columns.
 */
export interface DataTableProps<TData, TValue> {
  children?: ReactNode | ReactNode[];
  /** Columns definition for the data table. */
  columns: ColumnDef<TData, TValue>[];

  /** Optional callback when the add button is clicked. */
  onAddButtonClick?: ((table: Table<TData>) => void) | (() => void);

  /** Pagination model to use for data retrieval. */
  paginationModel?: Model;

  /** Query key for pagination queries. */
  paginationQueryKey?: QueryKey;

  /** Optional function to handle pagination response. */
  onPaginationResponse?: (
    paginationResponse: PaginationResponse<TData> | undefined
  ) => PaginationResponse<TData> | void;

  /** Optional data that can be edited directly in the table. */
  editableData?: TData[];
  /** Optional setter for the editable data. */
  setEditableData?: (newData: TData[]) => void;

  /** Type of row selection: checkbox or radio. */
  rowSelectionType?: 'checkbox' | 'radio';

  /** State of row selection. */
  rowSelection?: RowSelectionState;

  grouping?: GroupingState;

  /** Setter for row selection state. */
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;

  /** Optional callback when rows are selected. */
  onRowSelected?: Dispatch<SetStateAction<TData[]>>;

  /** Optional callback when rows are double clicked */
  onRowDoubleClick?: (row: TData) => void;

  /** Optional custom toolbar component. */
  customToolbar?: (props: { table: Table<TData>; refetch: () => void }) => JSX.Element;
  /** Optional custom sub row rendered */
  renderSubRow?: (props: { table: Table<TData>; row: Row<TData> }) => JSX.Element | JSX.Element[];

  /** Optional query parameters for listing data. */
  queryListParams?: Partial<QueryPaginationParams>;

  hasExport?: boolean;
  hasImport?: boolean;
  manualGrouping?: boolean;
  manualPagination?: boolean;
  role?: UserPermission;
  contextMenuItems?: ContextMenuItemType<TData>[];
  draggableRows?: boolean;
  sortColumn?: string;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  getSubRows?: (originalRow: TData, index: number) => undefined | TData[];
  sortOrder?: 0 | 1;
  tableName?: string;
  tableId: string;

  /** Optional function to query data. */
  queryFn?: (
    params: QueryPaginationParams,
    data: FieldColumn[]
  ) => Promise<PaginationResponse<TData>>;

  /** URL for exporting data. */
  exportUrl?: string;

  /** Whether to query report data. */
  queryReport?: boolean;

  /** Whether to show settings options. */
  showSetting?: boolean;

  /** Whether to show pagination controls. */
  showPagination?: boolean;

  /** Whether to hide the auto-numbered column. */
  hideAutoNumberedColumn?: boolean;

  /** Whether to synchronize query parameters with the URL. */
  syncQueryParams?: boolean;

  /** Initial state for the table. */
  initialState?: InitialTableState & { mobileColumnVisibility?: MobileViewOptions };

  /** */
  tableContentAttributes?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

/**
 * Props for the `DataTableProvider` component, with specific options.
 * @template TData - The type of the data items in the table.
 * @template TValue - The type of the value in the table columns.
 */
export type DataTableProviderProps<TData, TValue> = Pick<
  DataTableProps<TData, TValue>,
  | 'children'
  | 'editableData'
  | 'setEditableData'
  | 'columns'
  | 'tableId'
  | 'tableName'
  | 'hideAutoNumberedColumn'
  | 'initialState'
  | 'manualGrouping'
  | 'manualPagination'
  | 'exportUrl'
  | 'rowSelectionType'
  | 'rowSelection'
  | 'grouping'
  | 'setRowSelection'
  | 'onRowSelected'
  | 'onRowDoubleClick'
  | 'draggableRows'
  | 'syncQueryParams'
  | 'sortColumn'
  | 'sortOrder'
  | 'paginationModel'
  | 'paginationQueryKey'
  | 'queryFn'
  | 'onPaginationResponse'
  | 'queryListParams'
  | 'getRowId'
  | 'getSubRows'
  | 'renderSubRow'
  | 'tableContentAttributes'
>;
