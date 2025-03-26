import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireWarehouseText = requiredTextWithNamespace('warehouse');

export const warehouseSchema = z.object({
  isInactive: z.boolean(),
  id: z.number(),
  code: z
    .string({
      required_error: requireWarehouseText('code'),
      invalid_type_error: requireWarehouseText('code'),
    })
    .min(1, requireWarehouseText('code'))
    .nullable(),
  name: z
    .string({
      required_error: requireWarehouseText('name'),
      invalid_type_error: requireWarehouseText('name'),
    })
    .min(1, requireWarehouseText('name'))
    .nullable(),
  address: z.string().optional().nullable(),
  stocker: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  isDelete: z.boolean(),
  storeId: z.number(),
  isDefault: z.boolean(),
});

export type WarehouseWithCurrentStock = {
  warehouseName: string;
  id: number;
  warehouseId: number;
  productId: number;
  currentStockQuantity: number;
};

export type Warehouse = z.infer<typeof warehouseSchema>;
