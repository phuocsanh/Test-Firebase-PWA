import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

export const requireGuaranteeLetterTrackingText =
  requiredTextWithNamespace('guaranteeLetterTracking');

export const guaranteeLetterTrackingSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  id: z.number(),
  guaranteeLetterTrackingTime: z.date().nullable().optional(),
  userCreatedId: z
    .number({
      required_error: requireGuaranteeLetterTrackingText('userCreatedId', 'select'),
      invalid_type_error: requireGuaranteeLetterTrackingText('userCreatedId', 'select'),
    })
    .min(1, { message: requireGuaranteeLetterTrackingText('userCreatedId', 'select') }),
  correspondenceDate: z.date().nullable().optional(),
  contractNumber: z.string().nullable().optional(),
  correspondenceTypeId: z
    .number({
      required_error: requireGuaranteeLetterTrackingText('correspondenceTypeId', 'select'),
      invalid_type_error: requireGuaranteeLetterTrackingText('correspondenceTypeId', 'select'),
    })
    .min(1, { message: requireGuaranteeLetterTrackingText('correspondenceTypeId', 'select') }),
  entityName: z.string().nullable().optional(),
  projectId: z
    .number({
      required_error: requireGuaranteeLetterTrackingText('projectId', 'select'),
      invalid_type_error: requireGuaranteeLetterTrackingText('projectId', 'select'),
    })
    .min(1, { message: requireGuaranteeLetterTrackingText('projectId', 'select') }),
  officerId: z
    .number({
      required_error: requireGuaranteeLetterTrackingText('officerId', 'select'),
      invalid_type_error: requireGuaranteeLetterTrackingText('officerId', 'select'),
    })
    .min(1, { message: requireGuaranteeLetterTrackingText('officerId', 'select') }),
  responsibleAccountantId: z
    .number({
      required_error: requireGuaranteeLetterTrackingText('responsibleAccountantId', 'select'),
      invalid_type_error: requireGuaranteeLetterTrackingText('responsibleAccountantId', 'select'),
    })
    .min(1, { message: requireGuaranteeLetterTrackingText('responsibleAccountantId', 'select') }),
  correspondenceValue: z.number().nullable(),
  correspondenceDuration: z.number().nullable(),
  expirationDate: z.date().nullable().optional(),
  statusType: z
    .number({
      required_error: requireGuaranteeLetterTrackingText('statusType', 'select'),
      invalid_type_error: requireGuaranteeLetterTrackingText('statusType', 'select'),
    })
    .min(1, { message: requireGuaranteeLetterTrackingText('statusType', 'select') }),
  note: z.string().nullable().optional(),
});

export type GuaranteeLetterTracking = z.infer<typeof guaranteeLetterTrackingSchema>;

export const defaultValuesGuaranteeLetterTracking: GuaranteeLetterTracking = {
  storeId: null, //
  branchId: null, //
  id: 0, // Khóa chính
  guaranteeLetterTrackingTime: new Date(), // Ngày lập
  userCreatedId: 0, // Người lập
  correspondenceDate: new Date(), // Ngày thư
  contractNumber: '', // Số HĐ
  correspondenceTypeId: 0, // Loại thư
  entityName: '', // Tên đơn vị
  projectId: 0, // Công trình
  officerId: 0, // Cán bộ
  responsibleAccountantId: 0, // Kế toán phụ trách
  correspondenceValue: 0, // Giá trị thư
  correspondenceDuration: 0, // Thời hạn thư
  expirationDate: new Date(), // Ngày hết hạn
  statusType: 0, // Tình trạng 1:Hết hạn 2 Còn hạn
  note: '', // Ghi chú,
};
