import { requiredTextWithNamespace } from '@/lib/i18nUtils';

import { z } from 'zod';

const requireBudgetSourceCodeText = requiredTextWithNamespace('budgetSourceCode');
// mã nguồn ngân sách
// storeId
// branchId
// id
// code
// name
// note
// is_active
export const budgetSourceCode = z.object({
  id: z.number(), // Khóa chính
  storeId: z.number().nullable(), // cửa hàng
  branchId: z.number().nullable(), // chi nhánh
  code: z
    .string({
      required_error: requireBudgetSourceCodeText('code'),
      invalid_type_error: requireBudgetSourceCodeText('code'),
    })
    .min(1, { message: requireBudgetSourceCodeText('code') }), // mã
  name: z
    .string({
      required_error: requireBudgetSourceCodeText('name'),
      invalid_type_error: requireBudgetSourceCodeText('name'),
    })
    .min(1, { message: requireBudgetSourceCodeText('name') }), // tên
  note: z.string().optional().nullable(), // ghi chú
  isActive: z.boolean().default(true), // hoạt động
});

export type BudgetSourceCode = z.infer<typeof budgetSourceCode>;
export type BudgetSourceCodeCommon = {
  projectCode: string;
  projectName: string;
  budgetSourceCodeCode: string;
  budgetSourceCodeName: string;
  id: number;
  capitalIncreasePlanId: number;
  projectId: number;
  budgetSourceCodeId: number;
  programCode: string;
  sectorCode: string;
  typeCode: string;
  itemCode: string;
  totalAmount: number;
  budgetYear: string;
};

export const defaultBudgetSourceCodeValues = {
  id: 0, // Khóa chính
  code: '', // Mã
  name: '', // Tên
  note: '', // Ghi chú
  isActive: true, // Hoạt động
  storeId: null, // cửa hàng
  branchId: null, // Chi nhánh
};
