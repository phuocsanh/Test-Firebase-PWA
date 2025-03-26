import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireOutstandingEquipmentText = requiredTextWithNamespace('outstandingEquipment');

export const outstandingEquipmentDetailSchema = z.object({
  id: z.number(),
  outstandingEquipmentId: z
    .number({
      required_error: requireOutstandingEquipmentText('outstandingEquipmentId'),
      invalid_type_error: requireOutstandingEquipmentText('outstandingEquipmentId'),
    })
    .nullable(),
  inventoryItemId: z
    .number({
      required_error: requireOutstandingEquipmentText('inventoryItemId'),
      invalid_type_error: requireOutstandingEquipmentText('inventoryItemId'),
    })
    .nullable(),
  unitId: z
    .number({
      required_error: requireOutstandingEquipmentText('unitId'),
      invalid_type_error: requireOutstandingEquipmentText('unitId'),
    })
    .nullable(),
  quantity: z.number().nullable(),
  price: z.number().nullable(),
  remainingValue: z.number().nullable(),
  outstandingEquipmentType: z.number().nullable(),
  entityName: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const outstandingEquipmentSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  note: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  outstandingEquipmentTime: z.date().nullable().optional(),
  userCreatedId: z
    .number({
      required_error: requireOutstandingEquipmentText('userCreatedId'),
      invalid_type_error: requireOutstandingEquipmentText('userCreatedId'),
    })
    .min(1, { message: requireOutstandingEquipmentText('userCreatedId') }),
  projectId: z
    .number({
      required_error: requireOutstandingEquipmentText('projectId'),
      invalid_type_error: requireOutstandingEquipmentText('projectId'),
    })
    .min(1, { message: requireOutstandingEquipmentText('projectId') }),
  totalAmount: z.number().nullable(),
  outstandingEquipmentDetails: z.array(outstandingEquipmentDetailSchema),
  outstandingEquipmentDetailsAllocated: z.array(outstandingEquipmentDetailSchema),
  outstandingEquipmentDetailsProcessed: z.array(outstandingEquipmentDetailSchema),
});

export type OutstandingEquipment = z.infer<typeof outstandingEquipmentSchema>;
export type OutstandingEquipmentDetail = z.infer<typeof outstandingEquipmentDetailSchema>;

export const defaultValuesOutstandingEquipmentDetail: OutstandingEquipmentDetail = {
  id: 0, // Khóa chính
  outstandingEquipmentId: 0, // Thiết bị tồn đọng
  inventoryItemId: 0, // Thiết bị tồn đọng
  unitId: 0, // Đơn vị tính
  quantity: 0, // Số lượng
  price: 0, // Đơn giá
  remainingValue: 0, // Giá trị còn lại
  outstandingEquipmentType: null, // Loại (1 Giao 2 Xử lý)
  entityName: '', // Đơn vị tiếp nhận sử dụng
  note: '', // Ghi chú
};
export const defaultValuesOutstandingEquipment: OutstandingEquipment = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  note: '', // Ghi chú
  code: '', // Mã phiếu
  outstandingEquipmentTime: new Date(), // Ngày lập
  userCreatedId: 0, // Người lập
  projectId: 0, // Dự án
  totalAmount: 0, // Tổng tiền,
  outstandingEquipmentDetails: [defaultValuesOutstandingEquipmentDetail],
  outstandingEquipmentDetailsAllocated: [defaultValuesOutstandingEquipmentDetail],
  outstandingEquipmentDetailsProcessed: [defaultValuesOutstandingEquipmentDetail],
};
