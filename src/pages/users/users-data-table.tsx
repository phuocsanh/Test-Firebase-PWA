import { DataTable } from '@/components/data-table';
import { getDataTableRowContextMenu } from '@/components/data-table/data-table-helper';
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import { Button } from '@/components/ui/button';
import { QUERIES, TABLES } from '@/constant/const';
import { PERMISSIONS } from '@/constant/permissions';
import { usePermission } from '@/hooks/use-permission';
import { DataTableWithActionsProps, User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { KeyRound } from 'lucide-react';
import { usersColumns } from './users-columns';

export const UsersDataTable = ({
  role,
  onAddNewClick,
  onEditClick,
  onDeleteClick,
  onEditPermissionClick,
}: DataTableWithActionsProps<User> & {
  onEditPermissionClick?: (e: User) => void;
}) => {
  const { isUpdate, isDelete } = role || {};
  const editPermissionRole = usePermission(PERMISSIONS.EDIT_PERMISSION);

  const actionColumn: ColumnDef<User> = {
    id: 'actions',
    size: 130,
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
      >
        {editPermissionRole?.isUpdate && (
          <Button
            type="button"
            size="icon"
            variant={'ghost'}
            className="h-4 w-4 min-w-4 p-0 text-teal-600 transition-all hover:text-teal-600 active:bg-gray-200"
            onClick={() => {
              if (onEditPermissionClick) {
                onEditPermissionClick(row.original);
              }
            }}
          >
            <KeyRound size={16} />
          </Button>
        )}
      </DataTableRowActions>
    ),
  };

  const columns = isUpdate || isDelete ? [...usersColumns, actionColumn] : usersColumns;

  return (
    <DataTable
      tableId={TABLES.USER}
      role={role}
      columns={columns}
      paginationModel="user"
      onAddButtonClick={onAddNewClick}
      paginationQueryKey={[QUERIES.USERS]}
      tableContentAttributes={{
        className: 'max-h-[calc(100vh-20rem)]',
      }}
      onRowDoubleClick={onEditClick}
      contextMenuItems={getDataTableRowContextMenu({
        onEdit: isUpdate ? onEditClick : undefined,
        onDelete: isUpdate ? onDeleteClick : undefined,
      })}
      initialState={{
        mobileColumnVisibility: {
          position1: 'name',
          position3: 'address',
          position4: 'phone',
          position5: 'email',
        },
      }}
    />
  );
};
