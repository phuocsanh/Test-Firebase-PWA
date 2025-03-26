import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

const requireProductText = requiredTextWithNamespace('productBom');

export const productBomSchema = z.object({
  storeId: z.number(),
  id: z.number(),
  note: z.string().optional().nullable(),
  userCreateId: z.number().nullable().optional(),
  productBomTime: z.date(),
  ids: z.number().nullable(),
  sort: z.string().nullable(),
  productId: z.number().nullable(),
  productName: z.string().optional(),
  productCode: z.string().optional(),
  unitName: z.string().optional(),
  warehouseName: z.string().optional(),
  code: z
    .string({
      required_error: requireProductText('code'),
      invalid_type_error: requireProductText('code'),
    })
    .min(1, { message: requireProductText('code') }),
  name: z
    .string({
      required_error: requireProductText('name'),
      invalid_type_error: requireProductText('name'),
    })
    .min(1, { message: requireProductText('name') }),
  unitId: z
    .number({
      required_error: requireProductText('unitId'),
      invalid_type_error: requireProductText('unitId'),
    })
    .min(1, { message: requireProductText('unitId') }),
  unitExchange: z.number().nullable(),
  quantity: z.number().nullable(),
  warehouseId: z.number().nullable(),
  isApply: z.boolean(),
  productBomMaterials: z.array(
    z.object({
      id: z.number(),
      productBomId: z.number(),
      materialId: z.number().nullable(),
      productId: z.number(), // product Id is temperature use for materialId
      unitId: z.number(),
      unitExchange: z.number(),
      quantity: z.number(),
      percentLoss: z.number().nullable(),
      note: z.string(),
      warehouseId: z.number().nullable(),
      price: z.number().nullable(),
      totalAmount: z.number().nullable(),
    })
  ),
  productBomOperations: z.array(
    z.object({
      id: z.number(),
      productBomId: z.number(),
      operationId: z.number().nullable(),
      note: z.string(),
      order: z.number().optional(),
    })
  ),
});

export type ProductBom = z.infer<typeof productBomSchema>;
export type ProductBomMaterial = ArrayElement<ProductBom['productBomMaterials']>;
export type ProductBomOperation = ArrayElement<ProductBom['productBomOperations']>;

export const defaultProductBomValues: ProductBom = {
  storeId: 0,
  id: 0,
  note: '',
  userCreateId: 0,
  productBomTime: new Date(),
  ids: 0,
  sort: '',
  productId: 0,
  code: '',
  name: '',
  unitId: 0,
  unitExchange: 1,
  quantity: 1,
  warehouseId: 0,
  isApply: true,
  productBomMaterials: [
    {
      id: 0,
      productBomId: 0,
      materialId: 0,
      productId: 0,
      unitId: 0,
      unitExchange: 1,
      quantity: 0,
      percentLoss: 0,
      note: '',
      warehouseId: 0,
      price: 0,
      totalAmount: 0,
    },
  ],
  productBomOperations: [
    {
      id: 0,
      productBomId: 0,
      operationId: 0,
      note: '',
      order: 0,
    },
  ],
};
