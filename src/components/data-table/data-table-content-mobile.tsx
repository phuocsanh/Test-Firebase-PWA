import { FORMAT_DATE } from '@/constant';
import useDoubleClick from '@/hooks/use-double-click';
import { formatDate, toLocaleDate } from '@/lib/date';
import { realNumberDecimalFormat } from '@/lib/number';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { useDataTableInstance } from './data-table-provider';

function canBeDate(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

const getPositionValue = (original: Record<string, string>, field: string | undefined) => {
  const value = field ? original[field] : undefined;
  if (!value) return null;

  if (typeof value === 'string') {
    return value;
  }

  if (canBeDate(value)) {
    const localeDate = toLocaleDate(new Date(value));
    return formatDate(localeDate, FORMAT_DATE);
  }

  if (typeof value === 'number') return realNumberDecimalFormat(String(value));
  if (typeof value === 'boolean') return <Badge>{value}</Badge>;

  return value;
};

export const DataTableContentMobile = () => {
  const [clickedIndex, setClickedIndex] = useState<number>(-1);
  const {
    table,
    mobileViewOptions,
    onRowDoubleClick,
    rowSelectionType,
    onRowSelected,
    setRowSelection,
    sortState: { column: sortColumn },
  } = useDataTableInstance();

  const handleDoubleClick = useDoubleClick(onRowDoubleClick);

  return (
    table.getRowModel().rows.length > 0 && (
      <div className="flex flex-col">
        {table.getRowModel().rows.map((item, index) => {
          const { original } = item as { original: Record<string, string> };
          const [value1, value2, value3, value4, value5, value6] = [
            getPositionValue(original, mobileViewOptions?.position1),
            getPositionValue(original, mobileViewOptions?.position2),
            getPositionValue(original, mobileViewOptions?.position3),
            getPositionValue(original, mobileViewOptions?.position4),
            getPositionValue(original, mobileViewOptions?.position5),
            getPositionValue(original, mobileViewOptions?.position6),
          ];

          const sort = sortColumn as keyof typeof original;
          return (
            <div
              key={item.id}
              className={cn(
                `select-none space-y-1 border border-transparent border-t-slate-200 px-0 py-2`,
                clickedIndex === index && 'border border-primary-500'
              )}
              onPointerDown={() => {
                setClickedIndex(index);
                const value = item.getIsSelected();
                if (rowSelectionType === 'checkbox') {
                  if (onRowSelected) {
                    if (value) {
                      // onRowSelected(old => [...old, original as unknown as any]);
                      onRowSelected(old => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return [...old, item];
                      });
                    } else {
                      onRowSelected(old => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return old.filter(item => String(item.id) !== String(original[sort]));
                      });
                    }
                  }
                } else {
                  const value = original[sort];

                  if (typeof value === 'undefined' || value === null) {
                    console.error('The data row should have "id" field');
                    return;
                  }

                  if (setRowSelection) {
                    setRowSelection({ [String(value)]: true });
                  }

                  if (onRowSelected) {
                    onRowSelected([original]);
                  }
                }
              }}
              onClick={() => handleDoubleClick(original)}
            >
              <div className="flex items-center justify-between">
                {value1 && (
                  <p className="font-bold">
                    {getPositionValue(original, mobileViewOptions?.position1)}
                  </p>
                )}
                {value2 && (
                  <Badge variant={'success'} className="text-md font-bold">
                    {value2}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-x-2 text-muted-foreground">
                  {value3 && <p>{value3}</p>}
                  {value4 && <p>{value4}</p>}
                  {value5 && <p>{value5}</p>}
                </div>
                {value6 && <p className="text-muted-foreground">{value6}</p>}
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};
