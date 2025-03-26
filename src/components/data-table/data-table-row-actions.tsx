import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteLabel, editLabel } from '@/constant/const';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Pencil, Trash } from 'lucide-react';

interface DataTableRowActionsProps {
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (e: React.MouseEvent<HTMLElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode | React.ReactNode[];
}

const DataTableDropdownRowActions = ({
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  children,
}: DataTableRowActionsProps) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {onEdit && canEdit && <DropdownMenuItem onClick={onEdit}>{editLabel}</DropdownMenuItem>}
          {children}
          {onDelete && canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                {deleteLabel}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const DataTableRowActions = ({
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  children,
}: DataTableRowActionsProps) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {onEdit && (
        <Button
          type="button"
          size="icon"
          variant={'ghost'}
          disabled={!canEdit}
          className="h-4 w-4 min-w-4 p-0 text-primary-600  transition-all hover:text-primary-600"
          onClick={onEdit}
        >
          <Pencil
            size={16}
            // fill="#5186e1"
          />
        </Button>
      )}
      {onDelete && (
        <Button
          type="button"
          size="icon"
          variant={'ghost'}
          disabled={!canDelete}
          className="h-4 w-4 min-w-4 p-0 text-red-600 transition-all hover:text-red-600"
          onClick={onDelete}
        >
          <Trash size={16} fill="#dc2626" />
        </Button>
      )}
      {children}
    </div>
  );
};

export { DataTableDropdownRowActions, DataTableRowActions };
