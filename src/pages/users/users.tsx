import { DeleteConfirmDialog } from '@/components/confirm-dialog';

import { BasicDialog } from '@/components/basic-dialog';
import { PageLayout } from '@/components/page-layout';
import { PeriodFilter } from '@/components/period-filter-form';
import { MUTATE, PERMISSIONS, QUERIES } from '@/constant';
import { useBoolean, useDataTable, usePermission } from '@/hooks';
import { UserForm, UsersDataTable } from '@/pages/users';
import { createDeleteMutateFn } from '@/services';
import { User } from '@/types';
import { Trans, useTranslation } from 'react-i18next';
import { UsersPermissionsSetting } from './users-permission-setting';

export const UsersPage = () => {
  const { t } = useTranslation('user');

  const role = usePermission(PERMISSIONS.USER);

  const getTargetAlias = (target: User | undefined) => {
    if (!target) {
      return '';
    }
    return `${target?.name} - ${target?.email}`;
  };

  const {
    // state
    selectedTarget,
    setSelectedTarget,

    // delete feature
    isConfirmDeleteDialogOpen,
    toggleConfirmDeleteDialog,
    selectTargetToDelete,
    deleteTarget,
    isDeleting,

    // edit feature
    isEditDialogOpen,
    toggleEditDialog,
    selectTargetToEdit,
  } = useDataTable<User, PeriodFilter>({
    getTargetAlias,
    deleteFn: createDeleteMutateFn<User>('user'),
    deleteKey: [MUTATE.DELETE_USER],
    invalidateKey: [QUERIES.USERS],
  });

  const selectedId = selectedTarget?.id || 0;

  const {
    state: isDelegateDialogOpen,
    setTrue: openDelegateDialog,
    toggle: toggleDelegateDialog,
  } = useBoolean();

  const handleEditPermissionClick = (row: User) => {
    setSelectedTarget(row);
    openDelegateDialog();
  };

  const handleAddNewClick = () => selectTargetToEdit({ id: 0 } as User);

  return (
    <PageLayout header={t('page.header')} description={t('page.description')}>
      <UsersDataTable
        role={role}
        onEditClick={selectTargetToEdit}
        onAddNewClick={handleAddNewClick}
        onDeleteClick={selectTargetToDelete}
        onEditPermissionClick={handleEditPermissionClick}
      />
      <BasicDialog
        className="max-w-screen-lg"
        open={isEditDialogOpen}
        toggle={toggleEditDialog}
        title={selectedId ? t('page.form.edit') : t('page.form.addNew')}
        description={t('page.form.description')}
      >
        <UserForm role={role} editId={selectedId} />
      </BasicDialog>
      <DeleteConfirmDialog
        isDeleting={isDeleting}
        onConfirm={deleteTarget}
        open={isConfirmDeleteDialogOpen}
        toggle={toggleConfirmDeleteDialog}
        model="user"
        name={getTargetAlias(selectedTarget)}
      />
      <BasicDialog
        open={isDelegateDialogOpen}
        toggle={toggleDelegateDialog}
        title={t('page.userPermission.header', { name: selectedTarget?.name })}
        description={
          <Trans
            ns="user"
            i18nKey={'page.userPermission.description'}
            values={{ name: selectedTarget?.name }}
            components={[
              <span className="font-bold text-primary-600" />,
              <span className="font-bold text-primary-600" />,
            ]}
          />
        }
      >
        <UsersPermissionsSetting userId={selectedTarget?.id} />
      </BasicDialog>
    </PageLayout>
  );
};
