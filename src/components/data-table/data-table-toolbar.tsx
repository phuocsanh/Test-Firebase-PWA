import { DataTableViewOptions } from '@/components/data-table';
import { Button, buttonVariants } from '@/components/ui/button';
import { realNumberDecimalFormat } from '@/lib/number';
import { callbackWithTimeout, cn } from '@/lib/utils';
import { DataTableProps } from '@/types';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, FileDown, FileText, FileUp, History, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useDataTableInstance } from './data-table-provider';
import { DataTableViewOptionsMobile } from './data-table-view-options-mobile';

export const DataTableToolbar = <TData, TValue>({
  role,
  tableId,
  onAddButtonClick,
  showSetting,
  children,

  hasExport,
  hasImport,
  isMobile,
  mobileViewOptionsClassName,
}: Pick<
  DataTableProps<TData, TValue>,
  'role' | 'tableId' | 'onAddButtonClick' | 'showSetting' | 'hasExport' | 'hasImport'
> & {
  children?: (props: { table: Table<TData>; refetch: () => void }) => JSX.Element;
  isMobile?: boolean;
  mobileViewOptionsClassName?: string;
}) => {
  const { t } = useTranslation('dataTable');
  const {
    table,
    fetch,
    // data: { isLoading },
    // setFilterColumns,
    handleImport,
    handleExport,
    handleResetAppearance,
    handleDownloadImportTemplate,
  } = useDataTableInstance();
  // const isMobile = useMediaQuery('(max-width: 768px)');

  const { pageIndex: currentPageIndex, pageSize } = table.getState().pagination;
  const [pageIndex, setPageIndex] = useState<number | undefined>(currentPageIndex);

  useEffect(() => {
    setPageIndex(currentPageIndex + 1);
  }, [currentPageIndex]);

  return (
    <div className="flex flex-col gap-1 px-1 sm:justify-between md:flex-row">
      <div className="gap-x-2 sm:w-full">
        {children?.({
          table,
          refetch: () => {
            callbackWithTimeout(fetch);
          },
        })}
      </div>
      <div className="flex items-center gap-x-2 self-end">
        <span className="text-xs font-bold text-gray-500 md:hidden">
          {pageIndex + ' '}-{pageSize + ' '}/
          {' ' + realNumberDecimalFormat(table.getPageCount().toString())}
        </span>
        <Button
          onClick={() => {
            table.previousPage();
          }}
          variant="ghost"
          size="icon"
          className="md:hidden"
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={16} color="#000000" strokeWidth={1.25} />
        </Button>
        <Button
          onClick={() => {
            table.nextPage();
          }}
          variant="ghost"
          size="icon"
          className="md:hidden"
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={16} color="#000000" strokeWidth={1.25} />
        </Button>
        {hasImport && handleDownloadImportTemplate && role?.isImport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-yellow-100 hover:text-yellow-700"
                  onClick={handleDownloadImportTemplate}
                >
                  <FileText size={16} color="#000000" strokeWidth={1.25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('toolbar.downloadImportTemplate')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {hasImport && handleImport && role?.isImport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col justify-end">
                  <input
                    type="file"
                    className="hidden"
                    id="upload-attach-file"
                    onChange={e => {
                      void handleImport(e);
                    }}
                    placeholder="upload-attach-file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                  <label
                    htmlFor="upload-attach-file"
                    className={cn(
                      buttonVariants({
                        size: 'icon',
                        variant: 'ghost',
                        className: 'cursor-pointer',
                      })
                    )}
                  >
                    {/* {isLoading ? (
                    <RefreshCcw className="mr-3 h-4 w-4 animate-spin" />
                  ) : (
                    <FileUp className="mr-3 h-4 w-4" />
                  )} */}
                    <FileUp size={16} color="#000000" strokeWidth={1.25} />
                  </label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('toolbar.import')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {hasExport && handleExport && role?.isExport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className=" hover:bg-success-100 hover:text-success-700"
                  onClick={handleExport}
                >
                  <FileDown size={16} color="#000000" strokeWidth={1.25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('toolbar.export')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {onAddButtonClick && role?.isCreate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  onClick={() => onAddButtonClick(table)}
                >
                  <Plus size={16} color="#000000" strokeWidth={1.25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('toolbar.add')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {/* <TooltipProvider> */}
        {/*   <Tooltip> */}
        {/*     <TooltipTrigger asChild> */}
        {/*       <Button */}
        {/*         type="button" */}
        {/*         variant="ghost" */}
        {/*         size="icon" */}
        {/*         onClick={() => { */}
        {/*           setFilterColumns([]); */}
        {/*           callbackWithTimeout(fetch); */}
        {/*         }} */}
        {/*       > */}
        {/*         <FilterX size={16} color="#000000" strokeWidth={1.25} /> */}
        {/*       </Button> */}
        {/*     </TooltipTrigger> */}
        {/*     <TooltipContent> */}
        {/*       <p>{t('toolbar.clearFilterAll')}</p> */}
        {/*     </TooltipContent> */}
        {/*   </Tooltip> */}
        {/* </TooltipProvider> */}
        {/* <TooltipProvider> */}
        {/*   <Tooltip> */}
        {/*     <TooltipTrigger asChild> */}
        {/*       <Button */}
        {/*         type="button" */}
        {/*         variant="ghost" */}
        {/*         size="icon" */}
        {/*         onClick={() => callbackWithTimeout(fetch)} */}
        {/*       > */}
        {/*         <RotateCw */}
        {/*           className={cn(isLoading ? 'animate-spin' : '')} */}
        {/*           size={16} */}
        {/*           color="#000000" */}
        {/*           strokeWidth={1.25} */}
        {/*         /> */}
        {/*       </Button> */}
        {/*     </TooltipTrigger> */}
        {/*     <TooltipContent> */}
        {/*       <p>{t('toolbar.refetch')}</p> */}
        {/*     </TooltipContent> */}
        {/*   </Tooltip> */}
        {/* </TooltipProvider> */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={handleResetAppearance}>
                <History size={16} color="#000000" strokeWidth={1.25} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('toolbar.resetAppearance')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {showSetting && <DataTableViewOptions table={table} tableId={tableId} />}
        {isMobile && (
          <DataTableViewOptionsMobile className={mobileViewOptionsClassName} tableId={tableId} />
        )}
      </div>
    </div>
  );
};
