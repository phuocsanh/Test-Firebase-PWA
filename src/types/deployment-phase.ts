import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireDeploymentPhaseText = requiredTextWithNamespace('deploymentPhase');

// giai đoạn triển khai dự án
// storeId
// branchId
// id
// code
// name
// note
// is_active

export const deploymentPhaseSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireDeploymentPhaseText('code'),
      invalid_type_error: requireDeploymentPhaseText('code'),
    })
    .min(1, { message: requireDeploymentPhaseText('code') }),
  name: z
    .string({
      required_error: requireDeploymentPhaseText('name'),
      invalid_type_error: requireDeploymentPhaseText('name'),
    })
    .min(1, { message: requireDeploymentPhaseText('name') }),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type DeploymentPhase = z.infer<typeof deploymentPhaseSchema>;
