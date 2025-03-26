import { ColumnDef } from '@tanstack/react-table';

import {
  InActiveCell,
  NationVietNamesePhoneCell,
  TextCell,
} from '@/components/data-table/data-table-cell';
import { getMetaFeatureProps } from '@/components/data-table/data-table-helper';
import { UserAvatar } from '@/components/user-avatar';
import { translationWithNamespace } from '@/lib/i18nUtils';
import { User } from '@/types';

const t = translationWithNamespace('user');

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'userName',
    accessorKey: 'userName',
    header: t('fields.userName'),
    cell: props => <TextCell {...props} />,
    meta: getMetaFeatureProps('filter', 'text'),
    size: 200,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: t('fields.name'),
    cell: props => {
      const src = (props.row.original.images as string) || '';
      const name = props.getValue<string>() || '';
      return (
        <div className="flex items-center gap-x-4">
          <UserAvatar src={src} name={name} />
          <div className="space-y-1">
            <TextCell {...props} className="font-medium" />
            <div className={`whitespace-nowrap text-left`}>{props.row.original.phone}</div>
          </div>
        </div>
      );
    },
    size: 200,
    meta: getMetaFeatureProps('filter', 'text'),
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: t('fields.address'),
    cell: TextCell,
    meta: getMetaFeatureProps('filter', 'text'),
    size: 200,
  },

  {
    id: 'phone',
    accessorKey: 'phone',
    header: t('fields.phone'),
    cell: props => <NationVietNamesePhoneCell {...props} format="#### ### ###" />,
    meta: getMetaFeatureProps('filter', 'text'),
    size: 240,
  },

  {
    id: 'email',
    accessorKey: 'email',
    header: t('fields.email'),
    cell: props => <TextCell {...props} />,
    meta: getMetaFeatureProps('filter', 'text'),
    size: 200,
  },
  {
    id: 'positionName',
    accessorKey: 'positionName',
    header: t('fields.position'),
    cell: TextCell,
    meta: getMetaFeatureProps('filter', 'text'),
    size: 180,
  },
  {
    id: 'isInactive',
    accessorKey: 'isInactive',
    header: t('fields.isInactive'),
    cell: InActiveCell,
    meta: getMetaFeatureProps('filter', 'active'),
    size: 180,
  },
];
