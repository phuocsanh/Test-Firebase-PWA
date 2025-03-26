import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireAssetText = requiredTextWithNamespace('asset');

//tài sản
export const assetSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  unitId: z
    .number({
      required_error: requireAssetText('unitId'),
      invalid_type_error: requireAssetText('unitId'),
    })
    .min(1, { message: requireAssetText('unitId') }),
  // .nullable(),
  assetTypeId: z
    .number({
      required_error: requireAssetText('assetTypeId'),
      invalid_type_error: requireAssetText('assetTypeId'),
    })
    .min(1, { message: requireAssetText('assetTypeId') }),
  // .nullable(),
  code: z
    .string({
      required_error: requireAssetText('code'),
      invalid_type_error: requireAssetText('code'),
    })
    .min(1, { message: requireAssetText('code') }),
  name: z
    .string({
      required_error: requireAssetText('name'),
      invalid_type_error: requireAssetText('name'),
    })
    .min(1, { message: requireAssetText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Asset = z.infer<typeof assetSchema>;

export const defaultAssetValues: Asset = {
  id: 0,
  code: '',
  name: '',
  unitId: 0,
  assetTypeId: 0,
  note: '',
  isActive: true,
  storeId: null,
  branchId: null,
};
