import i18next from '@/i18n';

import { BasicDialogChildrenProps } from '@/components/basic-dialog';
import { Combobox } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MUTATE, QUERIES, applyLabel, closeLabel } from '@/constant/const';
import { useMutate } from '@/hooks';
import { generateNotificationMessage } from '@/lib/i18nUtils';
import notification from '@/lib/notifications';
import { getRandomNumber } from '@/lib/number';
import { hash } from '@/lib/utils';
import {
  createPutMutateFn,
  createQueryByIdFn,
  createQueryPaginationFn,
  getRequest,
  postRequest,
} from '@/services';
import {
  Permission,
  PermissionGroup,
  PermissionMethod,
  QueryPaginationParams,
  User,
  UserPermission,
} from '@/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const userPermissionColumns = [
  i18next.t('page.userPermission.table.order', { ns: 'user' }),
  i18next.t('page.userPermission.table.id', { ns: 'user' }),
  i18next.t('page.userPermission.table.permissionId', { ns: 'user' }),
  i18next.t('page.userPermission.table.name', { ns: 'user' }),
  i18next.t('page.userPermission.table.show', { ns: 'user' }),
  i18next.t('page.userPermission.table.create', { ns: 'user' }),
  i18next.t('page.userPermission.table.update', { ns: 'user' }),
  i18next.t('page.userPermission.table.delete', { ns: 'user' }),
  i18next.t('page.userPermission.table.import', { ns: 'user' }),
  i18next.t('page.userPermission.table.export', { ns: 'user' }),
  i18next.t('page.userPermission.table.print', { ns: 'user' }),
  i18next.t('page.userPermission.table.toggleRow', { ns: 'user' }),
];

type UserPermissionSettingProps = {
  userId?: User['id'];
} & BasicDialogChildrenProps;

const actions = ['isShow', 'isCreate', 'isUpdate', 'isDelete', 'isImport', 'isExport', 'isPrint'];

