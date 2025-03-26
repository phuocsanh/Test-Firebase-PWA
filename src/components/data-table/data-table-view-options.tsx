import { pin, reorder, saveAppearance } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDraggableInPortal } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import {
  DragHandleDots2Icon,
  MixerHorizontalIcon,
  PinLeftIcon,
  PinRightIcon,
} from '@radix-ui/react-icons';
import { Column, Table } from '@tanstack/react-table';
import { AlertCircle, PinOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  tableId: string;
}

type DraggableColumnProps<TData> = {
  table: Table<TData>;
  index: number;
  column: Column<TData>;
  saveAppearanceAsync: () => void;
};

const DraggableColumn = <TData,>({
  table,
  index,
  column,
  saveAppearanceAsync,
}: DraggableColumnProps<TData>) => {
  const renderDraggable = useDraggableInPortal();

  const { columnPinning } = table.getState();

  const isPinningLeft = columnPinning.left?.includes(column.id);
  const isPinningRight = columnPinning.right?.includes(column.id);

  if (typeof column.columnDef.header !== 'string') {
    return;
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {renderDraggable((draggableProvided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <CommandItem
          key={column.id}
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          className={cn(
            'flex h-9 items-center justify-between gap-1 hover:cursor-auto',
            snapshot.isDragging ? 'bg-slate-100' : '',
            snapshot.isDropAnimating ? 'transition-all' : ''
          )}
          value={column.id}
        >
          <DragHandleDots2Icon
            onClick={e => e.preventDefault()}
            className="h-4 w-4 text-muted-foreground hover:cursor-grab active:cursor-grabbing"
          />
          <div
            className="flex flex-1 items-center hover:cursor-pointer"
            onClick={() => {
              column.toggleVisibility(!column.getIsVisible());
              saveAppearanceAsync();
            }}
          >
            <Checkbox
              checked={column.getIsVisible()}
              aria-label="Select column"
              className="mr-3 "
            />
            <span>{String(column.columnDef.header)}</span>
          </div>
          <div className={cn('flex flex-row gap-2 ')}>
            <Button
              variant="ghost"
              className="hidden p-2 active:bg-slate-200 sm:block"
              onClick={() => {
                isPinningLeft ? column.pin(false) : pin(table, column.id, 'left');
                saveAppearanceAsync();
              }}
            >
              {isPinningLeft ? (
                <PinOff size={12} className="text-muted-foreground" />
              ) : (
                <PinLeftIcon className="h-4 w-4  text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              className="hidden p-2 active:bg-slate-200 sm:block"
              onClick={() => {
                isPinningRight ? column.pin(false) : pin(table, column.id, 'right');
                saveAppearanceAsync();
              }}
            >
              {isPinningRight ? (
                <PinOff size={12} className="text-muted-foreground" />
              ) : (
                <PinRightIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </CommandItem>
      ))}
    </Draggable>
  );
};

export const DataTableViewOptions = <TData,>({
  table,
  tableId,
}: DataTableViewOptionsProps<TData>) => {
  const { t } = useTranslation('dataTable');

  const saveAppearanceAsync = () => {
    setTimeout(() => saveAppearance(tableId, table.getState()), 100);
  };

  const allLeafColumns = table.getAllLeafColumns().map(column => column.id);

  const getIndexOfColumn = (column: Column<TData>) =>
    allLeafColumns.findIndex(columnId => columnId === column.id);

  return (
    <Popover modal={true}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:block">
                <MixerHorizontalIcon className="size-4 text-slate-600" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('viewOptions.label')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-auto max-w-md p-0" align="end">
        <Command
        // filter={(value, search) => {
        //   value = value.toLocaleLowerCase();
        //   search = search.toLocaleLowerCase();
        //   if (removeAccents(value).includes(removeAccents(search))) {
        //     return 1;
        //   }
        //   return 0;
        // }}
        >
          {/* <CommandInput
            placeholder={`${enterLabel} ${t('viewOptions.columnName').toLocaleLowerCase()}`}
            className="h-9"
          /> */}
          <CommandEmpty className="flex flex-row gap-2 p-5">
            <AlertCircle className="stroke-slate-400" />
            <p className="text-slate-400">{t('viewOptions.notFoundColumn')}</p>
          </CommandEmpty>
          <CommandGroup>
            {/* pinning left */}
            {table.getLeftLeafColumns().length > 0 && (
              <DragDropContext
                key={'view-option-drag-drop-context-left'}
                onDragEnd={(dragEvent: DropResult) => {
                  const { source, destination } = dragEvent;
                  const leftPinning = table.getState().columnPinning.left || [];
                  const leftPinningReordered = reorder(
                    leftPinning,
                    source.index,
                    destination?.index
                  );
                  table.setColumnPinning(prev => ({ ...prev, left: leftPinningReordered }));
                  saveAppearanceAsync();
                }}
              >
                <p className="my-2 ml-1 text-xs text-muted-foreground">
                  {t('viewOptions.pinningLeft')}
                </p>

                <Droppable droppableId="view-option-droppable-left" direction="vertical">
                  {droppableProvided => (
                    <div
                      className="max-h-[15vh] overflow-y-scroll"
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                    >
                      {table
                        .getLeftLeafColumns()
                        .filter(column => column.getCanHide())
                        .map((column, index) => (
                          <DraggableColumn
                            table={table}
                            key={column.id}
                            column={column}
                            index={index}
                            saveAppearanceAsync={saveAppearanceAsync}
                          />
                        ))}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            {/* unpin */}
            <DragDropContext
              key={'view-option-drag-drop-context-center'}
              onDragEnd={(dragEvent: DropResult) => {
                const { source, destination } = dragEvent;
                const currentOrder = table.getAllLeafColumns().map(i => i.id);
                const reorderedColumn = reorder(currentOrder, source.index, destination?.index);
                table.setColumnOrder(reorderedColumn);
                saveAppearanceAsync();
              }}
            >
              {table.getLeftLeafColumns().length > 0 || table.getRightLeafColumns().length > 0 ? (
                <p className="my-2 ml-1 text-xs text-muted-foreground">{t('viewOptions.unpin')}</p>
              ) : null}
              <Droppable droppableId="view-option-droppable-center" direction="vertical">
                {droppableProvided => (
                  <div
                    className="max-h-[20vh] overflow-y-scroll"
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {table
                      .getCenterLeafColumns()
                      .filter(column => column.getCanHide())
                      .map(column => (
                        <DraggableColumn
                          table={table}
                          key={column.id}
                          column={column}
                          index={getIndexOfColumn(column)}
                          saveAppearanceAsync={saveAppearanceAsync}
                        />
                      ))}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {/* pinning right */}
            {table.getRightLeafColumns().length > 0 && (
              <DragDropContext
                key={'view-option-drag-drop-context-right'}
                onDragEnd={(dragEvent: DropResult) => {
                  const { source, destination } = dragEvent;
                  const rightPinning = table.getState().columnPinning.right || [];
                  const leftCenterColumnCount =
                    table.getLeftLeafColumns().length + table.getCenterLeafColumns().length;

                  const sourceIndex = source.index - leftCenterColumnCount;
                  const destinationIndex =
                    (destination?.index ?? leftCenterColumnCount) - leftCenterColumnCount;

                  const rightPinningReordered = reorder(
                    rightPinning,
                    sourceIndex,
                    destinationIndex
                  );
                  table.setColumnPinning(prev => ({ ...prev, right: rightPinningReordered }));
                  saveAppearanceAsync();
                }}
              >
                <p className="my-2 ml-1 text-xs text-muted-foreground">
                  {t('viewOptions.pinningRight')}
                </p>
                <Droppable droppableId="view-option-droppable-right" direction="vertical">
                  {droppableProvided => {
                    const leftCenterColumnCount =
                      table.getLeftLeafColumns().length + table.getCenterLeafColumns().length;
                    console.log('right leaf columns', table.getRightLeafColumns());
                    return (
                      <div
                        className="max-h-[15vh] overflow-y-scroll"
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                      >
                        {table
                          .getRightLeafColumns()
                          .filter(column => column.getCanHide())
                          .map((column, index) => (
                            <DraggableColumn
                              key={column.id}
                              table={table}
                              column={column}
                              index={leftCenterColumnCount + index}
                              saveAppearanceAsync={saveAppearanceAsync}
                            />
                          ))}
                        {droppableProvided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </DragDropContext>
            )}
            <CommandItem className="flex justify-between">
              <Button
                className="bg-white text-foreground shadow-none hover:bg-white/70 active:bg-white/50"
                onClick={() => {
                  table.toggleAllColumnsVisible(true);
                  saveAppearanceAsync();
                }}
                disabled={table.getIsAllColumnsVisible()}
              >
                {t('viewOptions.showAllColumns')}
              </Button>
              <Button
                className="bg-white text-foreground shadow-none hover:bg-white/70 active:bg-white/50"
                onClick={() => {
                  table.toggleAllColumnsVisible(false);
                  saveAppearanceAsync();
                }}
                disabled={!table.getIsAllColumnsVisible()}
              >
                {t('viewOptions.hideAllColumns')}
              </Button>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
