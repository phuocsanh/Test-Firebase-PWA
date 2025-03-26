import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

const requiredPrintFormText = requiredTextWithNamespace('printForm');

export const printTypeSchema = z.object({
  isActive: z.boolean(),
  storeId: z.number().nullable(),
  id: z.number(),
  code: z.string({
    invalid_type_error: requiredPrintFormText('printType.code'),
    required_error: requiredPrintFormText('printType.code'),
  }),
  name: z.string({
    invalid_type_error: requiredPrintFormText('printType.name'),
    required_error: requiredPrintFormText('printType.name'),
  }),
  note: z.string(),
  printTypeLabel: z.array(
    z.object({
      id: z.number(),
      printTypeId: z.number().nullable(),
      printLabelId: z.number().nullable(),
      labelKey: z.string(),
      labelName: z.string(),
      note: z.string(),
      dataField: z.string(),
    })
  ),
});

export type PrintType = z.infer<typeof printTypeSchema>;
export type PrintLabel = ArrayElement<PrintType['printTypeLabel']>;

export const defaultPrintTypeValues: PrintType = {
  isActive: true,
  code: '',
  id: 0,
  name: '',
  note: '',
  storeId: null,
  printTypeLabel: [
    {
      id: 0,
      printTypeId: 0,
      printLabelId: null,
      labelKey: '',
      labelName: '',
      note: '',
      dataField: '',
    },
  ],
};
