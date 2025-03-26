import { z } from 'zod';
import { requiredTextWithNamespace } from '@/lib/i18nUtils';

const requireText = requiredTextWithNamespace('professionApprovalProcessApproval');

export const professionApprovalProcessApprovalSchema = z.object({
  professionApprovalProcessId: z
    .number({
      required_error: requireText('professionApprovalProcessId'),
      invalid_type_error: requireText('professionApprovalProcessId'),
    })
    .min(1, { message: requireText('professionApprovalProcessId') }), // Nghiệp vụ duyệt

  currentStep: z
    .number({
      required_error: requireText('currentStep'),
      invalid_type_error: requireText('currentStep'),
    })
    .min(1, { message: requireText('currentStep') }), // Bước hiện tại

  returnStep: z
    .number({
      required_error: requireText('currentStep'),
      invalid_type_error: requireText('currentStep'),
    })
    .nullable(), // Bước quay lại

  requesterId: z.number().nullable(), // Người yêu cầu

  approveDeadline: z.coerce.date().nullable(), // Hạn phê duyệt

  note: z
    .string({
      required_error: requireText('note'),
      invalid_type_error: requireText('note'),
    })
    .nullable(), // Ghi chú

  isApprove: z
    .boolean({
      required_error: requireText('isApprove'),
      invalid_type_error: requireText('isApprove'),
    })
    .nullable(), // Đồng ý / Từ chối

  comment: z
    .string({
      required_error: requireText('comment'),
      invalid_type_error: requireText('comment'),
    })
    .min(1, { message: requireText('comment') }), // Nhận xét

  approverId: z.number().nullable(), // Người duyệt hiện tại

  approveStatusId: z.number().nullable(), // Trạng thái khi đồng ý

  declineStatusId: z.number().nullable(), // Trạng thái khi từ chối

  //next
  nextApproverId: z
    .number({
      required_error: requireText('approverId'),
      invalid_type_error: requireText('approverId'),
    })
    .min(1, { message: requireText('approverId') }), // Người duyệt tiếp theo
  nextApproveDeadline: z.coerce.date().nullable(), // Hạn phê duyệt
  nextNote: z
    .string({
      required_error: requireText('note'),
      invalid_type_error: requireText('note'),
    })
    .min(1, { message: requireText('note') }), // Ghi chú
});

export type ProfessionApprovalProcessApproval = z.infer<
  typeof professionApprovalProcessApprovalSchema
>;
