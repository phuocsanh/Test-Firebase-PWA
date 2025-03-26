import { BooleanCell, TextCell, getMetaFeatureProps } from '@/components/data-table';
import { translationWithNamespace } from '@/lib/i18nUtils';

import { PermissionGroup } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

const t = translationWithNamespace('permissionGroup');

export const permissionGroupsColumns: ColumnDef<PermissionGroup>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: t('fields.name'),
    cell: TextCell,
    meta: getMetaFeatureProps('filter', 'text'),
    size: 400,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: t('fields.description'),
    cell: TextCell,
    meta: getMetaFeatureProps('filter', 'text'),
    size: 600,
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: t('fields.isActive'),
    cell: BooleanCell,
    meta: getMetaFeatureProps('filter', 'active'),
    size: 250,
  },
];
