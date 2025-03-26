/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BasicDialog } from '@/components/basic-dialog';
import { DeleteConfirmDialog } from '@/components/confirm-dialog';
import { DevexDataGrid } from '@/components/devex-data-grid';
import { DxActiveStatus } from '@/components/dx-active-status';
import { PageLayout } from '@/components/page-layout';
import { PeriodFilter } from '@/components/period-filter-form';
import { MUTATE, PERMISSIONS, QUERIES, TABLES } from '@/constant';
import { useDataTable, usePermission } from '@/hooks';
import { translationWithNamespace } from '@/lib/i18nUtils';
import { callbackWithTimeout } from '@/lib/utils';
import { createDeleteMutateFn, createQueryPaginationFn } from '@/services';
import { DocumentGroup } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Button, Column, Export } from 'devextreme-react/data-grid';
import { ColumnButtonClickEvent } from 'devextreme/ui/data_grid';
import { DocumentGroupForm } from './document-group-form';

//export excel
const t = translationWithNamespace('documentGroup');

export const DocumentGroupPage = () => {
  //lấy quyền
  const role = usePermission(PERMISSIONS.DOCUMENT_GROUP);

  const { data, refetch } = useQuery({
    queryKey: [QUERIES.DOCUMENT_GROUP],
    queryFn: () =>
      createQueryPaginationFn('document-group')({
        pageIndex: 1,
        pageSize: -1,
        sortColumn: 'Id',
        sortOrder: 1,
        isPage: false,
        filterColumn: [],
      }),
    // select: data => {
    //   return { ...data, items: data.items.map(item => ({ ...item, isInactive: true })) };
    // },
  });

  const { items } = data || {};

  const getTargetAlias = (target: DocumentGroup | undefined) => {
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
    isDeleting,

    // edit feature
    isEditDialogOpen,
    toggleEditDialog,
    selectTargetToEdit,
  } = useDataTable<DocumentGroup, PeriodFilter>({
    getTargetAlias,
    deleteFn: createDeleteMutateFn<DocumentGroup>('document-group'),
    deleteKey: [MUTATE.DELETE_DOCUMENT_GROUP],
    invalidateKey: [QUERIES.DOCUMENT_GROUP],
  });

  const selectedId = selectedTarget?.id || 0;
  const onEditClick = (e: ColumnButtonClickEvent<DocumentGroup>) => {
    if (e.row?.data) {
      selectTargetToEdit(e.row.data);
    }
  };

  const onAddClick = () => {
    selectTargetToEdit({ id: 0 } as DocumentGroup);
  };

  const onDeleteClick = (e: ColumnButtonClickEvent<DocumentGroup>) => {
    if (e.row?.data) {
      selectTargetToDelete(e.row.data);
    }
  };

  return (
    <PageLayout header={t('page.header')}>
      <DevexDataGrid
        id={TABLES.DOCUMENT_GROUP}
        dataSource={items}
        onAddNewClick={onAddClick}
        onRefresh={() => callbackWithTimeout(refetch)}
        hoverStateEnabled
        focusedRowEnabled={true}
      >
        <Export enabled={true} />

        {/* thao tác */}
        <Column type="buttons">
          <Button name="edit" onClick={onEditClick} />
          <Button name="delete" onClick={onDeleteClick} />
        </Column>

        {/* Trường dữ liệu */}
        <Column dataField="code" caption={t('fields.code')} />
        <Column dataField="name" caption={t('fields.name')} />
        <Column dataField="note" caption={t('fields.note')} />
        <Column
          dataField="isActive"
          caption={t('fields.isActive')}
          dataType="boolean"
          cellRender={DxActiveStatus}
        />
      </DevexDataGrid>
      <BasicDialog
        className="w-auto"
        open={isEditDialogOpen}
        toggle={toggleEditDialog}
        title={selectedId ? t('page.form.edit') : t('page.form.addNew')}
      >
        <DocumentGroupForm role={role} editId={selectedId} />
      </BasicDialog>
      <DeleteConfirmDialog
        isDeleting={isDeleting}
        onConfirm={deleteTarget}
        open={isConfirmDeleteDialogOpen}
        toggle={toggleConfirmDeleteDialog}
        model="document-group"
        name={getTargetAlias(selectedTarget)}
      />
    </PageLayout>
  );
};
