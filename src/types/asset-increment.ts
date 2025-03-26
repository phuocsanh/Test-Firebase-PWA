import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireAssetIncrementText = requiredTextWithNamespace('assetIncrement');

//ghi tăng tài sản
export const assetIncrementSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  note: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  userCreatedId: z.number().nullable().optional(),
  projectId: z
    .number({
      required_error: requireAssetIncrementText('projectId', 'select'),
      invalid_type_error: requireAssetIncrementText('projectId', 'select'),
    })
    .min(1, requireAssetIncrementText('projectId', 'select')),
  assetTypeId: z
    .number({
      required_error: requireAssetIncrementText('assetTypeId', 'select'),
      invalid_type_error: requireAssetIncrementText('assetTypeId', 'select'),
    })
    .min(1, requireAssetIncrementText('assetTypeId', 'select')),
  totalAmount: z.number().nullable(),
  assetIncrementTime: z.date(),
  assetIncrementDetails: z.array(
    z.object({
      id: z.number(),
      assetIncrementId: z.number().nullable(),
      assetId: z.number(),
      unitId: z.number().nullable(),
      quantity: z.number(),
      price: z.number(),
      totalOriginalValue: z.number().nullable(),
      putIntoUseDate: z.date().nullable().optional(),
      investmentFundingTypeId: z.number().nullable(),
      entityName: z.string().nullable().optional(),
      note: z.string().nullable().optional(),
    })
  ),
});

export type AssetIncrement = z.infer<typeof assetIncrementSchema>;
export type AssetIncrementDetail = ArrayElement<AssetIncrement['assetIncrementDetails']>;

export const defaultValuesAssetIncrement: AssetIncrement = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  note: '', // Ghi chú
  code: '', // Mã phiếu
  userCreatedId: null, // Người lập
  projectId: 0, // Dự án
  assetTypeId: 0, // Loại tài sản
  totalAmount: 0, // Tổng tiền
  assetIncrementTime: new Date(), // Ngày lập,

  assetIncrementDetails: [
    {
      id: 0, // Khóa chính
      assetIncrementId: 0, // Ghi tăng tài sản
      assetId: 0, // Tên tài sản
      unitId: null, // Đơn vị tính
      quantity: 0, // Số lượng
      price: 0, // Đơn giá
      totalOriginalValue: 0, // Tổng nguyên giá
      putIntoUseDate: new Date(), // Ngày đưa tài sản vào sử dụng
      investmentFundingTypeId: null, // Loại vốn đầu tư hình thành tài sản:budget_fund:code;name
      entityName: '', // Đơn vị tiếp nhận sử dụng
      note: '', // Ghi chú
    },
  ],
};
