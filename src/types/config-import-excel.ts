import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireConfigImportExcelText = requiredTextWithNamespace('import');

export const configImportExcel = z.object({
  storeId: z.number().optional().nullable(),
  id: z.number(),
  professionType: z
    .number({
      required_error: requireConfigImportExcelText('professionType'),
      invalid_type_error: requireConfigImportExcelText('professionType'),
    })
    .min(1, { message: requireConfigImportExcelText('professionType') }),
  sheetName: z.string().optional().nullable(),
  userId: z
    .number({
      required_error: requireConfigImportExcelText('userId'),
      invalid_type_error: requireConfigImportExcelText('userId'),
    })
    .min(1, { message: requireConfigImportExcelText('userId') }),
  fromRow: z.number().optional().nullable(),
  toRow: z.number().optional().nullable(),
  rowName: z.number().optional().nullable(),
  isDefault: z.boolean().optional().nullable(),
  items: z.array(
    z.object({
      id: z.number(),
      configImportExcelId: z.number(),
      nameProfession: z.string().optional().nullable(),
      nameExcel: z.string().optional().nullable(),
      sort: z.number().optional().nullable(),
      nameField: z.string().optional().nullable(),
    })
  ),

  // code: z
  //   .string({
  //     required_error: requireConfigImportExcelText('code'),
  //     invalid_type_error: requireConfigImportExcelText('code'),
  //   })
  //   .min(1, { message: requireConfigImportExcelText('code') }),
});

export type ConfigImportExcel = z.infer<typeof configImportExcel>;
