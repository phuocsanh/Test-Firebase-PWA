import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireBorrowDocumentText = requiredTextWithNamespace('borrowDocument');

// Theo dõi cho mượn hồ sơ
// id
// sort
// branchId
// storeId
// code
// note

// borrowDocumentTime
// userCreatedId
// borrowDocumentDate
// borrowerId
// recordCode
// documentName
// boxNumber
// warehouse
// usageContent
// lenderId
// preBorrowingCondition
// returnDate
// conditionAfterBorrowing
// statusId

export const borrowDocumentSchema = z.object({
  //các trường mặc định
  id: z.number(),
  sort: z.string().nullable().optional(),
  branchId: z.number().nullable().optional(),
  storeId: z.number().nullable().optional(),
  note: z.string().nullable().optional(),

  // các trường của màn hình thông tin cho mượn hồ sơ
  borrowDocumentTime: z.date(), // Ngày lập
  userCreatedId: z
    .number({
      required_error: requireBorrowDocumentText('userCreatedId', 'select'),
      invalid_type_error: requireBorrowDocumentText('userCreatedId', 'select'),
    })
    .min(1, { message: requireBorrowDocumentText('userCreatedId', 'select') }), // Người lập
  borrowDocumentDate: z.date(), // Ngày mượn
  borrowerId: z
    .number({
      required_error: requireBorrowDocumentText('borrowerId', 'select'),
      invalid_type_error: requireBorrowDocumentText('borrowerId', 'select'),
    })
    .min(1, { message: requireBorrowDocumentText('borrowerId', 'select') }), // Người mượn
  recordCode: z
    .string({
      required_error: requireBorrowDocumentText('recordCode'),
      invalid_type_error: requireBorrowDocumentText('recordCode'),
    })
    .min(1, { message: requireBorrowDocumentText('recordCode') }), // Mã số hồ sơ
  documentName: z
    .string({
      required_error: requireBorrowDocumentText('documentName'),
      invalid_type_error: requireBorrowDocumentText('documentName'),
    })
    .min(1, { message: requireBorrowDocumentText('documentName') }), // Tên hồ sơ
  boxNumber: z.string().nullable().optional(), // Số hộp
  warehouse: z.string().nullable().optional(), // Kho
  usageContent: z.string().nullable().optional(), // Nội dung sử dụng
  lenderId: z
    .number({
      required_error: requireBorrowDocumentText('lenderId', 'select'),
      invalid_type_error: requireBorrowDocumentText('lenderId', 'select'),
    })
    .min(1, { message: requireBorrowDocumentText('lenderId', 'select') }), // Người cho mượn
  preBorrowingCondition: z.string().nullable().optional(), // Tình trạng trước mượn
  returnDate: z.date().nullable(), // Ngày trả
  conditionAfterBorrowing: z.string().nullable().optional(), // Tình trạng sau mượn
  statusId: z.number().nullable().optional(), //trạng thái
});

export type BorrowDocument = z.infer<typeof borrowDocumentSchema>;

export const defaultValuesBorrowDocument = {
  id: 0,
  sort: '',
  branchId: null,
  storeId: null,
  note: '',

  borrowDocumentTime: new Date(),
  userCreatedId: 0,
  borrowDocumentDate: new Date(),
  borrowerId: 0,
  recordCode: '',
  documentName: '',
  boxNumber: '',
  warehouse: '',
  usageContent: '',
  lenderId: 0,
  preBorrowingCondition: '',
  returnDate: null,
  conditionAfterBorrowing: '',
  statusId: 0,
};
