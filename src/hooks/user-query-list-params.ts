import { toLocaleDate } from '@/lib/date';
import { capitalizeFirstLetter } from '@/lib/text';
import { createFilterDateColumn } from '@/lib/utils';
import { FieldColumn, QueryPaginationParams } from '@/types';
import { startOfMonth } from 'date-fns';
import { useCallback, useState } from 'react';

const getInitialFilterColumn = (timeField: string): [FieldColumn, Date, Date] => {
  const currentDate = new Date();
  const firstOfMonth = startOfMonth(currentDate);

  return [createFilterDateColumn(timeField, firstOfMonth, currentDate), firstOfMonth, currentDate];
};

export const useQueryListParams = (
  timeField?: string,
  initialQueryListParams?: Partial<QueryPaginationParams>
) => {
  const [queryListParams, setQueryListParams] = useState<Partial<QueryPaginationParams>>(() => {
    const params: Partial<QueryPaginationParams> = {
      ...initialQueryListParams,
      filterColumn: [...(initialQueryListParams ? initialQueryListParams?.filterColumn || [] : [])],
    };

    if (timeField) {
      const [timeFieldColumn, from, to] = getInitialFilterColumn(timeField);
      params.fromDate = toLocaleDate(from)!;
      params.toDate = toLocaleDate(to)!;
      params.filterColumn?.push(timeFieldColumn);
    }

    return params;
  });

  const setFilterColumn = useCallback((filterColumn: QueryPaginationParams['filterColumn']) => {
    setQueryListParams(params => ({ ...params, filterColumn }));
  }, []);

  const addOrReplaceFilterColumn = useCallback((columnFilter: FieldColumn) => {
    const newFieldColumn: FieldColumn = {
      ...columnFilter,
      column: capitalizeFirstLetter(columnFilter.column),
      keySearch: String(columnFilter.keySearch),
    };

    setQueryListParams(params => {
      const columns = (params.filterColumn || []).filter(item => {
        return item.column !== newFieldColumn.column;
      });

      return {
        ...params,
        filterColumn: [...columns, newFieldColumn],
      };
    });
  }, []);

  const addOrReplaceFilterDateColumn = useCallback(
    (field: string, from: Date, to: Date) => {
      addOrReplaceFilterColumn(createFilterDateColumn(field, from, to));
    },
    [addOrReplaceFilterColumn]
  );

  const removeFilterColumn = useCallback((columnName: FieldColumn['column']) => {
    setQueryListParams(params => ({
      ...params,
      filterColumn: params.filterColumn?.filter(i => {
        return i.column !== capitalizeFirstLetter(columnName);
      }),
    }));
  }, []);

  const clearFilterColumn = useCallback(() => {
    const filterColumn: FieldColumn[] = [];
    if (timeField) {
      filterColumn.push(getInitialFilterColumn(timeField)[0]);
    }
    setQueryListParams(params => ({ ...params, filterColumn }));
  }, [timeField]);

  const addFilterDateColumn = useCallback(
    (field: string, from: Date, to: Date) => {
      addOrReplaceFilterColumn(createFilterDateColumn(field, from, to));
    },
    [addOrReplaceFilterColumn]
  );

  return {
    queryListParams,
    setQueryListParams,
    setFilterColumn,
    addOrReplaceFilterColumn,
    addOrReplaceFilterDateColumn,
    removeFilterColumn,
    clearFilterColumn,
    // addOrReplaceFilterColumn,
    addFilterDateColumn,
  };
};
