import notification from '@/lib/notifications';

import { PeriodFilter } from '@/components/period-filter-form';
import { generateNotificationMessage } from '@/lib/i18nUtils';
import { ListComponentResponse, QueryPaginationParams } from '@/types';
import { MutationKey, QueryKey } from '@tanstack/react-query';
import { useState } from 'react';
import { useBoolean } from './use-boolean';
import { useEntity } from './use-entity';
import { useMutate } from './use-mutate';
import { useQueryListParams } from './user-query-list-params';

export const useDataTable = <T extends ListComponentResponse, F extends PeriodFilter>({
  initialQuery,
  queryRangeName,
  onSearch,
  getTargetAlias,
  deleteFn,
  deleteKey,
  invalidateKey,
}: {
  initialQuery?: Partial<QueryPaginationParams>;
  queryRangeName?: string;
  onSearch?: (values: F) => void;
  getTargetAlias?: (row: T | undefined) => string;
  deleteFn?: (id: number) => Promise<number>;
  deleteKey?: MutationKey;
  invalidateKey?: QueryKey;
}) => {
  // query
  const { queryListParams, ...queryListMethods } = useQueryListParams(queryRangeName, initialQuery);

  const [selectedTarget, setSelectedTarget] = useState<T>();

  const { removeQueryItem } = useEntity<T>({ queryKey: invalidateKey });

  const {
    state: isConfirmDeleteDialogOpen,
    setTrue: openDeleteConfirmDialog,
    toggle: toggleConfirmDeleteDialog,
  } = useBoolean(false);
  const {
    state: isEditDialogOpen,
    setTrue: openEditDialog,
    toggle: toggleEditDialog,
  } = useBoolean(false);

  const { mutate: executeDelete, isPending } = useMutate({
    mutationKey: [deleteKey || 'MUTATION_KEY_DEFAULT'],
    invalidateKey: invalidateKey,
    mutationFn: async (id: T['id']) => {
      if (deleteFn) {
        return await deleteFn(id);
      }
      return Promise.reject();
    },
  });

  const selectTargetToDelete = (row: T) => {
    setSelectedTarget(row);
    openDeleteConfirmDialog();
  };

  const selectTargetToEdit = (row: T) => {
    setSelectedTarget(row);
    openEditDialog();
  };

  const deleteTarget = () => {
    if (!selectedTarget) {
      return;
    }

    executeDelete(selectedTarget.id, {
      onSuccess: () => {
        const deletedMessage = generateNotificationMessage({
          action: 'delete',
          objectName: getTargetAlias ? getTargetAlias(selectedTarget) : '',
        });
        notification.success(deletedMessage);
        removeQueryItem(selectedTarget.id);
      },
    });
  };

  const search = (values: F) => {
    if (onSearch) {
      return onSearch(values);
    }

    const { range } = values;

    if (range && queryRangeName) {
      queryListMethods.addOrReplaceFilterDateColumn(queryRangeName, range[0]!, range[1]!);
    }
  };

  return {
    // state
    selectedTarget,
    setSelectedTarget,

    isConfirmDeleteDialogOpen,
    isEditDialogOpen,
    toggleConfirmDeleteDialog,
    toggleEditDialog,

    // behavior
    selectTargetToDelete,
    selectTargetToEdit,
    deleteTarget,
    isDeleting: isPending,

    // query
    search,
    queryListParams,
    queryListMethods,
  };
};
