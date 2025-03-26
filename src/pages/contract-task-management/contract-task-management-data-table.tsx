/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DeleteConfirmDialog } from '@/components/confirm-dialog';
import { DevexDataGrid } from '@/components/devex-data-grid';
import { PageLayout } from '@/components/page-layout';
import { PeriodFilter, PeriodFilterForm } from '@/components/period-filter-form';
import { MUTATE, PATHS, PERMISSIONS, QUERIES, TABLES } from '@/constant';
import { useAuth, useDataTable, useEntity, usePermission } from '@/hooks';
import { translationWithNamespace } from '@/lib/i18nUtils';
import { callbackWithTimeout, displayExpr } from '@/lib/utils';
import { createDeleteMutateFn, createQueryPaginationFn } from '@/services';
import { ContractTaskManagement } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Button, Column, Editing, Export, Lookup } from 'devextreme-react/data-grid';
import { ColumnButtonClickEvent } from 'devextreme/ui/data_grid';
import { useNavigate } from 'react-router-dom';

const path = PATHS.CONTRACT_TASK_MANAGEMENT;

// const onExporting = createExportingEvent(' ContractTaskManagement.xlsx', 'Main');
const t = translationWithNamespace('contractTaskManagement');

export const ContractTaskManagementDataTable = () => {
  const navigate = useNavigate();
  // const { t } = useTranslation('contractTaskManagement');
  const role = usePermission(PERMISSIONS.CONTRACT_TASK_MANAGEMENT);
  const { user, projects } = useAuth();
  const projectIds = projects.map(i => i.id).toString() || user?.projectIds;

  const { list: userStore } = useEntity({ queryKey: [QUERIES.USERS], model: 'user' });
  const { list: departmentStore } = useEntity({
    queryKey: [QUERIES.DEPARTMENT],
    model: 'department',
  });

  const { data, refetch } = useQuery({
    queryKey: [QUERIES.CONTRACT_TASK_MANAGEMENT],
    queryFn: () => {
      return createQueryPaginationFn<ContractTaskManagement>('contract-task-management')({
        pageIndex: 1,
        pageSize: -1,
        sortColumn: 'Id',
        sortOrder: 1,
        isPage: false,
        filterColumn: [],
        ...queryListParams,
      });
    },
  });
  const { items } = data || { items: [] };

  //hiện thông tin khi nhấn vào nút xóa
  const getTargetAlias = (target: ContractTaskManagement | undefined) => {
    if (!target) {
      return '';
    }
    return target.code.toString();
  };

  const {
    selectedTarget,
    isConfirmDeleteDialogOpen,
    toggleConfirmDeleteDialog,
    selectTargetToDelete,
    deleteTarget,
    isDeleting,
    queryListParams,
    queryListMethods,
  } = useDataTable<ContractTaskManagement, PeriodFilter>({
    queryRangeName: 'contractTaskManagementTime',
    getTargetAlias,
    deleteFn: createDeleteMutateFn<ContractTaskManagement>('contract-task-management'),
    deleteKey: [MUTATE.DELETE_CONTRACT_TASK_MANAGEMENT],
    invalidateKey: [QUERIES.CONTRACT_TASK_MANAGEMENT],
    initialQuery: {
      filterColumn: [
        {
          column: 'ProjectId',
          expression: 'IN',
          keySearch: `(${projectIds || 0})`,
        },
      ],
    },
  });

  const onEditClick = (e: ColumnButtonClickEvent<ContractTaskManagement>) => {
    if (e.row?.data) {
      navigate(`${path}/` + e.row.data?.id, { state: path });
    }
  };

  const onAddClick = () => {
    navigate(`${path}/new`, { state: path });
  };

  const onDeleteClick = (e: ColumnButtonClickEvent<ContractTaskManagement>) => {
    if (e.row?.data) {
      selectTargetToDelete(e.row.data);
    }
  };
  const { isUpdate, isDelete } = role || {};
  return (
    <PageLayout header={t('page.header')}>
      <PeriodFilterForm
        defaultSearchValues={{
          range: [queryListParams.fromDate!, queryListParams.toDate!],
        }}
        onSearch={values => {
          if (values) {
            const [from, to] = values.range;
            queryListMethods.addOrReplaceFilterDateColumn('contractTaskManagementTime', from!, to!);
          }
          callbackWithTimeout(refetch);
        }}
      ></PeriodFilterForm>

      <DevexDataGrid
        id={TABLES.CONTRACT_TASK_MANAGEMENT}
        dataSource={items}
        onAddNewClick={onAddClick}
        onRefresh={() => {
          callbackWithTimeout(refetch);
        }}
      >
        <Export enabled={true} />
        <Editing allowUpdating={isUpdate} allowDeleting={isDelete} useIcons />
        <Column type="buttons">
          <Button name="edit" onClick={onEditClick} />
          <Button name="delete" onClick={onDeleteClick} />
        </Column>
        {/* mã phiếu */}
        <Column dataField="code" caption={t('fields.code')} width={150} />
        {/* ngày gửi */}
        <Column
          dataField="contractTaskManagementTime"
          caption={t('fields.contractTaskManagementTime')}
          dataType="date"
          width={100}
        />
        {/* Dự án */}
        <Column dataField="projectId" caption={t('fields.projectId')} width={200}>
          <Lookup dataSource={projects} displayExpr={displayExpr(['name'])} valueExpr={'id'} />
        </Column>

        {/* Phòng quản lý dự án */}
        <Column
          dataField="projectManagementDepartmentId"
          caption={t('fields.projectManagementDepartmentId')}
          width={200}
        >
          <Lookup
            dataSource={departmentStore}
            displayExpr={displayExpr(['name'])}
            valueExpr={'id'}
          />
        </Column>
        {/* GĐ.QLDA*/}
        <Column
          dataField="projectManagementDirectorId"
          caption={t('fields.projectManagementDirectorId')}
          width={200}
        >
          <Lookup dataSource={userStore} displayExpr={displayExpr(['name'])} valueExpr={'id'} />
        </Column>
        {/* ngày hoàn thành */}
        <Column
          dataField="completionTime"
          caption={t('fields.completionTime')}
          dataType="date"
          width={100}
        />
        {/* Dự thảo BB hoàn thiện/thương thảo HĐ */}
        <Column dataField="isDraftCompletion" caption={t('fields.isDraftCompletion')} width={200} />
        {/* Dự thảo hợp đồng */}
        <Column dataField="isDraftContract" caption={t('fields.isDraftContract')} width={200} />

        {/* Dự thảo phu lục hợp đồng */}
        <Column
          dataField="isDraftSubContract"
          caption={t('fields.isDraftSubContract')}
          width={200}
        />
        {/* HS đủ điều kiện ký kết */}
        <Column
          dataField="isEligibleForSigning"
          caption={t('fields.isEligibleForSigning')}
          width={200}
        />
        {/* Ghi chú */}
        <Column dataField="note" caption={t('fields.note')} />
      </DevexDataGrid>
      <DeleteConfirmDialog
        isDeleting={isDeleting}
        open={isConfirmDeleteDialogOpen}
        toggle={toggleConfirmDeleteDialog}
        onConfirm={() => {
          deleteTarget();
        }}
        name={getTargetAlias(selectedTarget)}
        model="contract-task-management"
      />
    </PageLayout>
  );
};
