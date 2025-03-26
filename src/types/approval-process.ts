import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireApprovalProcessText = requiredTextWithNamespace('approvalProcess');

export const approvalProcessCurrentStepSchema = z.object({
  approverId: z.number().nullable().optional(),
  positionId: z.number().nullable().optional(),
  approveStatusId: z.number().nullable().optional(),
  forwardStatusId: z.number().nullable().optional(),
  step: z.number().nullable().optional(),
  returnStep: z.number().nullable().optional(),
  declineStatusId: z.number().nullable().optional(),
  requesterId: z.number().nullable().optional(),
  approveDeadline: z.date().nullable().optional(),
  note: z.string().nullable().optional(),
  professionApprovalProcessId: z.number().nullable().optional(),
});

export const approvalProcessNextStepSchema = z.object({
  approverId: z.number().nullable().optional(),
  positionId: z.number().nullable().optional(),
  approveStatusId: z.number().nullable().optional(),
  forwardStatusId: z.number().nullable().optional(),
  step: z.number().nullable().optional(),
  returnStep: z.number().nullable().optional(),
  declineStatusId: z.number().nullable().optional(),
  requesterId: z.number().nullable().optional(),
  approveDeadline: z.date().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const approveHistorySchema = z.object({
  id: z.number().optional(),
  professionApprovalProcessId: z.number().nullable().optional(),
  professionType: z.number().nullable().optional(),
  refId: z.number().nullable().optional(),
  step: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  requesterId: z.number().nullable().optional(),
  approveDeadline: z.date().nullable().optional(),
  isApprove: z.boolean().nullable().optional(),
  approveOrRejectTime: z.date().nullable().optional(),
  comment: z.string().nullable().optional(),
  approverId: z.number().nullable().optional(),
  statusId: z.number().nullable().optional(),
});

export const approvalProcessSchema = z.object({
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  isActive: z.boolean().nullable().optional(),
  id: z.number(),
  code: z
    .string({
      required_error: requireApprovalProcessText('code'),
      invalid_type_error: requireApprovalProcessText('code'),
    })
    .min(1, { message: requireApprovalProcessText('code') }),
  name: z
    .string({
      required_error: requireApprovalProcessText('name'),
      invalid_type_error: requireApprovalProcessText('name'),
    })
    .min(1, { message: requireApprovalProcessText('name') }),
  approvalProcessTime: z.date(),
  userCreatedId: z.number(),
  note: z.string().nullable().optional(),
  ids: z.number().nullable(),
  sort: z.string().nullable().optional(),
  approvalProcessDetails: z.array(
    z.object({
      id: z.number(),
      approvalProcessId: z.number().nullable(),
      positionId: z.number().nullable(),
      approveStatusId: z.number().nullable(),
      forwardStatusId: z.number().nullable(),
      step: z.number().nullable(),
      returnStep: z.number().nullable(),
      declineStatusId: z.number().nullable(),
      note: z.string().nullable().optional(),
    })
  ),
});

export type ApprovalProcess = z.infer<typeof approvalProcessSchema>;
export type ApprovalProcessDetails = ArrayElement<ApprovalProcess['approvalProcessDetails']>;

export type ApprovalProcessCurrentStep = z.infer<typeof approvalProcessCurrentStepSchema>;
export type ApprovalProcessNextStep = z.infer<typeof approvalProcessNextStepSchema>;
export type ApproveHistory = z.infer<typeof approveHistorySchema>;

export const approvalProcessWithOrderModuleSchema = z.object({
  statusId: z.number().nullable().optional(), //trạng thái
  approvalProcessId: z.number().nullable().optional(), //quy trình duyệt
  approvalProcessCurrentStep: approvalProcessCurrentStepSchema.nullable().optional(),
  approvalProcessNextStep: approvalProcessNextStepSchema.nullable().optional(),
  approveHistories: z.array(approveHistorySchema).nullable().optional(),
});

export const defaultValuesApprovalProcess: ApprovalProcess = {
  storeId: null, //
  branchId: null, //
  isActive: true, // Hoạt động
  id: 0, // Khóa chính
  code: '', // Mã quy trình
  name: '', // Tên quy trình
  approvalProcessTime: new Date(), // Ngày lập
  userCreatedId: 0, // Người lập
  note: '', // Ghi chú
  ids: null, // ids
  sort: '', // sort,
  approvalProcessDetails: [
    {
      id: 0, // Khóa chính
      approvalProcessId: 0, // Thiết lập quy trình duyệt
      positionId: null, // Chức vụ
      approveStatusId: null, // Trạng thái khi đồng ý
      forwardStatusId: null, // Trạng thái khi chuyển tiếp
      step: 1, // Bước
      returnStep: null, // Bước quay lại
      declineStatusId: null, // Trạng thái khi từ chối
      note: '', // Ghi chú
    },
  ],
};
