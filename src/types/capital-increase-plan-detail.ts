import { z } from "zod"

export const capitalIncreasePlanDetails = z.object({
  projectCode: z.string().nullable().optional(),
  projectName: z.string().nullable().optional(),
  budgetSourceCodeCode: z.string().nullable().optional(),
  budgetSourceCodeName: z.string().nullable().optional(),
  id: z.number().nullable().optional(),
  capitalIncreasePlanId: z.number().nullable().optional(),
  projectId: z.number().nullable().optional(),
  budgetSourceCodeId: z.number().nullable().optional(),
  programCode: z.string().nullable().optional(),
  sectorCode: z.string().nullable().optional(),
  typeCode: z.string().nullable().optional(),
  itemCode: z.string().nullable().optional(),
  totalAmount: z.number().nullable().optional(),
  budgetYear: z.date().nullable().optional(),
});

export type CapitalIncreasePlanDetails = z.infer<typeof capitalIncreasePlanDetails>;
