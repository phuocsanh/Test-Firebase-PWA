import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseNumber, realNumberDecimalFormat } from '@/lib/number';
import { callbackWithTimeout } from '@/lib/utils';
import { DataTableProps } from '@/types';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputNumber } from '../ui/input';
import { useDataTableInstance } from './data-table-provider';

export const DataTablePagination = <TData, TValue>({
  rowSelectionType,
}: Pick<DataTableProps<TData, TValue>, 'rowSelectionType'>) => {
  const { t } = useTranslation('dataTable');

  const {
    table,
    fetch,
    data: { total },
  } = useDataTableInstance();

  const hasSelectColumn =
    rowSelectionType === 'checkbox' && table.getAllColumns().some(col => col.id === 'select');

  const { pageIndex: currentPageIndex, pageSize } = table.getState().pagination;
  const [pageIndex, setPageIndex] = useState<number | undefined>(currentPageIndex);

  useEffect(() => {
    setPageIndex(currentPageIndex + 1);
  }, [currentPageIndex]);

  const refetch = () => callbackWithTimeout(fetch);
  const filteredLength = table.getFilteredRowModel().rows.length;

  return (
    <div className="hidden flex-col justify-between p-1 px-2 md:flex md:flex-row lg:items-center">
      <div className="flex flex-1 text-xs text-muted-foreground">
        {/* {hasSelectColumn && table.getFilteredSelectedRowModel().rows.length} of{' '} */}
        {/* {hasSelectColumn && table.getFilteredRowModel().rows.length} row(s) selected. */}
        {hasSelectColumn && (
          <span className="mr-3">
            {t('rowSelection', {
              selectedRows: table.getFilteredSelectedRowModel().rows.length,
              rows: filteredLength,
            })}
          </span>
        )}
        <span className="text-xs font-medium text-black">
          {t('pagination.totalRow')}:{' '}
          {realNumberDecimalFormat((total || filteredLength).toString())}
        </span>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-xs font-medium lg:block">{t('pagination.perPage')}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value));
              refetch();
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="flex w-[100px] items-center justify-center text-xs font-medium">
          {t('pagination.pageIndex', {
            index: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div> */}
        <div className="flex w-[180px] items-center justify-center text-xs font-medium">
          {t('pagination.pageIndex')}
          <InputNumber
            className="ml-2"
            onChange={setPageIndex}
            value={pageIndex}
            min={1}
            max={table.getPageCount()}
            onBlur={e => {
              table.setPageIndex(parseNumber(e.target.value) - 1);
              refetch();
            }}
          />
          /{realNumberDecimalFormat(table.getPageCount().toString())}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0);
              refetch();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.previousPage();
              refetch();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage();
              refetch();
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
              refetch();
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
