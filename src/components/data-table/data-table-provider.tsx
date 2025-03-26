import { useBoolean } from '@/hooks';
import { usePaginationFilterWithQueryParams } from '@/hooks/use-pagination-filter-with-query-params';
import { getPreviewURL } from '@/lib/file';
import notification from '@/lib/notifications';
import { capitalizeFirstLetter } from '@/lib/text';
import { isEmptyObject } from '@/lib/utils';
import { createQueryPaginationFn, Payload, postRequest } from '@/services';
import {
  DataTableContextResult,
  DataTableErrorImport,
  DataTableProviderProps,
  ExportResponse,
  QueryPaginationParams,
  ResponseFailure,
  SortState,
} from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../ui/checkbox';
import {
  getAppearance,
  getAppearanceMobile,
  getCombinedFilterColumn,
  getRowSpanInfo,
  saveAppearance,
  saveAppearanceMobile,
} from './data-table-helper';
import { MobileViewOptions } from './data-table-view-options-mobile';

export const DataTableContext = React.createContext<DataTableContextResult<any, any>>(
  {} as DataTableContextResult<any, any>
);

/**
 * Provider component that manages the state and actions of a data table.
 * @template TData - The type of the data items in the table.
 * @template TValue - The type of the value in the table columns.
 */
export const DataTableProvider = <TData extends Payload, TValue>({
  children,
  // query remote data source

  // EDITABLE DATA SOURCE
  editableData,
  setEditableData,

  // TABLE BASIC CONFIGURATION
  columns,
  tableId,
  tableName,
  hideAutoNumberedColumn,
  initialState,
  manualGrouping,
  manualPagination,

  // TABLE DEFAULT ACTIONS
  exportUrl,

  // ROW SELECTED ACTIONS
  rowSelectionType,
  rowSelection = {},
  setRowSelection,
  onRowSelected,

  grouping = [],

  onRowDoubleClick,
  renderSubRow,

  // DnD
  draggableRows,

  // QUERY REMOTE DATA SOURCE
  syncQueryParams,
  getRowId,
  sortColumn,
  sortOrder = 1,
  paginationModel,
  paginationQueryKey,

  queryFn,
  onPaginationResponse,
  queryListParams,

  tableContentAttributes,
}: DataTableProviderProps<TData, TValue>) => {
  const { t } = useTranslation('dataTable');

  const { filterColumns, setFilterColumns, pagination, setPagination } =
    usePaginationFilterWithQueryParams({ syncQueryParams });

  const useAsyncData =
    Boolean(paginationQueryKey) && (Boolean(paginationModel) || queryFn !== undefined);

  // This state variable is intended to store an array of data of type 'TData'.
  // The data is expected to be used in cases where data grouping by columns is enabled,
  // and client-side paging is enabled.
  // The initial value of 'internalDataSource' is set to an empty array ([]),
  // indicating that initially, no data is present.
  const [internalDataSource, setInternalDataSource] = useState<TData[]>([]);

  const [sortState, setSortState] = useState<SortState>({
    column: sortColumn,
    dir: sortOrder,
  });

  const getSortColumn = () => {
    if (sortState.column) {
      return capitalizeFirstLetter(sortState.column.toString());
    }

    if (draggableRows) {
      return 'Sort';
    }

    return 'Id';
  };

  const getQueryFn = () => {
    if (queryFn) {
      return queryFn;
    }

    if (!paginationModel) {
      return;
    }

    const paginationQueryFn = createQueryPaginationFn<TData>(paginationModel);
    if (!paginationQueryFn) {
      return null;
    }

    return paginationQueryFn;
  };

  /**
   * Query list of data
   */
  const {
    refetch: fetch,
    isLoading,
    isSuccess,
    data: paginationResponse,
  } = useQuery({
    queryKey: [...(paginationQueryKey ?? [])],
    queryFn: async () => {
      const queryFn = getQueryFn();
      if (!queryFn) {
        return Promise.reject();
      }

      const { filterColumn: externalFilters, ...additionalParams } = queryListParams || {};

      const params: QueryPaginationParams = {
        isPage: false,
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex + 1,
        sortColumn: getSortColumn(),
        sortOrder: draggableRows ? 0 : sortState.dir,
        ...additionalParams,
      };

      let filter = filterColumns;

      if (externalFilters?.length) {
        // Extract column values from externalFilters
        const externalColumns = externalFilters.map(i => i.column);

        // Filter out internalFilters that are not included in externalColumns
        const internalFilters = filterColumns.filter(item => {
          return !externalColumns?.includes(item.column);
        });

        // Combine internal and external filters to update filter variable
        filter = [...internalFilters, ...externalFilters];
      }

      return await queryFn(params, filter);
    },
    select: data => onPaginationResponse?.(data) || data,
    retry: false,
    enabled: manualGrouping ? useAsyncData : internalDataSource.length === 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (isSuccess && paginationResponse) {
      let response = paginationResponse;
      const modifiedResponse = onPaginationResponse?.(paginationResponse);

      if (modifiedResponse) {
        response = modifiedResponse;
      }

      setInternalDataSource(response.items);

      if (!setEditableData || !response?.items) {
        return;
      }

      setEditableData(paginationResponse.items);
    }
  }, [isSuccess, onPaginationResponse, paginationResponse, setEditableData]);

  const { items, total, summary } = paginationResponse || {
    items: [],
    total: 0,
    summary: {},
  };

  const finalColumns = useMemo(() => {
    const getFinalColumns = () => {
      const column = sortColumn as keyof TData;
      const selectionColumn: ColumnDef<TData, TValue> = {
        id: 'select',
        accessorKey: 'select',
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => {
          return rowSelectionType === 'checkbox' ? (
            <div className="w-full text-center">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                // defaultChecked={table.getIsAllPageRowsSelected()}
                onCheckedChange={value => {
                  table.toggleAllPageRowsSelected(!!value);
                  const items = table.options.data;
                  if (onRowSelected) {
                    if (value) {
                      onRowSelected((old: TData[]) => [...old, ...items]);
                    } else {
                      onRowSelected((old: TData[]) => {
                        return old.filter(i => !items.map(i => i[column]).includes(i[column]));
                      });
                    }
                  }
                }}
                aria-label="Select all"
                className="mx-auto"
              />
            </div>
          ) : null;
        },
        cell: ({ row }) => {
          return (
            <div className="w-full text-center">
              {rowSelectionType === 'checkbox' ? (
                <Checkbox
                  checked={row.getIsSelected()}
                  // defaultChecked={row.getIsSelected()}
                  onCheckedChange={value => {
                    row.toggleSelected(!!value);
                    if (onRowSelected) {
                      if (value) {
                        onRowSelected((old: TData[]) => [...old, row.original]);
                      } else {
                        onRowSelected((old: TData[]) => {
                          return old.filter(
                            item => String(item[column]) !== String(row.original[column])
                          );
                        });
                      }
                    }
                  }}
                  aria-label="Select row"
                  className="translate-y-[2px]"
                />
              ) : (
                <input
                  type="radio"
                  checked={row.getIsSelected()}
                  onChange={() => {
                    row.toggleSelected();

                    const value = row.original[column];

                    if (typeof value === 'undefined' || value === null) {
                      console.error('The data row should have "id" field');
                      return;
                    }

                    if (setRowSelection) {
                      setRowSelection({ [String(value)]: true });
                    }

                    if (onRowSelected) {
                      onRowSelected([row.original]);
                    }
                  }}
                />
              )}
            </div>
          );
        },
        size: 10,
      };

      const orderColumn: ColumnDef<TData, TValue> = {
        id: 'order',
        accessorKey: 'order',
        header: t('fields.order'),
        aggregatedCell: '',
        cell: ({ row }) => {
          // const isManualPagination =
          //   manualPagination !== undefined
          //     ? manualPagination
          //     : manualGrouping
          //       ? useAsyncData
          //       : false;
          return (
            <div className="text-center">
              {/* Ordinal when pagination */}
              {/* {(!manualGrouping || !useAsyncData ? 0 : pagination.pageIndex * pagination.pageSize) +
                table.getSortedRowModel()?.flatRows.findIndex(item => item.id === row.id) +
                1} */}
              {pagination.pageIndex * pagination.pageSize + row.index + 1}
            </div>
          );
        },
        size: 10,
      };

      if (setRowSelection) {
        const columnWithSelection = [selectionColumn, ...columns];
        return hideAutoNumberedColumn ? columnWithSelection : [orderColumn, ...columnWithSelection];
      }

      return hideAutoNumberedColumn
        ? columns
        : [
            ...[orderColumn, ...columns].map(col => ({
              ...col,
              ...(col.size ? { minSize: col.size } : {}),
            })),
          ];
    };

    return getFinalColumns().map(item => {
      if (item.id === 'actions' && !item.header) {
        return { ...item, header: t('fields.actions') };
      }
      return item;
    });
  }, [
    t,
    columns,
    sortColumn,
    onRowSelected,
    setRowSelection,
    rowSelectionType,
    pagination.pageSize,
    pagination.pageIndex,
    hideAutoNumberedColumn,
  ]);

  const getDataSource = () => {
    if (manualGrouping && useAsyncData && items.length > 0) {
      return items;
    }

    if (internalDataSource?.length) {
      return internalDataSource;
    }

    return editableData || [];
  };

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data: getDataSource(),
    columns: finalColumns,
    columnResizeMode: 'onChange',

    // manualGrouping === true: Nhóm cột được xử lý thủ công bởi dev (thường dùng khi không muốn nhóm cột tự động và cần phân trang server)
    // manualGrouping === false: Cho phép TanStack Table tự xử lý nhóm cột (thường dùng khi muốn nhóm cột và phân trang phía client)
    manualGrouping,

    // Nếu useAsyncData === true → phân trang thủ công (server-side pagination)
    // Nếu useAsyncData === false → phân trang tự động (client-side pagination)
    manualPagination:
      // Ưu tiên giá trị của manualPagination nếu được chỉ định
      // Nếu không, sẽ quyết định dựa trên manualGrouping:
      // - Nếu manualGrouping === true (tức là không muốn nhóm cột tự động) → quyết định dựa trên useAsyncData:
      //   + Nếu dữ liệu lấy từ API (useAsyncData === true) → phân trang server
      //   + Ngược lại (thường là bảng dùng để chỉnh sửa dữ liệu) → phân trang client
      manualPagination !== undefined ? manualPagination : manualGrouping ? useAsyncData : false,

    // Nếu manualGrouping === false → pageCount sẽ là undefined
    // Nếu manualGrouping === true → Tính số trang dựa trên dữ liệu từ API hoặc dữ liệu đang chỉnh sửa
    pageCount: !manualGrouping
      ? undefined
      : Math.ceil((useAsyncData ? total : (editableData || []).length) / pagination.pageSize),

    autoResetExpanded: false,
    // initialState,
    state: {
      grouping,
      expanded,
      pagination,
      rowSelection,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Skip page index reset until after next rerender
        // skipAutoResetPageIndex();
        if (!setEditableData || !editableData) {
          return;
        }

        const newEditableData = [...editableData];
        newEditableData[rowIndex] = { ...newEditableData[rowIndex], [columnId]: value };

        setEditableData(newEditableData);
      },

      updateRowValues: (values: Partial<TData>, rowIndex?: number) => {
        if (!setEditableData || !editableData) {
          return;
        }

        const newEditableData = [...editableData];
        if (rowIndex === undefined || rowIndex < 0 || rowIndex >= editableData.length) {
          newEditableData.push(values as TData);
        } else {
          newEditableData[rowIndex] = { ...newEditableData[rowIndex], ...values };
        }

        setEditableData(newEditableData);
      },

      addNewRow: (values: TData) => {
        if (!setEditableData || !editableData) {
          return;
        }

        setEditableData([...editableData, values]);
      },

      removeRowByIndex: (index: number) => {
        if (!setEditableData || !editableData) {
          return;
        }

        setEditableData(editableData.filter((_, _idx) => _idx !== index));
      },
    },

    getRowId: getRowId ? getRowId : original => String(original[sortColumn as keyof TData]),
    onExpandedChange: setExpanded,
    enableRowSelection: true,
    enablePinning: true,
    autoResetPageIndex: false,
    // event props
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    // model props
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });
  const [mobileViewOptions, setMobileViewOptions] = useState<MobileViewOptions>();

  useEffect(() => {
    const { columnVisibility, columnPinning, columnSizing, columnOrder, grouping } =
      table.getState();
    const savedAppearance = getAppearance(tableId);
    const savedMobileViewOptions = getAppearanceMobile(tableId);

    if (!mobileViewOptions) {
      if (savedMobileViewOptions && !isEmptyObject(savedMobileViewOptions)) {
        setMobileViewOptions(savedMobileViewOptions);
      } else if (initialState?.mobileColumnVisibility) {
        setMobileViewOptions(initialState.mobileColumnVisibility);
        saveAppearanceMobile(tableId, initialState.mobileColumnVisibility);
      } else {
        const columns = table.getVisibleFlatColumns();
        const values: MobileViewOptions = {
          position1: columns[1]?.columnDef?.id,
          position3: columns[2]?.columnDef?.id,
          position4: columns[3]?.columnDef?.id,
          position5: columns[4]?.columnDef?.id,
        };
        setMobileViewOptions(values);
        saveAppearanceMobile(tableId, values);
      }
    }

    if (savedAppearance) {
      if (
        isEmptyObject(columnVisibility) &&
        savedAppearance.columnVisibility &&
        !isEmptyObject(savedAppearance.columnVisibility)
      ) {
        table.setColumnVisibility(savedAppearance.columnVisibility);
      }

      if (columnPinning.left?.length === 0 && columnPinning.right?.length === 0) {
        if (savedAppearance.columnPinning) {
          table.setColumnPinning(savedAppearance.columnPinning);
        } else {
          table.setColumnPinning({ left: [], right: ['actions', 'removeRow'] });
        }
      }

      if (isEmptyObject(columnSizing)) {
        if (savedAppearance.columnSizing && !isEmptyObject(savedAppearance.columnSizing)) {
          table.setColumnSizing(savedAppearance.columnSizing);
        } else {
          const defaultSizing = finalColumns.reduce((result, column) => {
            return { ...result, ...(column.size ? { [column.id!]: column.size } : {}) };
          }, {});
          table.setColumnSizing(defaultSizing);
        }
      }

      if (!columnOrder?.length) {
        if (savedAppearance?.columnOrder?.length) {
          table.setColumnOrder(savedAppearance.columnOrder);
        } else {
          table.setColumnOrder(finalColumns.map(i => String(i.id)));
        }
      }

      if (!grouping) {
        if (savedAppearance?.grouping?.length) {
          table.setGrouping(savedAppearance.grouping);
        } else {
          table.setGrouping([]);
        }
      }
    } else {
      saveAppearance(tableId, initialState || {});
    }
  }, [finalColumns, initialState, mobileViewOptions, table, tableId]);

  useEffect(() => {
    if (setRowSelection) {
      table.setColumnPinning(old => ({ ...old, left: ['select'] }));
    }
  }, [setRowSelection, table]);

  const { state: openErrorImport, toggle: toggleErrorImport } = useBoolean();
  const [errorsImport, setErrorsImport] = useState<DataTableErrorImport>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? [];

    if (!file) {
      return;
    }
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await postRequest(`${paginationModel}/import-list`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      notification.success(t('import.success'));
      await fetch();
    } catch (errors) {
      const failureError = errors as ResponseFailure & { errors: DataTableErrorImport };
      if (Array.isArray(failureError?.errors) && failureError.errors) {
        setErrorsImport(failureError?.errors);
        toggleErrorImport();
      } else {
        notification.error(failureError.message);
      }
    }
    setIsImporting(false);
    e.target.value = '';
  };

  /**
   * Export
   */

  const handleExport = () => {
    const visibleColumns = table.getVisibleLeafColumns().map(item => item.id);

    const { filterColumn = [], ...objParam } = queryListParams || {};
    const url = exportUrl ? exportUrl : `/${paginationModel}/export-excel`;
    postRequest<ExportResponse>(url, {
      objParam,
      reportName: tableName,
      sortColumn: getSortColumn(),
      sortOrder: draggableRows ? 0 : sortOrder,
      filterColumn: getCombinedFilterColumn(filterColumn, filterColumns),
      exportColumns: table
        .getAllLeafColumns()
        .filter(i => i.id !== 'actions' && i.id !== 'order' && visibleColumns.includes(i.id))
        .map((item, index) => ({
          column: capitalizeFirstLetter(item.id),
          columnLocalize: item.columnDef.header,
          sort: index,
        })),
    })
      .then(response => {
        window.open(getPreviewURL(response.path), '_blank');
      })
      .catch((error: { message: string }) => {
        notification.error(error.message);
      });
  };

  const handleDownloadImportTemplate = () => {
    window.open(`/templates/${paginationModel}/import-template.xlsx`);
  };

  const handleResetAppearance = () => {
    table.reset();

    const {
      grouping = [],
      columnVisibility = finalColumns.reduce((result, column) => {
        return { ...result, [String(column.id)]: true };
      }, {}),
      columnSizing = finalColumns.reduce((result, column) => {
        return { ...result, ...(column.size ? { [column.id!]: column.size } : {}) };
      }, {}),
      columnOrder = finalColumns.map(i => String(i.id)),
      columnPinning = { left: [], right: ['actions'] },
    } = initialState || {};

    table.setGrouping(grouping);
    table.setColumnVisibility(columnVisibility);
    table.setColumnSizing(columnSizing);
    table.setColumnOrder(columnOrder);
    table.setColumnPinning(columnPinning);

    saveAppearance(tableId, {
      grouping,
      columnVisibility,
      columnSizing,
      columnOrder,
      columnPinning,
    });
  };

  const rowSpanInfo = getRowSpanInfo(table);

  return (
    <DataTableContext.Provider
      value={{
        filterColumns,
        setFilterColumns,
        //
        pagination,
        setPagination,

        sortState,

        rowSelectionType,
        setRowSelection,
        onRowSelected,

        onRowDoubleClick,
        renderSubRow,

        // remote data source
        fetch,
        data: {
          items,
          total,
          summary,
          isLoading,
        },
        // basic configure
        table,
        columns: finalColumns,

        setMobileViewOptions,
        mobileViewOptions,

        // actions
        handleImport,
        importState: {
          isImporting,
          errorsImport,
          openErrorImport,
          toggleErrorImport,
        },
        handleExport,
        handleDownloadImportTemplate,
        handleResetAppearance,

        rowSpanInfo,

        setSortState,

        tableContentAttributes,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};

/**
 * Hook to access the DataTable context.
 * @returns The data table context values.
 * @throws Error if used outside of a DataTableProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useDataTableInstance = () => {
  const context = useContext(DataTableContext);

  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }

  return context;
};
