import { Header, Table, flexRender } from '@tanstack/react-table';

import { callbackWithTimeout, cn } from '@/lib/utils';
import { CaretDownIcon, CaretSortIcon, CaretUpIcon, EyeNoneIcon } from '@radix-ui/react-icons';
import {
  ArrowDownIcon,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpIcon,
  ListTree,
  PinOff,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { pin, saveAppearance } from '.';
import { buttonVariants } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDataTableInstance } from './data-table-provider';

interface DataTableColumnViewOptionsProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  header: Header<TData, TValue>;
  tableId: string;
  table: Table<TData>;
}

export const DataTableColumnViewOptions = <TData, TValue>({
  header,
  tableId,
  table,
}: DataTableColumnViewOptionsProps<TData, TValue>) => {
  const { t } = useTranslation('dataTable');
  const { setSortState, fetch } = useDataTableInstance();

  const flexHeader = flexRender(header.column.columnDef.header, header.getContext());

  const saveAppearanceAsync = () => {
    setTimeout(() => saveAppearance(tableId, table.options.state), 100);
  };

  if (header.column.id === 'toggleExpandableAll' || header.column.id === 'select') {
    return flexHeader;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({
            variant: 'ghost',
            size: 'default',
            className:
              'm-0 flex h-fit w-full select-none items-center justify-end gap-2 overflow-hidden py-1 pl-1 pr-2 text-xs hover:cursor-pointer active:bg-slate-200 data-[state=open]:bg-accent',
          })
        )}
      >
        <div className="mx-auto">{flexHeader}</div>
        {header.column.getIsSorted() === 'desc' ? (
          <CaretDownIcon className={'text-base'} strokeWidth={1.25} />
        ) : header.column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className={'text-base'} strokeWidth={1.25} />
        ) : (
          <CaretSortIcon className={'text-base'} strokeWidth={1.25} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem
          onClick={() => {
            setSortState({ column: header.column.id, dir: 0 });
            callbackWithTimeout(fetch);
            header.column.toggleSorting(false);
          }}
        >
          <ArrowUpIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
          {t('column.sortAsc')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSortState({ column: header.column.id, dir: 1 });
            callbackWithTimeout(fetch);
            header.column.toggleSorting(true);
          }}
        >
          <ArrowDownIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
          {t('column.sortDesc')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            header.column.toggleVisibility(false);
          }}
        >
          <EyeNoneIcon className="mr-2 h-3 w-3 text-muted-foreground/70" />
          {t('column.hide')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            pin(table, header.column.id, 'left');
            saveAppearanceAsync();
          }}
          disabled={header.column.getIsPinned() === 'left'}
        >
          <ArrowLeftToLine className="mr-2 h-3 w-3 text-muted-foreground/70" />
          {t('column.pinToLeft')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            pin(table, header.column.id, 'right');
            saveAppearanceAsync();
          }}
          disabled={header.column.getIsPinned() === 'right'}
        >
          <ArrowRightToLine className="mr-2 h-3 w-3 text-muted-foreground/70" />
          {t('column.pinToRight')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            header.column.pin(false);
            saveAppearanceAsync();
          }}
          disabled={header.column.getIsPinned() === false}
        >
          <PinOff className="mr-2 h-3 w-3 text-muted-foreground/70" />
          {t('column.unpin')}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={table.options.manualGrouping}
          onClick={() => {
            header.column.toggleGrouping();
            saveAppearanceAsync();
          }}
        >
          <ListTree className="mr-2 h-3 w-3 text-muted-foreground/70" />
          {header.column.getIsGrouped() ? t('column.ungroup') : t('column.group')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
