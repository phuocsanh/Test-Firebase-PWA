import {
  DataTable,
  DataTableRowActions,
  getDataTableRowContextMenu,
} from '@/components/data-table';
import { QUERIES, TABLES } from '@/constant/const';
import { permissionGroupsColumns } from '@/pages/permission-groups';
import { PermissionGroup } from '@/types';
import { DataTableWithActionsProps } from '@/types/data-table';
import { ColumnDef } from '@tanstack/react-table';

export const PermissionGroupsDataTable = ({
  role,
  onAddNewClick,
  onEditClick,
  onDeleteClick,
}: DataTableWithActionsProps<PermissionGroup>) => {
  const { isUpdate, isDelete } = role || {};

  const actionColumn: ColumnDef<PermissionGroup> = {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        onEdit={() => {
          if (onEditClick) onEditClick(row.original);
        }}
        onDelete={() => {
          if (onDeleteClick) onDeleteClick(row.original);
        }}
        canEdit={isUpdate}
        canDelete={isDelete}
      />
    ),
  };

  const columns =
    isUpdate || isDelete ? [...permissionGroupsColumns, actionColumn] : permissionGroupsColumns;

  return (
    <DataTable
      tableId={TABLES.PERMISSION_GROUP}
      // default props
      role={role}
      columns={columns}
      onAddButtonClick={onAddNewClick}
      // query feature props
      paginationModel="permission-group"
      paginationQueryKey={[QUERIES.PERMISSION_GROUP]}
      onRowDoubleClick={onEditClick}
      // context menu feature props
      contextMenuItems={getDataTableRowContextMenu({
        onEdit: isUpdate ? onEditClick : undefined,
        onDelete: isUpdate ? onDeleteClick : undefined,
      })}
    />
  );
};
