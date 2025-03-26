import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
const requireItCourseText = requiredTextWithNamespace('itCourse');

// cơ quan ban hàng
// storeId
// branchId
// id
// code

// name
// note
// is_active

export const itCourseSchema = z.object({
  id: z.number(),

  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  code: z
    .string({
      required_error: requireItCourseText('code'),
      invalid_type_error: requireItCourseText('code'),
    })

    .min(1, { message: requireItCourseText('code') }),
  name: z
    .string({
      required_error: requireItCourseText('name'),
      invalid_type_error: requireItCourseText('name'),
    })

    .min(1, { message: requireItCourseText('name') }),

  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ItCourse = z.infer<typeof itCourseSchema>;
