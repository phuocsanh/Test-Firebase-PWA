import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { parseFiltersQuery, serializeFiltersQuery } from '@/components/data-table';
import { FieldColumn } from '@/types';
import { PaginationState } from '@tanstack/react-table';

type usePaginationFilterWithQueryParamsProps = {
  syncQueryParams?: boolean;
};

export const usePaginationFilterWithQueryParams = ({
  syncQueryParams = true,
}: usePaginationFilterWithQueryParamsProps) => {
  // pagination with query parameter
  const [searchParams, setSearchParams] = useSearchParams(new URLSearchParams(`page=1&limit=20`));

  const pageIndex = syncQueryParams ? Number(searchParams.get('page')) : 1;
  const pageSize = syncQueryParams ? Number(searchParams.get('limit')) : 10;
  const filters = searchParams.get('filters');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex - 1,
    pageSize,
  });

  const [filterColumns, setFilterColumns] = useState<FieldColumn[]>(() => {
    if (!filters || !syncQueryParams) {
      return [];
    }

    return parseFiltersQuery(filters);
  });

  useEffect(() => {
    if (!syncQueryParams) {
      return;
    }

    setSearchParams(params => {
      params.set('page', (pagination.pageIndex + 1).toString());
      params.set('limit', pagination.pageSize.toString());

      const filterQuery = serializeFiltersQuery(filterColumns);

      if (filterQuery) {
        params.set('filters', filterQuery);
      } else {
        params.delete('filters');
      }

      return params;
    });
  }, [filterColumns, pagination.pageIndex, pagination.pageSize, setSearchParams, syncQueryParams]);

  return { pagination, setPagination, filterColumns, setFilterColumns };
};
