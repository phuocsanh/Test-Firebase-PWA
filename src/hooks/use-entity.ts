import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { COMPONENT, DEFAULT_QUERY_PAGINATION_PARAMS } from '@/constant';
import { getDistinctRecords, hash } from '@/lib/utils';
import { Model, Payload, createQueryComponentFn } from '@/services';
import { PaginationResponse, QueryListComponentType } from '@/types';

type useEntityProps<T> = {
  model?: Model;
  queryKey?: QueryKey;
  iteratorCallback?: (item: T) => T;
  options?: T[];
  onResponse?: (items: T[]) => void;
  createQueryFn?: <T extends Payload>(
    model: Model
  ) => (params: QueryListComponentType) => Promise<PaginationResponse<T>>;
  // searchParams?: SearchParams;
  searchId?: number;
  uniqueField?: keyof T;
  externalParams?: Record<string, unknown>;
};

type PaginationQueryData<T> = Partial<PaginationResponse<T>> & {
  reachedLastPage?: boolean;
  isFetching?: boolean;
};

export const useEntity = <T extends Payload>({
  model,
  queryKey,
  iteratorCallback,
  options,
  onResponse,
  createQueryFn = createQueryComponentFn,
  searchId,
  uniqueField = 'id',
  externalParams,
}: useEntityProps<T>) => {
  const iteratorCallbackFnRef = useRef(iteratorCallback);

  const queryKeyWithEntityRef = useRef([...(queryKey ?? []), COMPONENT]);

  const externalParamsRef = useRef(externalParams);

  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current);
  const [isFetched, setIsFetched] = useState(false);

  const onResponseFn = useRef(onResponse);

  const fetch = useCallback(
    ({ pageIndex = 1, pageSize = -1, searchId = 0, searchTerm = '' }) => {
      if (!model) {
        return;
      }

      const queryFn = createQueryFn<T>(model);

      if (!queryFn) {
        return;
      }

      const params: QueryListComponentType = {
        id: Number(searchId || 0),
        keySearch: String(searchTerm || ''),
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        isGetAll: false,
        ...externalParamsRef.current,
      };

      // fetching status
      queryClient.setQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current, old => ({
        ...old,
        isFetching: true,
      }));

      queryFn(params)
        .then(response => {
          const { items, pageIndex, total } = response;
          setIsFetched(prev => !prev);
          queryClient.setQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current, old => {
            let newItems = old?.items || [];
            if (items.length !== 0) {
              newItems = getDistinctRecords([...(old?.items ?? []), ...items], uniqueField);
              onResponseFn?.current?.(newItems);
            }
            return {
              ...old,
              total,
              isFetching: false,
              reachedLastPage: items.length === 0,
              pageIndex: pageIndex === 1 ? old?.pageIndex ?? 1 : pageIndex,
              pageSize: params.pageSize,
              items: newItems,
            };
          });
        })
        .catch(errors => {
          console.error('errors:', errors);
          queryClient.setQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current, old => ({
            ...old,
            isFetching: false,
          }));
        });
    },
    [createQueryFn, model, queryClient, uniqueField]
  );

  const fetchNextPage = () => {
    if (!queryData?.reachedLastPage) {
      fetch({ pageIndex: (queryData?.pageIndex ?? 1) + 1 });
    }
  };

  const hasFetchedOnMount = useRef<boolean>(false);

  const fetchOnInit = useCallback(() => {
    const cachedItems = queryData?.items;

    if (
      hasFetchedOnMount.current === true ||
      (queryData !== undefined && cachedItems === undefined) ||
      (cachedItems !== undefined && Array.isArray(cachedItems) && cachedItems?.length !== 0) ||
      queryData?.isFetching
    ) {
      return;
    }

    fetch({ pageIndex: 1, searchId });
    hasFetchedOnMount.current = true;
  }, [fetch, queryData, searchId]);

  useEffect(() => {
    if (!model || options?.length) {
      if (options?.length) {
        queryClient.setQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current, old => {
          return {
            ...old,
            pageIndex: 1,
            total: options.length,
            reachedLastPage: options.length === 0,
            pageSize: DEFAULT_QUERY_PAGINATION_PARAMS.pageSize!,
            items: getDistinctRecords(options),
          };
        });
      }
      return;
    }

    fetchOnInit();
  }, [fetchOnInit, model, options, queryClient]);

  const list = useMemo(() => {
    if (isFetched && !queryData?.items) {
      setIsFetched(false);
    }

    return (queryData?.items || []).map(item => {
      if (iteratorCallbackFnRef.current) {
        return iteratorCallbackFnRef.current(item);
      }
      return item;
    });
  }, [isFetched, queryData?.items]);

  const entities = useMemo(() => {
    return hash(list, uniqueField.toString()) || {};
  }, [list, uniqueField]);

  const appendQueryItem = useCallback(
    (mutateItem: T) => {
      if (mutateItem.id && entities?.[mutateItem.id]) {
        return;
      }

      queryClient.setQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current, old => ({
        ...old,
        items: getDistinctRecords([...(old?.items ?? []), mutateItem]),
      }));
    },
    [entities, queryClient]
  );

  const mutateQueryItem = (mutateItem: T) => {
    if (!queryData?.items?.some(i => i.id === mutateItem.id)) {
      fetch({ pageIndex: 1, searchId: mutateItem.id });
    }

    queryClient.setQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current, old => {
      return {
        ...old,
        items: (old?.items ?? []).map(item => {
          if (item.id === mutateItem.id) {
            return { ...item, ...mutateItem };
          }
          return item;
        }),
      };
    });
  };

  const removeQueryItem = (id: number) => {
    queryClient.setQueryData<PaginationQueryData<T>>(queryKeyWithEntityRef.current, old => {
      return {
        ...old,
        items: (old?.items ?? []).filter(item => item.id !== id),
      };
    });
  };

  return {
    list,
    entities,
    fetch,
    fetchNextPage,
    isFetched,
    appendQueryItem,
    mutateQueryItem,
    removeQueryItem,
  };
};
