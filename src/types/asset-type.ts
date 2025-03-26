import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireAssetTypeText = requiredTextWithNamespace('assetType');
//loại tài sản
export const assetTypeSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireAssetTypeText('code'),
      invalid_type_error: requireAssetTypeText('code'),
    })
    .min(1, { message: requireAssetTypeText('code') }),
  name: z
    .string({
      required_error: requireAssetTypeText('name'),
      invalid_type_error: requireAssetTypeText('name'),
    })
    .min(1, { message: requireAssetTypeText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type AssetType = z.infer<typeof assetTypeSchema>;
