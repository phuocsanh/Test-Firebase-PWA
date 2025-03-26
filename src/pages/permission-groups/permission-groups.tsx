import { BasicDialog } from '@/components/basic-dialog';
import { DeleteConfirmDialog } from '@/components/confirm-dialog';
import { PageLayout } from '@/components/page-layout';
import { PeriodFilter } from '@/components/period-filter-form';
import { MUTATE, PERMISSIONS, QUERIES } from '@/constant';
import { useDataTable, usePermission } from '@/hooks';
import { PermissionGroupForm, PermissionGroupsDataTable } from '@/pages/permission-groups';
import { createDeleteMutateFn } from '@/services/utils';
import { PermissionGroup } from '@/types';
import { useTranslation } from 'react-i18next';

export const PermissionGroupsPage = () => {
  const { t } = useTranslation('permissionGroup');

  const role = usePermission(PERMISSIONS.PERMISSION_GROUP);

  const getTargetAlias = (target: PermissionGroup | undefined) => {
    if (!target) {
      return '';
    }
    return `${target?.name}`;
  };

  const {
    // state
    selectedTarget,
    // setSelectedTarget,

    // delete feature
    isConfirmDeleteDialogOpen,
    toggleConfirmDeleteDialog,
    selectTargetToDelete,
    deleteTarget,

    // edit feature
    isEditDialogOpen,
    toggleEditDialog,
    selectTargetToEdit,
  } = useDataTable<PermissionGroup, PeriodFilter>({
    getTargetAlias,
    deleteFn: createDeleteMutateFn<PermissionGroup>('permission-group'),
    deleteKey: [MUTATE.DELETE_PERMISSION_GROUP],
    invalidateKey: [QUERIES.PERMISSION_GROUP],
  });

  const selectedId = selectedTarget?.id || 0;

  const handleAddNewClick = () => selectTargetToEdit({ id: 0 } as PermissionGroup);

  return (
    <PageLayout header={t('page.header')} description={t('page.description')}>
      <PermissionGroupsDataTable
        role={role}
        onEditClick={selectTargetToEdit}
        onAddNewClick={handleAddNewClick}
        onDeleteClick={selectTargetToDelete}
      />
      <BasicDialog
        className="max-w-lg"
        open={isEditDialogOpen}
        toggle={toggleEditDialog}
        title={selectedId ? t('page.form.edit') : t('page.form.addNew')}
        description={t('page.form.description')}
      >
        <PermissionGroupForm role={role} editId={selectedId} />
      </BasicDialog>
      <DeleteConfirmDialog
        onConfirm={deleteTarget}
        open={isConfirmDeleteDialogOpen}
        toggle={toggleConfirmDeleteDialog}
        model="permissionGroup"
        name={getTargetAlias(selectedTarget)}
      />
    </PageLayout>
  );
};