export const UsersPermissionsSetting = ({ userId, toggle }: UserPermissionSettingProps) => {
  const { t } = useTranslation('user');

  const [selectedPermissionGroups, setSelectedPermissionGroup] = useState<number[]>([]);
  const [editableUserPermissions, setEditableUserPermissions] = useState<UserPermission[]>([]);

  // fetch user
  const { data: user } = useQuery({
    queryKey: [MUTATE.USER, userId],
    queryFn: async () => {
      if (userId) {
        return await createQueryByIdFn<User>('user')(userId);
      }
      return null;
    },
    staleTime: 0,
  });

  // fetch all permissions
  const permissionInfiniteQuery = useInfiniteQuery({
    queryKey: [QUERIES.PERMISSIONS],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const queryFn = createQueryPaginationFn<Permission>('permission');
      const params: QueryPaginationParams = {
        pageIndex: pageParam || 0,
        pageSize: 100,
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
    select: data => data.pages.flatMap(item => item.items),
    staleTime: Infinity,
  });

  // fetch all permission groups
  const { data: fixedPermissionGroup } = useQuery({
    queryKey: [QUERIES.PERMISSION_GROUP, 'LIST_ALL'],
    queryFn: () => getRequest<PermissionGroup[]>('/permission-group/get-list-all?id=0'),
    select: data => data,
  });

  const { data: permissionsByGroupMap } = useQuery({
    queryKey: [QUERIES.PERMISSIONS, selectedPermissionGroups],
    queryFn: async () => {
      return await postRequest<PermissionGroup[]>(
        '/permission-group/get-by-ids',
        selectedPermissionGroups
      );
    },
    select: data => {
      const permissions = data.flatMap(item => item.permission);
      return hash(permissions, 'permissionId');
    },
  });

  // set selected permission groups from user to combobox
  useEffect(() => {
    if (user) {
      const selectedPermissions =
        user?.userPermissionGroup.map(permissionGroup => permissionGroup.permissionGroupId) ?? [];
      setSelectedPermissionGroup(selectedPermissions);
    }
  }, [user]);

  // const { mutateAsync: createUserPermissionAsync } = useMutate({
  //   mutationKey: [MUTATE.USER, user?.id],
  //   mutationFn: async (payload: UserPermission[]) => await postRequest('/user-permission', payload),
  // });

  const { mutateAsync: updateUserAsync } = useMutate({
    mutationKey: [MUTATE.USER, user?.id],
    mutationFn: async (payload: User) => await createPutMutateFn('user')(payload),
  });

  useEffect(() => {
    const userPermissionMap = hash(user?.userPermission ?? [], 'permissionId');
    if (permissionInfiniteQuery.data && user?.id && user?.name) {
      const newEditable = permissionInfiniteQuery.data?.reduce(
        (result: UserPermission[], permission: Permission) => {
          if (!permissionsByGroupMap?.[permission.id]) {
            return result;
          }

          const userPermission = userPermissionMap?.[permission.id];

          if (userPermission) {
            return [
              ...result,
              {
                ...userPermission,
                userName: user.name || '',
                permissionName: permission.name,
              },
            ];
          }

          return [
            ...result,
            {
              id: -getRandomNumber(),
              userId: user.id,
              userName: user.name || '',
              permissionId: permission.id,
              permissionName: permission.name,
              isCreate: false,
              isUpdate: false,
              isDelete: false,
              isPrint: false,
              isImport: false,
              isExport: false,
              isShow: false,
            },
          ];
        },
        []
      );

      if (newEditable !== undefined) {
        const sortedUserPermissions = newEditable.sort((a, b) => {
          return Number(a.permissionId) - Number(b.permissionId);
        });
        setEditableUserPermissions(sortedUserPermissions);
      }
    }
  }, [
    user?.id,
    user?.name,
    user?.userPermission,
    permissionsByGroupMap,
    permissionInfiniteQuery.data,
  ]);

  const permissionMap = hash(permissionInfiniteQuery.data || [], 'id');

  const getObjPermission = (id: number) => {
    return permissionMap?.[id];
  };

  const getSwitchableActions = (row: UserPermission) =>
    actions.filter(
      action => getObjPermission(row.permissionId)?.[action as keyof PermissionMethod]
    );

  const handleCheck = (checked: boolean, column: keyof UserPermission, idEdit: number) => {
    setEditableUserPermissions(old => {
      return old.map(row => {
        if (row.id !== idEdit) {
          return row;
        }
        return { ...row, [column]: checked };
      });
    });
  };

  const handleCheckAllRow = (checked: boolean, idEdit: number) => {
    setEditableUserPermissions(old =>
      old.map(row => {
        if (row.id !== idEdit) {
          return row;
        }

        return {
          ...row,
          ...getSwitchableActions(row).reduce((acc, role) => ({ ...acc, [role]: checked }), {}),
        };
      })
    );
  };

  const handleCheckAllColumn = (checked: boolean, column: keyof PermissionMethod) => {
    setEditableUserPermissions(old =>
      old.map(row => {
        if (!getObjPermission(row.permissionId)?.[column]) {
          return row;
        }
        return { ...row, [column]: checked };
      })
    );
  };

  const handleCheckAll = (checked: boolean) => {
    setEditableUserPermissions(old =>
      old.map(row => ({
        ...row,
        ...getSwitchableActions(row).reduce((acc, role) => ({ ...acc, [role]: checked }), {}),
      }))
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const userPermission = editableUserPermissions.map(permission => ({
      id: permission.id > 0 ? permission.id : 0,
      userId: permission.userId,
      permissionId: permission.permissionId,
      isShow: permission.isShow,
      isCreate: permission.isCreate,
      isUpdate: permission.isUpdate,
      isDelete: permission.isDelete,
      isImport: permission.isImport,
      isExport: permission.isExport,
      isPrint: permission.isPrint,
      storeId: 1,
    }));

    const userPermissionGroup = selectedPermissionGroups.map(permissionGroupId => ({
      userId: user?.id,
      permissionGroupId,
    }));

    const payload: User = {
      ...user,
      userPermission,
      userPermissionGroup,
    };

    try {
      // const createUserPermissionResponse = await createUserPermissionAsync(userPermission);

      // if (!createUserPermissionResponse) {
      //   throw new Error('[FAILED TO CREATE USER PERMISSIONS]');
      // }

      const updatedUserResponse = await updateUserAsync(payload);

      if (!updatedUserResponse) {
        throw new Error('[FAILED TO UPDATE USER WITH NEW USER PERMISSIONS');
      }

      const message = generateNotificationMessage({
        action: 'apply',
        objectName: t('page.userPermission.model'),
      });
      notification.success(message);
    } catch (error) {
      console.error(error);
    }

    if (toggle) {
      toggle();
      setEditableUserPermissions([]);
    }
  };

  const isRowCheckAll = (row: UserPermission) =>
    getSwitchableActions(row).every(role => row[role as keyof PermissionMethod]);

  const isColumnCheckAll = (column: string) => {
    const role = column as keyof PermissionMethod;

    return editableUserPermissions.every(userPermission => {
      if (!getObjPermission(userPermission.permissionId)?.[role]) {
        return true;
      }

      return userPermission[role];
    });
  };

  const isCheckAll = () => editableUserPermissions.every(row => isRowCheckAll(row));

  return (
    <>
      <Combobox
        multiple
        showFields={['name']}
        value={selectedPermissionGroups}
        options={fixedPermissionGroup || []}
        placeholder={t('page.userPermission.selectPermissionGroup')}
        onChange={value => {
          // InteractedPermissionGroup();
          if (Array.isArray(value)) {
            setSelectedPermissionGroup(value as number[]);
          }
        }}
      />
      <div className="block max-h-[60vh] overflow-auto">
        <table className=" w-full caption-bottom  text-xs">
          <TableHeader className="sticky top-0 bg-white" style={{ zIndex: 1000 }}>
            <TableRow>
              {userPermissionColumns.map(
                header =>
                  header !== 'ID' && (
                    <TableHead key={header} className="p-2">
                      {header}
                    </TableHead>
                  )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              {editableUserPermissions
                // .filter(itemEdit => permissionInGroup?.includes(itemEdit.permissionId))
                ?.map((userPermission, index) => (
                  <TableRow key={index}>
                    <TableCell className="p-2">{index + 1}</TableCell>
                    {/* <TableCell>{userPermission.permissionId}</TableCell> */}
                    <TableCell className="whitespace-nowrap p-2">
                      {userPermission.permissionId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap p-2">
                      {userPermission.permissionName}
                    </TableCell>
                    {actions.map(role => {
                      const permissionRole = role as keyof PermissionMethod;
                      const isRoleEnable = getObjPermission(userPermission.permissionId)?.[
                        permissionRole
                      ];
                      return (
                        <TableCell key={permissionRole} className="p-2">
                          <Switch
                            disabled={!isRoleEnable}
                            checked={userPermission[permissionRole]}
                            onCheckedChange={checked =>
                              handleCheck(checked, permissionRole, userPermission.id)
                            }
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell className="p-2">
                      <Switch
                        checked={isRowCheckAll(userPermission)}
                        onCheckedChange={checked => handleCheckAllRow(checked, userPermission.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                {actions.map(role => {
                  const permissionRole = role as keyof PermissionMethod;
                  return (
                    <TableCell className="p-2" key={permissionRole}>
                      <Switch
                        checked={isColumnCheckAll(permissionRole)}
                        onCheckedChange={checked => handleCheckAllColumn(checked, permissionRole)}
                      />
                    </TableCell>
                  );
                })}
                <TableCell className="p-2">
                  <Switch
                    checked={isCheckAll()}
                    onCheckedChange={checked => handleCheckAll(checked)}
                  />
                </TableCell>
              </TableRow>
            </>
          </TableBody>
        </table>
      </div>
      <Separator />
      <DialogFooter>
        <Button
          variant={'outline'}
          onClick={() => {
            if (toggle) {
              toggle();
            }
          }}
        >
          {closeLabel}
        </Button>
        <Button onClick={() => void handleSubmit()}>{applyLabel}</Button>
      </DialogFooter>
    </>
  );
};
