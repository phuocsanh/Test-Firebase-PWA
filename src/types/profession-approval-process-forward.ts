import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireText = requiredTextWithNamespace('professionApprovalProcessForward');

export const professionApprovalProcessForwardSchema = z.object({
  professionType: z
    .number({
      invalid_type_error: requireText('professionType'),
      required_error: requireText('professionType'),
    })
    .min(1, { message: requireText('professionType') }), // Nghiệp vụ
  refId: z
    .number({
      invalid_type_error: requireText('refId'),
      required_error: requireText('refId'),
    })
    .min(1, { message: requireText('refId') }), // Ref Id
  approvalProcessId: z
    .number({
      invalid_type_error: requireText('approvalProcessId'),
      required_error: requireText('approvalProcessId'),
    })
    .min(1, { message: requireText('approvalProcessId') }), // Quy trình duyệt
  currentStep: z
    .number({
      invalid_type_error: requireText('currentStep'),
      required_error: requireText('currentStep'),
    })
    .min(1, { message: requireText('currentStep') }), // Bước hiện tại
  approveDeadline: z.date().nullable(), // Hạn phê duyệt
  note: z
    .string({
      invalid_type_error: requireText('note'),
      required_error: requireText('note'),
    })
    .min(1, { message: requireText('note') }), // Ghi chú
  approverId: z
    .number({
      invalid_type_error: requireText('approverId'),
      required_error: requireText('approverId'),
    })
    .min(1, { message: requireText('approverId') }), // Người duyệt tiếp theo
  forwardStatusId: z
    .number({
      invalid_type_error: requireText('forwardStatusId'),
      required_error: requireText('forwardStatusId'),
    })
    .min(1, { message: requireText('forwardStatusId') }), // Trạng thái khi chuyển tiếp

  professionApprovalProcessId: z
    .number({
      required_error: requireText('professionApprovalProcessId'),
      invalid_type_error: requireText('professionApprovalProcessId'),
    })
    .nullable(), // Nghiệp vụ duyệt
});

export type ProfessionApprovalProcessForward = z.infer<
  typeof professionApprovalProcessForwardSchema
>;
