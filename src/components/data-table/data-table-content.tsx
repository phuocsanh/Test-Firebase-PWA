import {
  DataTableColumnFilter,
  DataTableColumnViewOptions,
  getColumnPinnedStyle,
  saveAppearance,
} from '@/components/data-table';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableUI,
} from '@/components/ui/table';
import { useMediaQuery } from '@/hooks';
import { realNumberDecimalFormat } from '@/lib/number';
import { capitalizeFirstLetter } from '@/lib/text';
import { cn } from '@/lib/utils';
import { Payload } from '@/services/utils';
import { DataTableProps } from '@/types';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DataTableContentMobile } from './data-table-content-mobile';
import { useDataTableInstance } from './data-table-provider';

interface DraggableContentRow {
  draggableRows?: boolean;
  children?: React.ReactElement;
}

type DataTableContentProps<TData, TValue> = Pick<
  DataTableProps<TData, TValue>,
  'tableId' | 'contextMenuItems'
> &
  DraggableContentRow;

export const DataTableContent = <TData extends Payload, TValue>({
  tableId,
  contextMenuItems,
}: DataTableContentProps<TData, TValue>) => {
  const { t } = useTranslation('dataTable');

  const tableRowRef = useRef<HTMLTableRowElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const {
    table,
    fetch,
    rowSpanInfo,
    setPagination,
    filterColumns,
    setFilterColumns,
    data: { summary },
    onRowDoubleClick,
    renderSubRow,
    tableContentAttributes,
  } = useDataTableInstance();

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => saveAppearance(tableId, table.getState()), 100);
    };

    const tableRowElement = tableRowRef?.current;
    tableRowElement?.addEventListener('mouseup', handleMouseUp);

    return () => tableRowElement?.removeEventListener('mouseup', handleMouseUp);
  }, [table, tableId]);

  return (
    <div
      {...tableContentAttributes}
      className={cn('max-h-[calc(100vh-36.1rem)] overflow-auto', tableContentAttributes?.className)}
    >
      {isMobile ? (
        <DataTableContentMobile />
      ) : (
        <TableUI>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow ref={tableRowRef} key={headerGroup.id} className="transition-none">
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="border-left relative h-fit border bg-white p-0 font-normal"
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinnedStyle(header.column.getIsPinned(), table, header.column),
                      minWidth: header.column.getSize(),
                    }}
                  >
                    <div className="flex h-fit flex-row items-center">
                      {header.isPlaceholder ? null : (
                        <DataTableColumnViewOptions
                          tableId={tableId}
                          header={header}
                          table={table}
                        />
                      )}
                      {header.column.columnDef.meta?.filter && (
                        // <div className="flex h-full flex-row items-center">
                        //   {/* {header.column.id !== 'select' && (
                        //   <DataTableColumnViewOptions tableId={tableId} header={header} table={table} />
                        // )} */}
                        //   <DataTableColumnFilter
                        //     table={table}
                        //     refetch={fetch}
                        //     column={header.column}
                        //     filterColumns={filterColumns}
                        //     setFilterColumns={setFilterColumns}
                        //     setPagination={setPagination}
                        //   />
                        // </div>
                        <DataTableColumnFilter
                          table={table}
                          refetch={fetch}
                          column={header.column}
                          filterColumns={filterColumns}
                          setFilterColumns={setFilterColumns}
                          setPagination={setPagination}
                        />
                      )}
                    </div>
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cn(
                        'absolute right-0 top-0 h-full w-[3px] touch-none select-none bg-slate-200 hover:cursor-col-resize active:cursor-col-resize',
                        header.column.getIsResizing() ? 'bg-slate-300 opacity-100' : ''
                      )}
                    />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => {
                const renderedRow = (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(row.getIsGrouped() ? 'bg-slate-100/90' : '', '')}
                    onDoubleClick={() => {
                      onRowDoubleClick?.(row.original);
                    }}
                  >
                    {row.getVisibleCells().map(cell => {
                      const rowSpan = rowSpanInfo?.[cell.column.id]?.[cell.row.index];
                      if (cell.column.columnDef.meta?.rowSpanByColumn && !rowSpan) {
                        return null;
                      }
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getColumnPinnedStyle(cell.column.getIsPinned(), table, cell.column),
                            width: cell.column.getSize(),
                            // background: cell.getIsGrouped()
                            //   ? '#0aff0082'
                            //   : cell.getIsAggregated()
                            //     ? '#ffa50078'
                            //     : cell.getIsPlaceholder()
                            //       ? '#ff000042'
                            //       : 'white',
                          }}
                          className={cn(
                            'border-left border',
                            cell.getIsAggregated() ? 'font-medium' : ''
                          )}
                          rowSpan={rowSpan || 1}
                        >
                          <div className="w-full">
                            <ContextMenu modal={false}>
                              <ContextMenuTrigger>
                                {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
                                {cell.getIsGrouped() ? (
                                  // If it's a grouped cell, add an expander and row count
                                  <Button
                                    onClick={row.getToggleExpandedHandler()}
                                    className={cn(
                                      row.getCanExpand() ? 'cursor-pointer' : 'cursor-none',
                                      'flex w-full justify-between'
                                    )}
                                    variant="ghost"
                                  >
                                    {row.getIsExpanded() ? (
                                      <ChevronDown strokeWidth={1} />
                                    ) : (
                                      <ChevronRight strokeWidth={1} />
                                    )}
                                    <div className="flex items-center gap-x-2">
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())} (
                                      {row.subRows.length})
                                    </div>
                                  </Button>
                                ) : cell.getIsAggregated() ? (
                                  // If the cell is aggregated, use the Aggregated
                                  // renderer for cell
                                  flexRender(
                                    cell.column.columnDef.aggregatedCell ??
                                      cell.column.columnDef.cell,
                                    cell.getContext()
                                  )
                                ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                                  // Otherwise, just render the regular cell
                                  flexRender(cell.column.columnDef.cell, cell.getContext())
                                )}
                              </ContextMenuTrigger>
                              {contextMenuItems?.length ? (
                                <ContextMenuContent>
                                  {contextMenuItems?.map(item => {
                                    const Icon = item.icon;
                                    return (
                                      <ContextMenuItem
                                        key={item.label}
                                        className={item.className}
                                        onClick={() => {
                                          item.onClick(cell.row.original as TData);
                                        }}
                                      >
                                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                                        {item.label}
                                      </ContextMenuItem>
                                    );
                                  })}
                                </ContextMenuContent>
                              ) : null}
                            </ContextMenu>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
                if (renderSubRow && row.getIsExpanded()) {
                  return (
                    <>
                      {renderedRow}
                      <TableRow>
                        <TableCell colSpan={table.getAllLeafColumns().length} className="">
                          {renderSubRow({ table, row })}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                }
                return renderedRow;
              })
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  {t('content.noResult')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-white">
            {table.getFooterGroups().map(footerGroup => {
              return (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map(header => {
                    const columnId = header.column.columnDef.id || '';
                    const field = `sum${capitalizeFirstLetter(columnId)}`;
                    const value = summary?.[field];
                    return (
                      <TableCell
                        key={header.id}
                        className="px-2 py-1 text-right font-bold text-foreground"
                        style={{
                          ...getColumnPinnedStyle(
                            header.column.getIsPinned(),
                            table,
                            header.column
                          ),
                          width: header.column.getSize() - 2,
                        }}
                      >
                        {value
                          ? realNumberDecimalFormat(String(value), 0)
                          : header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.footer, header.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableFooter>
        </TableUI>
      )}
    </div>
  );
};
