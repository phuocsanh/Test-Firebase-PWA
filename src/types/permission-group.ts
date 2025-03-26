import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from '.';

const requirePermissionGroupText = requiredTextWithNamespace('permissionGroup');

export const permissionGroupSchema = z.object({
  id: z.number(),
  name: z
    .string({ invalid_type_error: requirePermissionGroupText('name') })
    .min(1, requirePermissionGroupText('name')),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  sort: z.number().default(0),
  storeId: z.number().default(0),
  permission: z.array(
    z.object({
      permissionId: z.number().nullable(),
      permissionName: z.string().nullable(),
    })
  ),
});

export type PermissionGroup = z.infer<typeof permissionGroupSchema>;
export type PermissionGroupItem = ArrayElement<PermissionGroup['permission']>;
