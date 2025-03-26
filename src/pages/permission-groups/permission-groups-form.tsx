/* eslint-disable @typescript-eslint/no-misused-promises */

import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { MUTATE, QUERIES, closeLabel, enterLabel, saveLabel } from '@/constant/const';
import { useFormHandler } from '@/hooks';
import { createMutationSuccessFn } from '@/lib/i18nUtils';
import { atBottom, cn, hash } from '@/lib/utils';
import {
  createPostMutateFn,
  createPutMutateFn,
  createQueryByIdFn,
  createQueryPaginationFn,
} from '@/services/utils';
import {
  FormInsideModalProps,
  Permission,
  PermissionGroup,
  PermissionGroupItem,
  QueryPaginationParams,
  permissionGroupSchema,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from 'devextreme-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const permissionGroupDefaultValues: PermissionGroup = {
  isActive: true,
  id: 0,
  name: '',
  description: '',
  sort: 0,
  storeId: 1,
  permission: [
    {
      permissionId: null,
      permissionName: '',
    },
  ],
};

interface PermissionGroupItemWithCheck extends PermissionGroupItem {
  checked: boolean;
}

const onPermissionMutationSuccess = createMutationSuccessFn('permissionGroups');

export const PermissionGroupForm = ({
  role,
  editId,
  toggle,
}: FormInsideModalProps<PermissionGroup>) => {
  const { t } = useTranslation(['permissionGroup', 'common']);

  const [permissionGroupItems, setPermissionGroupItems] = useState<PermissionGroupItemWithCheck[]>(
    []
  );

  const toggleForm = () => {
    if (toggle) toggle();
  };

  const permissionInfiniteQuery = useInfiniteQuery({
    queryKey: [QUERIES.PERMISSIONS],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const queryFn = createQueryPaginationFn<Permission>('permission');
      const params: QueryPaginationParams = {
        pageIndex: pageParam || 0,
        pageSize: 200,
        sortColumn: 'Id',
        sortOrder: 1,
        isPage: false,
      };
      return await queryFn(params);
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.pageIndex * lastPage.pageSize > lastPage.total
        ? undefined
        : lastPage.pageIndex + 1;
    },
    staleTime: Infinity,
  });

  const { pages } = permissionInfiniteQuery.data || {};

  const permissions = useMemo(() => pages?.flatMap(page => page.items), [pages]);

  const { loading, data, handleSubmit, methods } = useFormHandler<PermissionGroup>({
    queryKey: [MUTATE.PERMISSION_GROUP, editId],
    mutateKey: [MUTATE.PERMISSION_GROUP],
    invalidateKey: [QUERIES.PERMISSION_GROUP],
    queryId: editId,
    readFn: createQueryByIdFn<PermissionGroup>('permission-group'),
    createFn: createPostMutateFn<PermissionGroup>('permission-group'),
    updateFn: createPutMutateFn<PermissionGroup>('permission-group'),
    formatPayloadFn: data => ({
      ...data,
      permission: permissionGroupItems
        .filter(item => item.checked)
        .map(({ permissionId, permissionName }) => ({ permissionId, permissionName })),
    }),
    onCreateSuccess: data => {
      onPermissionMutationSuccess(data);
      toggleForm();
    },
    onUpdateSuccess: data => {
      onPermissionMutationSuccess(data);
      toggleForm();
    },
    formOptions: {
      resolver: zodResolver(permissionGroupSchema),
      defaultValues: permissionGroupDefaultValues,
    },
  });

  useEffect(() => {
    if (permissions) {
      const permissionGroupHash = hash(data?.permission || [], 'permissionId');

      setPermissionGroupItems(() => {
        return permissions.map(permission => {
          const activePermission = permissionGroupHash?.[permission.id];

          if (activePermission) {
            return {
              ...activePermission,
              checked: true,
            };
          }

          return {
            checked: false,
            permissionId: permission.id,
            permissionName: permission.name,
          };
        });
      });
    }
  }, [data?.permission, permissions]);

  const handleItemCheck = (checked: boolean, id: number, isAll?: boolean) => {
    setPermissionGroupItems(old => {
      return old.map(item => {
        if (item.permissionId !== id && !isAll) {
          return item;
        }
        return { ...item, checked };
      });
    });
  };

  return (
    <Form {...methods}>
      <form className="p-1" autoComplete="off" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1">
          <FormField name="name" label={t('fields.name')}>
            <Input placeholder={`${enterLabel} ${t('fields.name')}`} />
          </FormField>
          <FormField name="description" label={t('fields.description')}>
            <Textarea placeholder={`${enterLabel} ${t('fields.description')}`} />
          </FormField>
          <div
            className="max-h-[30rem] overflow-y-auto"
            onScroll={async event => {
              if (!atBottom(event.currentTarget)) {
                return;
              }
              await permissionInfiniteQuery.fetchNextPage();
            }}
          >
            <table className="w-full caption-bottom text-xs">
              <TableHeader className="sticky top-0 bg-white" style={{ zIndex: 1 }}>
                <TableRow>
                  <TableHead>{t('fields.permission.name')}</TableHead>
                  <TableHead>
                    <Checkbox
                      checked={permissionGroupItems.every(item => item.checked)}
                      onCheckedChange={(checked: boolean) => handleItemCheck(checked, 0, true)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionGroupItems?.map(item => (
                  <TableRow
                    key={item.permissionId}
                    className={cn('h-10', item.checked ? 'bg-slate-200/60' : '')}
                  >
                    <TableCell className="text-md">{item.permissionName}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={(checked: boolean) => {
                          if (item.permissionId) {
                            handleItemCheck(checked, item.permissionId);
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
          <FormField label={t('fields.isActive')} name={'isActive'} type="checkbox">
            <Checkbox />
          </FormField>
        </div>
        <DialogFooter className="flex flex-row-reverse gap-x-2 bg-white py-1">
          <Button
            stylingMode="contained"
            text={saveLabel}
            icon="save"
            type="success"
            disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
            useSubmitBehavior
          />
          <Button
            stylingMode="outlined"
            text={closeLabel}
            icon="close"
            disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
            onClick={toggleForm}
            type="default"
          />
        </DialogFooter>
      </form>
    </Form>
  );
};
